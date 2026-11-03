import { z } from 'zod';
export function metaUrl(value:string){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&['facebook.com','instagram.com','threads.net','threads.com'].some(h=>u.hostname===h||u.hostname.endsWith('.'+h));}catch{return false;}}
export const sourceSchema=z.object({url:z.string().max(2000).refine(metaUrl),title:z.string().max(300)});
export const searchJobSchema=z.object({id:z.string().min(1).max(100),sessionId:z.string().max(100),query:z.string().min(3).max(600),approvedAt:z.string().max(40),status:z.enum(['running','completed','failed']),error:z.string().max(600).optional(),finishedAt:z.string().max(40).optional()});
// Only provider citation annotations, never model-written URLs, become source cards.
export function parseSearch(raw:unknown){
 const response=z.object({status:z.string(),output:z.array(z.object({type:z.string(),status:z.string().optional(),content:z.array(z.object({type:z.string(),text:z.string().optional(),annotations:z.array(z.object({type:z.string(),url:z.string().optional(),title:z.string().optional()}).passthrough()).optional()}).passthrough()).optional()}).passthrough()),usage:z.object({input_tokens:z.number().optional(),output_tokens:z.number().optional()}).optional()}).parse(raw);
 if(response.status!=='completed'||!response.output.some(i=>i.type==='web_search_call'&&i.status==='completed'))throw new Error('Layanan belum mengonfirmasi pencarian selesai. Tidak ada hasil yang dianggap terverifikasi.');
 const blocks=response.output.filter(i=>i.type==='message').flatMap(i=>i.content??[]).filter(b=>b.type==='output_text');
 const sources: z.infer<typeof sourceSchema>[]=[];
 for(const b of blocks)for(const a of b.annotations??[]){if(a.type==='url_citation'&&a.url&&metaUrl(a.url)&&a.url.length<=2000&&!sources.some(s=>s.url===a.url))sources.push({url:a.url,title:(a.title||new URL(a.url).hostname).slice(0,300)});}
 if(!sources.length)return {content:'Pencarian selesai, tetapi belum ada sumber Facebook, Threads, atau Instagram publik yang dapat ditampilkan dengan sitasi. Ini bukan bukti bahwa tidak ada listing. Coba ubah lokasi atau kata kunci.',sources:[],usage:response.usage};
 const content=blocks.map(b=>b.text??'').join('\n');
 if(!content||content.length>3700)throw new Error('Ringkasan pencarian belum lengkap. Ulangi dengan kata kunci lebih spesifik.');
 return {content:'Hasil web publik · ketersediaan dan klaim listing belum diverifikasi.\n\n'+content,sources:sources.slice(0,20),usage:response.usage};
}

// Deliberately conservative: asking to search is distinct from merely describing needs.
export function wantsSearch(text:string){const t=text.toLowerCase();if(/\b(jangan|tidak usah|gak usah|nggak usah|belum|batal)\b.{0,30}\b(cari|carikan|pencarian)/i.test(t))return false;return /\b(carikan|cariin|cari|search|telusuri|temukan)\b/i.test(t)&&(/\b(kos|kost|kontrakan|rumah|hunian|listing|properti|sewa|opsi|pilihan|unit|tempat tinggal|listingnya|kontrakannya|kosannya|rumahnya)\b/i.test(t)||/\b(lanjut|sekarang|tolong|dong|ya|nya)\b/i.test(t));}
export function approvesSearch(text:string){return /^(?:ya|iya|iyah|yes|oke|ok|boleh|setuju|silakan|silahkan|lanjut|lanjutkan|cari sekarang|ya cari|ya carikan|boleh cari|setuju cari|oke cari|iya cari|ya lanjut|setuju, lanjutkan)(?:[.!\s]*)$/i.test(text.trim());}
export function declinesSearch(text:string){return /^(?:tidak|tidak dulu|nggak|gak|jangan|batal|cancel|nanti saja|belum)(?:[.!\s]*)$/i.test(text.trim());}
