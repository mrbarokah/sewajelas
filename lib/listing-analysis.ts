import { z } from 'zod';
export const listingResultSchema=z.object({summary:z.string().max(700),facts:z.array(z.object({criterion:z.string().max(90),observation:z.string().max(400),evidence:z.string().max(300),source:z.enum(['teks','gambar','tidak_diketahui']),assessment:z.enum(['sesuai','tidak_sesuai','belum_pasti'])})).max(12),questions:z.array(z.string().max(300)).max(8)});
export const listingFormat={type:'json_schema',json_schema:{name:'RentalListingAnalysis',schema:{type:'object',additionalProperties:false,properties:{summary:{type:'string'},facts:{type:'array',items:{type:'object',additionalProperties:false,properties:{criterion:{type:'string'},observation:{type:'string'},evidence:{type:'string'},source:{type:'string',enum:['teks','gambar','tidak_diketahui']},assessment:{type:'string',enum:['sesuai','tidak_sesuai','belum_pasti']}},required:['criterion','observation','evidence','source','assessment']}},questions:{type:'array',items:{type:'string'}}},required:['summary','facts','questions']}}};
export function validImageData(value:string){
 const match=/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);if(!match||value.length>1400000)return false;
 try{const decoded=atob(match[2]);if(decoded.length<16||decoded.length>1000000)return false;
 const bytes=Array.from(decoded.slice(0,12),c=>c.charCodeAt(0));
 return match[1]==='jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:match[1]==='png'?[137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n):String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';}catch{return false;}
}
export function formatAnalysis(raw:string,text:string,hasImage:boolean){
 let payload:unknown;try{payload=JSON.parse(raw.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,''));}catch{return null;}
 const parsed=listingResultSchema.safeParse(payload);if(!parsed.success)return null;
 const clean=(s:string)=>s.replace(/\s+/g,' ').trim();const provided=clean(text).toLowerCase();
 const rows=parsed.data.facts.map(f=>{
  const evidence=clean(f.evidence);const verifiedText=f.source==='teks'&&evidence.length>0&&provided.includes(evidence.toLowerCase());
  if(verifiedText)return `• ${clean(f.criterion)} [indikasi ${f.assessment.replace('_',' ')}]: ${clean(f.observation)} (tertulis: “${evidence}”)`;
  if(f.source==='gambar'&&hasImage&&evidence)return `• ${clean(f.criterion)} [indikasi ${f.assessment.replace('_',' ')}]: ${clean(f.observation)} (pengamatan AI dari gambar: ${evidence}; perlu dicek)`;
  return `• ${clean(f.criterion)}: Belum diketahui dari bukti yang dapat diperiksa.`;
 });
 const questions=parsed.data.questions.map(q=>`• ${clean(q)}`).join('\n');
 return `Analisis awal listing · perkiraan AI, belum diverifikasi\n\n${rows.join('\n')||'Informasi listing belum cukup jelas untuk diperiksa.'}\n\nPertanyaan untuk pemilik:\n${questions||'• Apakah unit masih tersedia dan apakah rincian biaya dapat dikonfirmasi?'}\n\nHarga, kondisi, fasilitas dan identitas penawar perlu dicek langsung. Gambar tidak membuktikan bebas banjir, air lancar, atau kejujuran pemilik.`.slice(0,4000);
}
