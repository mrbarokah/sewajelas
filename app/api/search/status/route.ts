import { z } from 'zod';
import { body,failure,identity,json,sameOrigin,ApiError,getKey,readState,writeState,quota } from '@/lib/server';
import { finishSearch } from '@/lib/search-server';
import { searchFailure } from '@/lib/search-diagnostics';
export async function POST(req:Request){try{
 sameOrigin(req);const user=identity(req);const parsed=z.object({jobId:z.string().uuid(),recheck:z.boolean().optional()}).safeParse(await body(req,3000));if(!parsed.success)throw new ApiError(400,'Identitas pencarian tidak valid.');
 const snapshot=await readState(user);const job=snapshot.state.searches?.find(j=>j.id===parsed.data.jobId);if(!job)throw new ApiError(404,'Pencarian tidak ditemukan pada akun ini.');
 if(job.status!=='running'&&!(parsed.data.recheck&&job.status==='failed'&&job.providerResponseId))return json({state:snapshot.state,revision:snapshot.revision,status:job.status,usage:await quota(user)});
 if(!job.providerResponseId)throw new ApiError(409,'Status pengiriman belum pasti. Jangan mengulang otomatis; periksa sebelum memulai pencarian baru.');
 const key=await getKey(user);if(!key)throw new ApiError(409,'Hubungkan kembali kunci Meta untuk memeriksa hasil.');
 let res:Response;try{res=await fetch('https://api.meta.ai/v1/responses/'+encodeURIComponent(job.providerResponseId),{headers:{Authorization:'Bearer '+key},signal:AbortSignal.timeout(12000)});}catch{throw new ApiError(504,'Belum dapat memeriksa hasil. Pencarian tidak dibuat ulang.');}
 if(!res.ok)throw new ApiError(res.status===429?429:502,'Meta belum dapat memberikan status pencarian. Coba periksa lagi tanpa memulai pencarian baru.');
 const raw=await res.json() as {status?:string;incomplete_details?:unknown;error?:unknown};
 if(parsed.data.recheck&&job.status==='failed')return json({state:snapshot.state,revision:snapshot.revision,status:job.status,diagnostic:['failed','cancelled','incomplete'].includes(raw.status??'')?searchFailure(raw):'Meta sekarang melaporkan status '+(raw.status==='completed'?'selesai':raw.status==='queued'||raw.status==='in_progress'?'masih diproses':'yang belum dikenali')+'. Tidak ada pencarian baru yang dijalankan.',usage:await quota(user)});
 if(raw.status==='queued'||raw.status==='in_progress')return json({state:snapshot.state,revision:snapshot.revision,status:'running',usage:await quota(user)});
 if(raw.status==='completed')return json(await finishSearch(user,job.id,raw));
 if(['failed','cancelled','incomplete'].includes(raw.status??'')){
  const latest=await readState(user);const state={...latest.state,searches:latest.state.searches?.map(j=>j.id===job.id&&j.status==='running'?{...j,status:'failed' as const,error:searchFailure(raw),finishedAt:new Date().toISOString()}:j)};
  const revision=await writeState(user,latest.revision,state);return json({state,revision,status:'failed',usage:await quota(user)});
 }
 throw new ApiError(502,'Status pencarian dari Meta belum dikenali. Tidak ada pencarian baru yang dijalankan.');
}catch(e){return failure(e);}}
