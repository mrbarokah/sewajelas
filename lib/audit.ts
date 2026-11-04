import { db } from '@/lib/server';
import { APP_VERSION } from '@/lib/studio';
// Event names and outcomes are code-controlled. Never pass message text, URLs, tokens or provider errors.
export type AuditAction='search.approved'|'search.submitted'|'search.completed'|'search.failed'|'search.uncertain'|'listing.analysis.started'|'listing.analysis.completed';
export type AuditOutcome='success'|'failure'|'unknown';
export async function audit(user:string, action:AuditAction, outcome:AuditOutcome, correlationId:string){
 if(!/^[A-Za-z0-9_-]{1,100}$/.test(correlationId))throw new Error('Invalid audit correlation identifier');
 await db().prepare('INSERT INTO audit_events(id,user_id,occurred_at,action,outcome,correlation_id,app_version) VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),user,new Date().toISOString(),action,outcome,correlationId,APP_VERSION).run();
}
