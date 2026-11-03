import { z } from 'zod';
import { stateSchema } from '@/lib/studio';
import { body,failure,identity,json,readState,writeState,sameOrigin,ApiError } from '@/lib/server';
export async function GET(req:Request){try{return json(await readState(identity(req)));}catch(e){return failure(e);}}
export async function PUT(req:Request){try{sameOrigin(req);const user=identity(req);const parsed=z.object({revision:z.number().int().min(0),state:stateSchema}).safeParse(await body(req,2000000));if(!parsed.success)throw new ApiError(400,'Catatan tidak valid atau batas sesi/pedoman tercapai.');const revision=await writeState(user,parsed.data.revision,parsed.data.state);return json({revision});}catch(e){return failure(e);}}
