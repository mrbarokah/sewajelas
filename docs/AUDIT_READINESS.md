# Catatan kesiapan audit — SewaJelas 0.6.2

## Cakupan aktual
Jurnal aplikasi server terpisah di D1 menyimpan id acak, identitas akun, waktu UTC ISO-8601, nama aksi, hasil, ID korelasi dan versi aplikasi. Data isi chat, kueri, profil, URL, token dan kesalahan mentah tidak dicatat. Peristiwa yang dicatat: persetujuan pencarian, penerimaan tugas pencarian latar belakang, hasil sukses/gagal/status tidak pasti, serta awal dan sukses analisis listing. Peristiwa lama tidak direkonstruksi. Analisis yang gagal belum memiliki peristiwa hasil tersendiri. Persetujuan dan perubahan state tidak ditulis dalam transaksi atomik bersama jurnal, sehingga proses gagal di antara keduanya dapat menyebabkan celah catatan. Jurnal ini tidak boleh dianggap lengkap atau sebagai bukti non-repudiation.

GET `/api/audit` mensyaratkan identitas dan mengembalikan maksimal 200 peristiwa terbaru untuk akun tersebut. Ekspor tersedia dari Riwayat. Penghapusan seluruh data akun menghapus jurnal akun tersebut; ekspor bukan backup audit yang terkelola. Tidak ada kebijakan retensi otomatis dan tidak ada jaminan pengambilan seluruh jurnal melalui endpoint tersebut.

## Kesenjangan sebelum audit readiness atau sertifikasi
- Catat perubahan profil, identitas/autentikasi dari penyedia hosting, izin, kredensial, semua kegagalan analisis, akses dan ekspor audit, perubahan konfigurasi, penghapusan dan operasi administrator yang relevan.
- Gunakan transaksi/transactional outbox, alat pemantauan kegagalan dan rekonsiliasi, serta uji gangguan database dan konkurensi.
- Terapkan kontrol akses auditor independen, pemisahan tugas, kebijakan retensi dan legal hold yang diputuskan pemilik data, ekspor terpusat/arsip immutable atau WORM, alerting, dan sinkronisasi waktu. Database aplikasi saat ini bukan penyimpanan tamper-proof: administrator infrastruktur dapat mengubahnya.
- Tetapkan standar dan ruang lingkup organisasi, klasifikasi informasi, dasar hukum dan kebijakan privasi/retensi; lakukan penilaian eksternal sesuai standar yang dipilih. Tidak ada klaim sertifikasi atau kepatuhan.

Referensi desain: OWASP Logging Cheat Sheet https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html dan NIST SP 800-92 https://csrc.nist.gov/pubs/sp/800/92/final.
