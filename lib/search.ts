import { rankSocialCandidates,type SocialCandidate } from '@/lib/social-sources';
import { z } from 'zod';
export function metaUrl(value:string){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&['facebook.com','instagram.com','threads.net','threads.com'].some(h=>u.hostname===h||u.hostname.endsWith('.'+h));}catch{return false;}}
export const sourceSchema=z.object({url:z.string().max(2000).refine(metaUrl),title:z.string().max(300),kind:z.enum(['retrieved']).optional()});
export const searchJobSchema=z.object({id:z.string().min(1).max(100),sessionId:z.string().max(100),query:z.string().min(3).max(600),approvedAt:z.string().max(40),status:z.enum(['running','completed','failed']),providerResponseId:z.string().regex(/^resp_[A-Za-z0-9_-]+$/).max(150).optional(),approvalMessageId:z.string().max(100).optional(),error:z.string().max(600).optional(),finishedAt:z.string().max(40).optional()});
// Provider hits are untrusted; relevance is based only on the approved plan and available title/snippet evidence.
export function parseSearch(raw:unknown,plan=''){
 const response=z.object({status:z.string(),output:z.array(z.object({type:z.string(),status:z.string().nullish(),results:z.array(z.object({type:z.string().nullish(),url:z.string().nullish(),title:z.string().nullish(),snippet:z.string().nullish()}).passthrough()).nullish(),content:z.array(z.object({type:z.string(),annotations:z.array(z.object({type:z.string(),url:z.string().nullish(),title:z.string().nullish()}).passthrough()).nullish()}).passthrough()).nullish()}).passthrough()),usage:z.object({input_tokens:z.number().nullish(),output_tokens:z.number().nullish()}).nullish()}).parse(raw);
 if(response.status!=='completed'||!response.output.some(i=>i.type==='web_search_call'&&i.status==='completed'))throw new Error('Layanan belum mengonfirmasi pencarian selesai. Tidak ada hasil yang dianggap terverifikasi.');
 const hits:SocialCandidate[]=[];
 for(const item of response.output.filter(i=>i.type==='web_search_call'&&i.status==='completed'))for(const hit of item.results??[])if(hit.type==='text_result'&&hit.url&&metaUrl(hit.url)&&hit.url.length<=2000)hits.push({url:hit.url,title:(hit.title||new URL(hit.url).hostname).slice(0,300),snippet:(hit.snippet||'').slice(0,2000),kind:'retrieved'});
 for(const item of response.output.filter(i=>i.type==='message'))for(const block of item.content??[])for(const citation of block.annotations??[])if(citation.type==='url_citation'&&citation.url&&metaUrl(citation.url)&&citation.url.length<=2000)hits.push({url:citation.url,title:(citation.title||new URL(citation.url).hostname).slice(0,300)});
 const sources=rankSocialCandidates(hits,plan).map(({url,title,kind})=>({url,title,...(kind?{kind}: {})}));
 const usage=response.usage?{input_tokens:response.usage.input_tokens??undefined,output_tokens:response.usage.output_tokens??undefined}:undefined;
 if(!sources.length)return {content:'Pencarian selesai, tetapi belum ada postingan yang cukup jelas cocok dengan jenis hunian dan lokasi yang diminta. Coba kata kunci atau area lain; ini bukan bukti bahwa listing tidak ada.',sources,usage};
 return {content:'Berikut maksimal lima postingan yang terlihat relevan berdasarkan judul atau cuplikan. Harga, ketersediaan, kondisi, dan kecocokannya belum diverifikasi; periksa sumber sebelum mengambil keputusan.',sources,usage};
}

// Deliberately conservative: asking to search is distinct from merely describing needs.
export function wantsSearch(text:string){const t=text.toLowerCase();if(/\b(jangan|tidak usah|gak usah|nggak usah|belum|batal)\b.{0,30}\b(cari|carikan|pencarian)/i.test(t))return false;return (/\b(kata kunci|keyword)\b/i.test(t)&&/\b(coba|pakai|gunakan|ubah|ganti|dengan)\b/i.test(t))||/\b(carikan|cariin|cari|search|telusuri|temukan)\b/i.test(t)&&(/\b(kos|kost|kontrakan|rumah|hunian|listing|properti|sewa|opsi|pilihan|unit|tempat tinggal|listingnya|kontrakannya|kosannya|rumahnya)\b/i.test(t)||/\b(lanjut|sekarang|tolong|dong|ya|nya)\b/i.test(t));}
export function approvesSearch(text:string){return /^(?:ya|iya|iyah|yes|oke|ok|boleh|setuju|silakan|silahkan|lanjut|lanjutkan|cari sekarang|ya cari|ya carikan|boleh cari|setuju cari|oke cari|iya cari|ya lanjut|setuju, lanjutkan)(?:[.!\s]*)$/i.test(text.trim());}
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
 const explicit=(request.match(/(?:misal(?:nya)?|contoh)\s*[:：]?\s*([^\n.?]{3,100})/i)||request.match(/(?:kata kunci(?:nya)?(?: adalah)?|keyword(?:nya)?(?: adalah)?)\s*[:：]?\s*((?:kontrakan|kos|kost|rumah|sewa rumah)\b[^\n.?]{0,75})/i))?.[1]?.trim();
 const direct=request.match(/\b(?:cari(?:kan|in)?|search|telusuri)\s+(?:ulang\s+)?((?:kontrakan|kos|kost|rumah|sewa rumah)\s+[^\n.?]{2,75})/i)?.[1]?.replace(/\s+(?:sesuai|berdasarkan|dari)\s+(?:profil|kebutuhan|tujuan).*$/i,'').trim();
 const selected=(explicit||direct||'').replace(/\b(?:ya|dong|tolong)\b/gi,' ').replace(/\s+/g,' ').trim();
 const kind=/\b(kos|kost)\b/i.test(housing||selected)?'kos':/rumah|kontrakan/i.test(housing||selected)?'kontrakan':'';
 const loc=(f.location?.value||'').split(/\s+(?:sampai(?:\s+maksimal)?|hingga|s\/d|atau)\s+|[,;]/i).map(x=>x.trim()).filter(Boolean).slice(0,3);
 const chosen=/^(?:kontrakan|kos|kost|rumah|sewa rumah)$/i.test(selected)?'':selected;
 const candidates=[chosen,...(kind?loc.map(x=>`${kind} ${x}`):[])].filter((v,i,a)=>!!v&&a.findIndex(x=>x.toLowerCase()===v.toLowerCase())===i).slice(0,3);
 if(!candidates.length&&kind)candidates.push(kind);
 if(!candidates.length)return '';
 const context=[housing,f.location?.value,f.budget?.value,f.costScope?.value,f.workLocation?.value?'lokasi kerja '+f.workLocation.value:undefined].filter(Boolean).join(' · ');
 return `Contoh kata kunci: ${candidates.join(' | ')}${context?`\nKriteria pembanding: ${context}`:''}`.slice(0,600);
}
