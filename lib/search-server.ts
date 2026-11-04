import { DEFAULT_MODEL } from '@/lib/models';
import { parseSearch } from '@/lib/search';
import { MAX_MESSAGES,type Message } from '@/lib/studio';
import { ApiError,readState,writeState,addUsage,quota } from '@/lib/server';
export async function finishSearch(user:string,id:string,raw:unknown){
 const current=await readState(user);const job=current.state.searches?.find(j=>j.id===id);
 if(!job)throw new ApiError(404,'Pencarian tidak ditemukan.');
 const result=parseSearch(raw,job.query);
 if(job.status==='completed')return {state:current.state,revision:current.revision,status:'completed',usage:await quota(user)};
 if(job.status!=='running')throw new ApiError(409,'Pencarian ini sudah berakhir.');
 const target=current.state.sessions.find(s=>s.id===job.sessionId);if(!target||target.messages.length>=MAX_MESSAGES)throw new ApiError(409,'Sesi berubah saat pencarian berjalan. Hasil belum dapat disimpan.');
 const message:Message={id:crypto.randomUUID(),role:'assistant',provider:'live',model:current.state.selectedModel??DEFAULT_MODEL,content:result.content,sources:result.sources,searchId:id};
 const state={...current.state,sessions:current.state.sessions.map(s=>s.id===target.id?{...s,messages:[...s.messages,message]}:s),searches:current.state.searches?.map(j=>j.id===id?{...j,status:'completed' as const,finishedAt:new Date().toISOString()}:j)};
 let revision:number;try{revision=await writeState(user,current.revision,state);}catch(e){const latest=await readState(user);if(latest.state.searches?.some(j=>j.id===id&&j.status==='completed'))return {state:latest.state,revision:latest.revision,status:'completed',usage:await quota(user)};throw e;}
 await addUsage(user,result.usage?.input_tokens??0,result.usage?.output_tokens??0);
 return {state,revision,status:'completed',usage:await quota(user)};
}
