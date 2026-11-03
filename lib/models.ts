// Only standard text-chat models supported by this adapter. Never opt into Contributor implicitly.
export const CHAT_MODELS=['muse-spark-1.3','muse-spark-1.2','muse-spark-1.1'] as const;
export type ChatModel=typeof CHAT_MODELS[number];
export const DEFAULT_MODEL:ChatModel='muse-spark-1.3';
export const modelLabel=(id:string)=>CHAT_MODELS.includes(id as ChatModel)?'Muse Spark '+id.replace('muse-spark-',''):id;
export function compatibleModels(payload:unknown):ChatModel[]{
 if(!payload||typeof payload!=='object'||!Array.isArray((payload as {data?:unknown}).data))throw new Error('invalid model catalog');
 const ids=new Set((payload as {data:{id?:unknown}[]}).data.map(m=>m&&typeof m==='object'?m.id:undefined));
 return CHAT_MODELS.filter(id=>ids.has(id));
}
