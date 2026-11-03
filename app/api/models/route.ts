import { compatibleModels,modelLabel } from '@/lib/models';
import { identity,getKey,json,failure,ApiError } from '@/lib/server';
export async function GET(req:Request){try{
 const user=identity(req);const key=await getKey(user);
 if(!key)throw new ApiError(409,'Hubungkan kunci Meta terlebih dahulu untuk membaca daftar model akunmu.');
 let response:Response;
 try{response=await fetch('https://api.meta.ai/v1/models',{headers:{Authorization:'Bearer '+key},signal:AbortSignal.timeout(12000)});}catch{throw new ApiError(504,'Daftar model belum bisa dimuat. Model pilihanmu tetap digunakan.');}
 if(!response.ok)throw new ApiError(response.status===429?429:502,response.status===401||response.status===403?'Kunci ditolak saat membaca daftar model. Periksa akses Meta.':'Daftar model belum tersedia. Coba lagi nanti.');
 let ids;try{ids=compatibleModels(await response.json());}catch{throw new ApiError(502,'Format daftar model belum dikenali. Model pilihanmu tidak diubah.');}
 return json({models:ids.map(id=>({id,label:modelLabel(id)})),scope:'compatible_standard_chat_models',checkedAt:new Date().toISOString()});
}catch(e){return failure(e);}}
