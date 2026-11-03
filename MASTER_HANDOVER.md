# SewaJelas — handover untuk agen pengembang

Pembaruan 3 November 2026. Versi aplikasi 0.4.9; periksa `main` dan riwayat terkini sebelum bekerja karena dokumen ini bisa tertinggal. Repositori privat: https://github.com/mrbarokah/sewajelas . Situs: https://sewajelas-ruang-latihan.tamecreek.chatgpt.site .

## Catatan 0.4.8

Pemulihan pencarian yang statusnya belum pasti memerlukan persetujuan baru dan tetap menyimpan status lama. Perubahan diambil secara selektif dari paket Gemini: hasil hanya dari sitasi, kegagalan 5xx tidak dianggap pasti gagal, dan tidak ada pengiriman ulang otomatis. Akar masalah pencarian Meta masih belum terkonfirmasi; uji langsung dengan izin dan kunci pemilik diperlukan. Tes memakai respons simulasi.

## Catatan 0.4.9

Log produksi menunjukkan permintaan pencarian diterima dan status berhasil dipantau; aplikasi sebelumnya menyamakan status gagal/tidak lengkap/dibatalkan. Recheck GET dapat memeriksa kegagalan lama tanpa memulai pencarian ulang. Pencarian menggunakan reasoning low dan 4096 output token, dapat meningkatkan biaya; penyebab spesifik dan keberhasilan live belum terverifikasi. Jangan log API key atau percakapan.\n
## Instruksi siap tempel untuk agen mana pun

> Kamu bertugas membantu mengembangkan SewaJelas. Baca README.md, HANDOVER.md, CHANGELOG.md, dokumen ini, dan kode terkait; jangan menganggap ringkasan ini selalu mutakhir. Periksa remote, branch, commit terbaru dan perubahan lokal sebelum mengedit. Jelaskan temuan dan buat perubahan terkecil yang menyelesaikan permintaan. Pertahankan data akun, kredensial terenkripsi, akses pengguna, riwayat, ekspor, perilaku pemulihan koneksi, serta tampilan mobile. Jangan baca atau tampilkan kunci API, transkrip pengguna atau data privat di log, prompt, commit atau laporan. Gunakan data sintetis untuk tes. Jangan force push, reset, hapus data, mengubah izin, memutar APP_VAULT_KEY, melakukan migrasi destruktif, atau deploy tanpa instruksi/otorisasi yang relevan. Bekerja pada branch baru untuk perubahan substansial, jalankan tes/typecheck/build, tinjau diff, kemudian buat commit/PR jika mempunyai akses dan diminta. Laporkan apa yang diuji, batasan, commit, dan apakah perubahan telah dipasang di situs; jangan mengklaim deploy hanya karena GitHub sudah di-update. Jika akses tidak cukup, jelaskan apa yang terhalang dan berikan patch yang dapat ditinjau.

## Tujuan dan fitur

Asisten hunian Indonesia yang membantu calon penyewa merumuskan kebutuhan dan menemukan sumber publik, tanpa meminta pemilik listing ulang. Chat Muse atau simulasi berpola; profil dan satu tujuan hunian lintas sesi, edit/kunci manual dan opt-out; sesi roleplay pemilik; pedoman gaya; riwayat dan ekspor JSON/Markdown; pilihan Muse Spark Standard yang tersedia pada katalog; pencarian web publik hanya setelah persetujuan. Tidak ada akses menyeluruh Marketplace/grup privat, negosiasi, kontak pemilik, pembayaran, foto listing otomatis, atau agen latar belakang otonom. Konten sumber tidak tepercaya dan hasil perlu diverifikasi.

## Perubahan utama

