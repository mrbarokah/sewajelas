import { body,db,failure,identity,json,sameOrigin,ApiError } from '@/lib/server';
export async function POST(req:Request){try{
 sameOrigin(req);const user=identity(req);const payload=await body(req,1000) as {confirmation?:unknown};
 if(payload.confirmation!=='HAPUS')throw new ApiError(400,'Ketik HAPUS untuk mengonfirmasi.');
 const database=db();await database.batch([
  database.prepare('DELETE FROM audit_events WHERE user_id=?').bind(user),
  database.prepare('DELETE FROM studio WHERE user_id=?').bind(user),
  database.prepare('DELETE FROM credentials WHERE user_id=?').bind(user),
  database.prepare("DELETE FROM quotas WHERE substr(id,1,length(?)+1)=? || ':' AND length(id)=length(?)+11").bind(user,user,user)
 ]);
 return json({deleted:true});
}catch(e){return failure(e);}}
