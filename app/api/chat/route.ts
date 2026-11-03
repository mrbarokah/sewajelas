import { blankProfile,memoryPrompt,memoryFormat,memoryReplySchema,parseMemoryReply,isProfileSaveRequest,applyMemory } from '@/lib/profile';
import { DEFAULT_MODEL } from '@/lib/models';
import { z } from 'zod';
import { messageSchema,makePrompt,compactHistory,replaceReply,MAX_MESSAGES,type Message } from '@/lib/studio';
import { body,failure,identity,json,sameOrigin,ApiError,getKey,readState,writeState,reserve,metaCall,addUsage,quota } from '@/lib/server';

// Retain the previous request contract while already-open 0.1 clients update.
const legacy=z.object({role:z.enum(['renter','owner']),scenario:z.enum(['intro','water','cost','hesitant']),messages:z.array(messageSchema).min(1).max(MAX_MESSAGES)});
const savedSession=z.object({sessionId:z.string().min(1).max(100),lastUserId:z.string().min(1).max(100),retryId:z.string().max(100).optional()});
export async function POST(req:Request){try{
 sameOrigin(req);const user=identity(req);const raw=await body(req,1000000);
 const saved=savedSession.safeParse(raw);const old=legacy.safeParse(raw);
 if(!saved.success&&!old.success)throw new ApiError(400,'Pesan atau sesi tidak valid.');
 const snapshot=await readState(user);const session=saved.success?snapshot.state.sessions.find(s=>s.id===saved.data.sessionId):undefined;
 if(saved.success&&!session)throw new ApiError(404,'Sesi belum tersimpan pada akun ini. Simpan ulang sebelum melanjutkan.');
 let messages:Message[];let retry:Message|undefined;
 if(session&&saved.success){
  const lastUser=session.messages.filter(m=>m.role==='user').at(-1);
  if(lastUser?.id!==saved.data.lastUserId)throw new ApiError(409,'Percakapan sudah berubah. Muat ulang setelah mengekspor salinan lokal.');
  const tail=session.messages.at(-1);
  if(!saved.data.retryId&&tail?.role==='assistant')return json({content:tail.content,provider:tail.provider,state:snapshot.state,revision:snapshot.revision,cached:true,usage:await quota(user)});
  if(saved.data.retryId){
   retry=session.messages.find(m=>m.id===saved.data.retryId);
   if(!retry||retry.role!=='assistant'||tail?.id!==retry.id)throw new ApiError(400,'Hanya jawaban terakhir yang bisa dicoba ulang.');
   if((retry.revisions?.length??0)>=100)throw new ApiError(400,'Batas revisi jawaban tercapai. Ekspor catatan sebelum memulai sesi baru.');
   messages=session.messages.slice(0,-1);
  }else{if(session.messages.length>=MAX_MESSAGES)throw new ApiError(400,'Batas sesi tercapai. Ekspor lalu buat sesi baru.');messages=session.messages;}
 }else messages=old.success?old.data.messages:[];
 let history:ReturnType<typeof compactHistory>;
 try{history=compactHistory(messages);}catch(e){throw new ApiError(413,(e as Error).message);}
 const key=await getKey(user);if(!key)throw new ApiError(409,'Kunci Muse belum terhubung. Mode Muse tetap dipilih; hubungkan kembali di pengaturan.');
 const role=session?.role??(old.success?old.data.role:'renter');const scenario=session?.scenario??(old.success?old.data.scenario:'intro');
 await reserve(user);
 const useMemory=!!session&&role==='renter';
 const profile=snapshot.state.profile??blankProfile;
 const answer=await metaCall(key,[{role:'developer',content:makePrompt(role,scenario,snapshot.state.lessons)+(useMemory?memoryPrompt(profile):'')},...history],2048,snapshot.state.selectedModel??DEFAULT_MODEL,useMemory?memoryFormat:undefined);
 let memory:ReturnType<typeof memoryReplySchema.parse>|undefined;
 if(useMemory){memory=parseMemoryReply(answer.content)??undefined;if(!memory)throw new ApiError(502,'Respons Muse tidak dapat dibaca, jadi profil belum diubah. Pesanmu tetap tersimpan. Coba balas pesan terakhir lagi.');answer.content=memory.reply;}
 await addUsage(user,answer.input,answer.output);
 if(session&&saved.success){
  const lastUser=messages.filter(m=>m.role==='user').at(-1)!;
  const nextProfile=memory?applyMemory(profile,memory,lastUser,role,messages):profile;
  if(memory&&isProfileSaveRequest(lastUser.content)){
   const changed=JSON.stringify(profile)!==JSON.stringify(nextProfile);
   answer.content=changed?'Profil dan tujuan sudah diperbarui dari informasi yang dapat dicocokkan dengan pesanmu. Silakan periksa hasilnya di Profil & tujuan.':!profile.autoSave?'Profil belum diperbarui karena penyimpanan otomatis sedang dimatikan. Aktifkan di Profil & tujuan, lalu coba lagi.':'Belum ada perubahan profil yang bisa dipastikan dari pesanmu, atau nilainya terkunci. Periksa Profil & tujuan, lalu coba lagi dengan rincian yang ingin disimpan.';
  }
  const reply:Message={id:retry?.id??crypto.randomUUID(),role:'assistant',content:answer.content,provider:'live',model:snapshot.state.selectedModel??DEFAULT_MODEL,replyTo:saved.data.lastUserId};
  const updated={...session,messages:retry?session.messages.map(m=>m.id===retry.id?replaceReply(m,reply):m):[...session.messages,reply]};
  const state={...snapshot.state,...(memory?{profile:nextProfile}:{}),sessions:snapshot.state.sessions.map(s=>s.id===session.id?updated:s)};
  // Save before returning: a disconnected browser can recover this reply on reload.
  const revision=await writeState(user,snapshot.revision,state);
  return json({content:answer.content,provider:'live',state,revision,usage:await quota(user)});
 }
 return json({content:answer.content,provider:'live',usage:await quota(user)});
}catch(e){return failure(e);}}
