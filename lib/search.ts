import { rankSocialCandidates,type SocialCandidate } from '@/lib/social-sources';
import { z } from 'zod';
export function metaUrl(value:string){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&['facebook.com','instagram.com','threads.net','threads.com'].some(h=>u.hostname===h||u.hostname.endsWith('.'+h));}catch{return false;}}
export const sourceSchema=z.object({url:z.string().max(2000).refine(metaUrl),title:z.string().max(300),excerpt:z.string().max(1000).optional(),kind:z.enum(['retrieved']).optional()});
export const searchTraceSchema=z.object({queries:z.array(z.string().max(250)).max(10),toolCalls:z.number().int().min(0),rawCount:z.number().int().min(0).nullable(),socialCandidates:z.number().int().min(0),shown:z.number().int().min(0),domains:z.object({facebook:z.number().int().min(0),marketplace:z.number().int().min(0),instagram:z.number().int().min(0),threads:z.number().int().min(0)})});
export const searchJobSchema=z.object({id:z.string().min(1).max(100),sessionId:z.string().max(100),query:z.string().min(3).max(600),approvedAt:z.string().max(40),status:z.enum(['running','completed','failed']),providerResponseId:z.string().regex(/^resp_[A-Za-z0-9_-]+$/).max(150).optional(),approvalMessageId:z.string().max(100).optional(),error:z.string().max(600).optional(),finishedAt:z.string().max(40).optional()});
// Provider hits are untrusted; relevance is based only on the approved plan and available title/snippet evidence.
export function parseSearch(raw:unknown,plan=''){
 const response=z.object({status:z.string(),output:z.array(z.object({type:z.string(),status:z.string().nullish(),action:z.unknown().optional(),results:z.array(z.object({type:z.string().nullish(),url:z.string().nullish(),title:z.string().nullish(),snippet:z.string().nullish()}).passthrough()).nullish(),content:z.array(z.object({type:z.string(),annotations:z.array(z.object({type:z.string(),url:z.string().nullish(),title:z.string().nullish()}).passthrough()).nullish()}).passthrough()).nullish()}).passthrough()),usage:z.object({input_tokens:z.number().nullish(),output_tokens:z.number().nullish()}).nullish()}).parse(raw);
 if(response.status!=='completed'||!response.output.some(i=>i.type==='web_search_call'&&i.status==='completed'))throw new Error('Layanan belum mengonfirmasi pencarian selesai. Tidak ada hasil yang dianggap terverifikasi.');
 const hits:SocialCandidate[]=[];
 for(const item of response.output.filter(i=>i.type==='web_search_call'&&i.status==='completed'))for(const hit of item.results??[])if(hit.type==='text_result'&&hit.url&&metaUrl(hit.url)&&hit.url.length<=2000)hits.push({url:hit.url,title:(hit.title||new URL(hit.url).hostname).slice(0,300),snippet:(hit.snippet||'').slice(0,2000),kind:'retrieved'});
 for(const item of response.output.filter(i=>i.type==='message'))for(const block of item.content??[])for(const citation of block.annotations??[])if(citation.type==='url_citation'&&citation.url&&metaUrl(citation.url)&&citation.url.length<=2000)hits.push({url:citation.url,title:(citation.title||new URL(citation.url).hostname).slice(0,300)});
 const sources=rankSocialCandidates(hits,plan).map(({url,title,kind,snippet})=>({url,title,...(snippet?.trim()?{excerpt:snippet.trim().slice(0,1000)}:{}),...(kind?{kind}: {})}));
 const calls=response.output.filter(i=>i.type==='web_search_call'&&i.status==='completed');
 const actions=calls.map(i=>z.object({type:z.literal('search'),query:z.string().nullish(),queries:z.array(z.string()).nullish()}).passthrough().safeParse(i.action)).filter(x=>x.success).map(x=>x.data);
 const queries=[...new Set(actions.flatMap(a=>a.queries?.length?a.queries:a.query?[a.query]:[]).map(q=>q.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,250)).filter(Boolean))].slice(0,10);
 const domains={facebook:0,marketplace:0,instagram:0,threads:0};
 for(const hit of hits){const u=new URL(hit.url);const h=u.hostname.toLowerCase();if(h==='facebook.com'||h.endsWith('.facebook.com')){if(/^\/marketplace\/item\//i.test(u.pathname))domains.marketplace++;else domains.facebook++;}else if(h==='instagram.com'||h.endsWith('.instagram.com'))domains.instagram++;else if(h==='threads.net'||h.endsWith('.threads.net')||h==='threads.com'||h.endsWith('.threads.com'))domains.threads++;}
 const hasResults=calls.some(c=>Array.isArray(c.results));
 const trace={queries,toolCalls:calls.length,rawCount:hasResults?calls.reduce((sum,c)=>sum+(c.results?.length??0),0):null,socialCandidates:hits.length,shown:sources.length,domains};
 const usage=response.usage?{input_tokens:response.usage.input_tokens??undefined,output_tokens:response.usage.output_tokens??undefined}:undefined;
 if(!sources.length)return {content:'Pencarian selesai, tetapi belum ada postingan yang cukup jelas cocok dengan jenis hunian dan lokasi yang diminta. Coba kata kunci atau area lain; ini bukan bukti bahwa listing tidak ada.',sources,usage,trace};
 return {content:'Berikut maksimal lima postingan yang terlihat relevan berdasarkan judul atau cuplikan. Harga, ketersediaan, kondisi, dan kecocokannya belum diverifikasi; periksa sumber sebelum mengambil keputusan.',sources,usage,trace};
}

// Deliberately conservative: asking to search is distinct from merely describing needs.
export function wantsSearch(text:string){const t=text.toLowerCase();if(/\b(jangan|tidak usah|gak usah|nggak usah|belum|batal)\b.{0,30}\b(cari|carikan|pencarian)/i.test(t))return false;return /^(?:(?:oke|ok|ya|tolong|coba)\s+)?(?:carikan|cariin)(?:\s+(?:ya|dong|sekarang|dulu))?[.!\s]*$/i.test(t)||(/\b(kata kunci|keywords?)\b/i.test(t)&&/\b(coba|pakai|gunakan|ubah|ganti|dengan)\b/i.test(t))||/\b(carikan|cariin|cari|search|telusuri|temukan)\b/i.test(t)&&(/\b(kos|kost|kontrakan|rumah|hunian|listing|properti|sewa|opsi|pilihan|unit|tempat tinggal|listingnya|kontrakannya|kosannya|rumahnya)\b/i.test(t)||/\b(lanjut|sekarang|tolong|dong|ya|nya)\b/i.test(t));}
export function approvesSearch(text:string){return /^(?:ya|iya|iyah|yes|oke|ok|boleh|setuju|silakan|silahkan|lanjut|lanjutkan|cari sekarang|ya cari|ya carikan|boleh cari|setuju cari|oke cari|iya cari|ya lanjut|setuju, lanjutkan|lanjutkan cari dulu|lanjut cari dulu|lanjutkan pencarian|lanjut cari|lanjutkan cari)(?:[.!\s]*)$/i.test(text.trim());}
export function declinesSearch(text:string){return /^(?:tidak|tidak dulu|nggak|gak|jangan|batal|cancel|nanti saja|belum)(?:[.!\s]*)$/i.test(text.trim());}

// Build a reviewable, minimal query from saved fields; the instruction itself is not a search keyword.
export function buildProfileQuery(profile:{facts:Record<string,{value:string}|undefined>},instruction:string){
 const f=profile.facts;
 const words=instruction.trim()
  .replace(/\b(?:tolong|mohon|please|dong|sekarang|lanjut|lanjutkan|ya|iya|oke|ok|udah|sudah|bisa|coba|bantu|mau|ingin)\b/gi,' ')
  .replace(/\b(?:carikan|cariin|cari|search|telusuri|temukan)\b/gi,' ')
  .replace(/\b(?:sesuai|berdasarkan|dari|menurut|pakai|menggunakan|mengikuti)\s+(?:dengan\s+)?(?:catatan\s+)?(?:profil|profile|kebutuhan|tujuan|kriteria|data)(?:\s+(?:dan|&|serta)\s+(?:profil|profile|kebutuhan|tujuan|kriteria|data))?(?:\s+(?:saya|aku|ku|kami|kita|di\s+atas|tersebut|tadi))?\b/gi,' ')
  .replace(/\b(?:yang\s+(?:cocok|pas|sesuai)\s+)?(?:untuk|buat)\s+(?:saya|aku|kami|kita)\b/gi,' ')
  .replace(/\b(?:kontrakannya|kosannya|kosnya|rumahnya|huniannya|listingnya|pilihannya|opsinya)\b/gi,' ')
  .replace(/\s+/g,' ')
  .replace(/^[\s,.?!:;·-]+|[\s,.?!:;·-]+$/g,'')
  .trim();
 const pieces=[f.housing?.value,f.location?.value,f.budget?.value,f.costScope?.value,f.workLocation?.value?'lokasi kerja '+f.workLocation.value:undefined];
 const base=pieces.filter((v):v is string=>!!v?.trim()).map(v=>v.trim());
 const genericHousingOnly=/^(?:kontrakan|kos|kost|rumah|hunian|tempat\s+tinggal|properti|listing|sewa)$/i.test(words);
 if(words&&!(genericHousingOnly&&f.housing?.value?.trim())&&!base.some(v=>v.toLowerCase().includes(words.toLowerCase())))base.push(words);
 return base.join(' · ').slice(0,600);
}

// Examples are a plan submitted for approval, not claims about provider queries.
export function buildSearchPlan(profile:{facts:Record<string,{value:string}|undefined>},instruction:string){
 const f=profile.facts; const housing=f.housing?.value?.trim()||'';
 const request=instruction.trim();
 const explicit=(request.match(/(?:misal(?:nya)?|contoh)\s*[:：]?\s*([^\n.?]{3,100})/i)||request.match(/(?:kata kunci(?:nya)?(?: adalah)?|keywords?(?:nya)?(?: adalah)?)\s*[:：]?\s*((?:kontrakan|kos|kost|rumah|sewa rumah)\b[^\n.?]{0,75})/i))?.[1]?.trim();
 const direct=request.match(/\b(?:cari(?:kan|in)?|search|telusuri)\s+(?:ulang\s+)?((?:kontrakan|kos|kost|rumah|sewa rumah)\s+[^\n.?]{2,75})/i)?.[1]?.replace(/\s+(?:sesuai|berdasarkan|dari)\s+(?:profil|kebutuhan|tujuan).*$/i,'').trim();
 const selected=(explicit||direct||'').replace(/^(?:kata kunci|keywords?)\s*[:：]?\s*/i,'').replace(/\b(?:ya|dong|tolong)\b/gi,' ').replace(/\s+/g,' ').trim();
 const kind=/\b(kos|kost)\b/i.test(housing||selected)?'kos':/rumah|kontrakan/i.test(housing||selected)?'kontrakan':'';
 const loc=(f.location?.value||'').split(/\s+(?:sampai(?:\s+maksimal)?|hingga|s\/d|atau)\s+|[,;]/i).map(x=>x.trim()).filter(Boolean).slice(0,3);
 const chosen=/^(?:kontrakan|kos|kost|rumah|sewa rumah)$/i.test(selected)?'':selected;
 const candidates=[chosen,...(kind?loc.map(x=>`${kind} ${x}`):[])].filter((v,i,a)=>!!v&&a.findIndex(x=>x.toLowerCase()===v.toLowerCase())===i).slice(0,3);
 if(!candidates.length&&kind)candidates.push(kind);
 if(!candidates.length)return '';
 const context=[housing,f.location?.value,f.budget?.value,f.costScope?.value,f.workLocation?.value?'lokasi kerja '+f.workLocation.value:undefined].filter(Boolean).join(' · ');
 return `Contoh kata kunci: ${candidates.join(' | ')}${context?`\nKriteria pembanding: ${context}`:''}`.slice(0,600);
}