- 0.1: MVP latihan, penyimpanan akun, kunci terenkripsi, simulasi, chat Muse.
- 0.2: pemulihan mode dan konteks sesi, jawaban tersimpan sebelum dikirim, ekspor semua sesi, aksi pesan.
- 0.3: menu hamburger, nama dan pemilihan model, tekan lama/ellipsis.
- 0.4: profil lintas sesi, satu tujuan, pencarian web bersitasi dengan persetujuan dan log.
- 0.4.7: lokasi kerja di profil; kata kunci dibuat dari profil tanpa kalimat perintah umum. Jarak belum dihitung. Search masih bermasalah dan perlu diagnosis live.
- 0.4.6: pencarian background dengan pemulihan ID dan status; usage token lokal serta batas per menit jika header Meta tersedia. Saldo kredit belum tersedia.
- 0.4.5: pilihan Setuju, lanjutkan dan Batal pada pesan pencarian; keputusan tersimpan di chat dan tetap diperiksa server.
- 0.4.4: permintaan, persetujuan, dan hasil pencarian dalam satu kolom chat; model pencarian langsung tetap perlu diuji dengan API nyata.
- 0.4.3: penanganan format respons profil lebih tangguh dan status penyimpanan diperiksa dari perubahan nyata; uji langsung Muse masih diperlukan.
- 0.4.2: hapus batas 20 percobaan harian aplikasi sambil mempertahankan pencatatan penggunaan.
- 0.4.1: permintaan eksplisit menyimpan wawancara dapat menggunakan kutipan pesan pengguna sebelumnya dalam sesi, bukan hanya pesan terakhir. Pertahankan kunci manual dan pengecualian pesan roleplay/pesan asisten. Pengujian nyata dengan akun pengguna tetap diperlukan.

## Peta teknis dan batasan

React/Vinext dan Cloudflare Worker + D1. Identitas disediakan gateway Sites melalui `oai-authenticated-user-id`; jangan pasang worker pada host lain dengan header yang bisa dipalsukan. `app/page.tsx` dan `components/housing-profile.tsx` mengatur UI, `lib/profile.ts` validasi fakta/evidence, `app/api/chat/route.ts` chat dan profil, `app/api/search/route.ts` persetujuan dan pencarian, `lib/server.ts` autentikasi, kuota, penyimpanan CAS dan vault, `lib/studio.ts` state/ekspor. Data state scoped per akun. Jangan migrasikan akun atau rotasi vault sembarangan.

Sejak 0.4.2 aplikasi tidak membatasi panggilan harian. Jumlah percobaan per akun tetap dicatat harian WIB, termasuk koneksi, chat, pencarian, dan kegagalan setelah pencatatan. Saldo dan limit Meta terpisah dan dapat berubah. Kunci tidak disimpan di Git. Pencarian mengirim kata kunci yang disetujui, dan provider bisa menjalankan beberapa pencarian internal. Perubahan kuota perlu keputusan pemilik mengenai biaya/abuse.

## Uji dan rilis

Gunakan Node 24 dan package manager yang dipin. Jalankan `npm test`, `npm run typecheck`, dan build sesuai README. Tests menggunakan database uji SQLite dan provider mock, bukan bukti integrasi live. Validasi praktik simpan profil: buka sesi wawancara lama, minta simpan ke profil, cek kutipan dan nilai di menu, reload, cek lagi; jangan timpa nilai yang dikunci. Pastikan mode pemilik tidak memutakhirkan profil nyata. Periksa penghitung penggunaan dan kegagalan jaringan. Uji layar Android/iOS sebenarnya bila tersedia.

GitHub dan hosting Sites merupakan dua alur berbeda: commit GitHub tidak otomatis deploy ke situs. Situs saat ini memakai akses terbatas; jangan mengubah audience. Hosting memiliki konfigurasi dan identitas proyek tersendiri; manifest distribusi GitHub sengaja tidak berisi ID proyek pemilik. Gunakan mekanisme deploy hosting yang sah dan cocok; jika tidak punya akses, berikan commit/PR tanpa mengklaim situs diperbarui. Jangan memasukkan konfigurasi hosting rahasia, API key, ekspor chat, atau data akun ke repository.

## Prioritas: search belum berhasil (laporan pengguna 3 November 2026)

User melaporkan status pengiriman belum pasti setelah menyetujui pencarian, bahkan setelah 0.4.6. Log route /api/search/status menunjukkan HTTP 409 pada 22:55 WIB; status endpoint mengembalikan 409 saat job running tidak memiliki providerResponseId. Belum terbukti penyebab awal tidak tersimpannya ID. Jangan otomatis mengulang POST berbayar. Baca riwayat, /api/search/route.ts, /api/search/status/route.ts, lib/search-server.ts dan pengujian; diagnosis dengan data sintetis dan log metadata teredaksi, lanjut uji live dengan izin pengguna. Jangan mempercayai test mock sebagai bukti live.
