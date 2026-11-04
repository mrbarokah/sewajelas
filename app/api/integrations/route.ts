import { failure,identity,json } from '@/lib/server';
import { socialCapabilities } from '@/lib/social-sources';
// Exposes capabilities, never credentials. No OAuth or direct provider is enabled.
export async function GET(req:Request){try{identity(req);return json({providers:socialCapabilities});}catch(e){return failure(e);}}
