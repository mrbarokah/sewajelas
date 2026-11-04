// Integration capability registry. No platform login or direct API access is enabled.
export type SocialPlatform='facebook'|'marketplace'|'instagram'|'threads';
export type SocialCandidate={url:string;title:string;snippet?:string;kind?:'retrieved'};
export const socialCapabilities:Record<SocialPlatform,{directSearch:'not_configured'|'unavailable';description:string}>={
 facebook:{directSearch:'unavailable',description:'Discovery through public web only.'},
 marketplace:{directSearch:'unavailable',description:'No authorized Marketplace search connector configured.'},
 instagram:{directSearch:'not_configured',description:'Professional APIs require eligible account and permissions.'},
 threads:{directSearch:'not_configured',description:'Keyword API requires separate authorization and access approval.'},
};
export function individualPostUrl(value:string):boolean{
 try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password)return false;const h=u.hostname.toLowerCase(),p=u.pathname;
 if(['facebook.com','www.facebook.com','m.facebook.com','web.facebook.com'].includes(h))return /\/(?:marketplace\/item\/[^/]+|posts\/[^/]+|permalink\.php|story\.php|photo(?:\.php|\/)|reel\/[^/]+|share\/p\/[^/]+)/i.test(p);
 if(['instagram.com','www.instagram.com'].includes(h))return /^\/(?:p|reel|reels)\/[^/]+/i.test(p);
 if(['threads.net','www.threads.net','threads.com','www.threads.com'].includes(h))return /^\/@[^/]+\/post\/[^/]+/i.test(p);
 return false;}catch{return false;}
}
function norm(s:string){return s.toLocaleLowerCase('id-ID').normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');}
function locations(plan:string){
 const line=plan.split(/\n/)[0].replace(/^contoh kata kunci:\s*/i,'');
 return line.split('|').map(part=>norm(part.replace(/\b(?:kontrakan|kos|kost|rumah|sewa|hunian|dekat|di|daerah)\b/gi,' '))).filter(x=>x.length>=3||x==='ui').slice(0,4);
}
function locationScore(text:string,loc:string){const terms=loc.split(' ').filter(x=>x.length>=4&&!['jakarta','selatan','utara','timur','barat','pusat'].includes(x));
 if(loc==='ui')return /(?:^| )ui(?: |$)|universitas indonesia/.test(text)?3:0;
 if(text.includes(loc))return 3;if(loc==='jakarta selatan'&&/\bjaksel\b/.test(text))return 3;
 return terms.some(x=>new RegExp('(?:^| )'+x+'(?: |$)').test(text))?2:0;}
export function rankSocialCandidates(candidates:SocialCandidate[],plan:string):SocialCandidate[]{
 const areas=locations(plan);const requested=norm(plan.split('\n')[0]);const wantsKos=/\b(?:kos|kost)\b/.test(requested)&&!/\b(?:kontrakan|rumah)\b/.test(requested);const wantsHouse=/\b(?:kontrakan|rumah)\b/.test(requested)&&!(/\b(?:kos|kost)\b/.test(requested));
 const seen=new Set<string>();const ranked:{candidate:SocialCandidate;score:number}[]=[];
 for(const candidate of candidates){if(!individualPostUrl(candidate.url))continue;const text=norm((candidate.title||'')+' '+(candidate.snippet||''));
 if(!/\b(?:sewa|disewa|disewakan|kontrakan|kontrak|kos|kost|rumah|hunian)\b/.test(text))continue;
 if(wantsKos&&!/\b(?:kos|kost)\b/.test(text))continue;
 if(wantsHouse&&!/\b(?:kontrakan|kontrak|rumah)\b/.test(text))continue;
 if(/\b(?:cari|mencari|butuh) (?:kos|kost|kontrakan|rumah)\b/.test(text)&&!/\b(?:disewakan|tersedia|sewakan)\b/.test(text))continue;
 const loc=areas.length?Math.max(...areas.map(a=>locationScore(text,a))):0;if(areas.length&&!loc)continue;
 const u=new URL(candidate.url);const identity=(u.hostname.replace(/^www\.|^m\.|^web\./,'')+u.pathname).toLowerCase();if(seen.has(identity))continue;seen.add(identity);
 ranked.push({candidate,score:loc+(/\b(?:disewakan|kontrakan|kos|kost)\b/.test(text)?2:1)});
 }
 return ranked.sort((a,b)=>b.score-a.score).slice(0,5).map(x=>x.candidate);
}
