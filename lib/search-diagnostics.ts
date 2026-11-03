// Provider output is untrusted. Return fixed messages only, never raw text or secrets.
export function searchFailure(raw:{status?:unknown;incomplete_details?:unknown;error?:unknown}):string {
 const detail=raw.incomplete_details && typeof raw.incomplete_details==='object' ? raw.incomplete_details as {reason?:unknown} : undefined;
 const error=raw.error && typeof raw.error==='object' ? raw.error as {code?:unknown} : undefined;
 if(raw.status==='incomplete'&&detail?.reason==='max_output_tokens')return 'Pencarian berhenti karena batas token keluaran Meta habis, termasuk token berpikir. Ajukan pencarian baru untuk mencoba dengan batas yang diperbarui.';
 if(raw.status==='incomplete'&&detail?.reason==='content_filter')return 'Meta menghentikan hasil karena filter konten. Coba ubah kata kunci.';
 if(raw.status==='incomplete')return 'Meta mengembalikan pencarian yang belum lengkap; alasan lebih rinci tidak tersedia.';
 if(raw.status==='cancelled')return 'Pencarian dibatalkan di Meta.';
 if(raw.status==='failed'&&error?.code==='rate_limit_exceeded')return 'Meta menolak pencarian karena batas laju. Coba lagi nanti setelah meninjau penggunaan.';
 if(raw.status==='failed'&&error?.code==='server_error')return 'Meta melaporkan kesalahan server saat memproses pencarian.';
 return 'Meta melaporkan pencarian gagal, tetapi tidak memberikan alasan yang dapat dikenali.';
}
