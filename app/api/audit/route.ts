import { db,failure,identity,json } from '@/lib/server';
// Account-scoped operational journal, bounded to recent events; no client writes.
export async function GET(req:Request){try{
 const user=identity(req);
 const result=await db().prepare('SELECT id,occurred_at,action,outcome,correlation_id,app_version FROM audit_events WHERE user_id=? ORDER BY occurred_at DESC,id DESC LIMIT 200').bind(user).all();
 return json({events:result.results,limit:200,scope:'account',notice:'Application events only; not a complete security audit.'});
}catch(e){return failure(e);}}
