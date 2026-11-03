# SewaJelas — Ruang Latihan

MVP privat untuk melatih percakapan asisten hunian Indonesia. Pengguna menjadi calon penyewa, lalu dapat memerankan pemilik. Tidak ada katalog properti, pencarian, pesan eksternal, negosiasi nyata, atau pembayaran.

## Mencoba

1. Buka Site dengan akun pemiliknya. Pilih **Saya calon penyewa** atau langsung tulis kebutuhan.
2. Gunakan **Perbaiki gaya** setelah balasan, tulis arahan dan contoh, lalu **Simpan & coba ulang**.
3. **Catatan gaya** mengelola instruksi aktif. Delapan pedoman aktif terbaru masuk ke konteks Muse. Ini bukan fine-tuning.
4. **Riwayat** melanjutkan sesi. Ikon dokumen di percakapan membuka ringkasan cuplikan. Unduh Markdown/JSON untuk catatan sendiri.
5. Buka **Simulasi → Kunci API Meta → Hubungkan & uji**. Kunci diuji satu kali, lalu disimpan terenkripsi. Setelah berhasil, mode Muse dipilih. Memutuskan koneksi menghapus kunci.

Simulasi adalah engine pola lokal yang gratis dan terbatas; koreksi contoh dapat diputar ulang. Jangan menilainya sebagai kemampuan Muse. Mode Muse membutuhkan akses dan saldo API Meta sendiri; belum diuji menggunakan kunci nyata pada build awal.

## Arsitektur

- React + Vinext pada Cloudflare Workers, D1 untuk data privat, Sites untuk hosting dan identitas.
- `/api/studio`: read/write state ber-revisi, semua query scoped ke identitas server.
- `/api/connection`: tes, enkripsi AES-GCM, status tanpa secret, hapus kunci.
- `/api/chat`: validasi, kuota atomik, instruksi peran + pedoman, bounded history, satu panggilan Muse.
- Provider tetap: `https://api.meta.ai/v1/chat/completions`, model `muse-spark-1.3`, `reasoning_effort: minimal`, `max_completion_tokens: 2048`.
- Runtime secret `APP_VAULT_KEY` disimpan melalui konfigurasi hosting, bukan source. Jangan rotasi sembarang: kunci tersimpan tidak dapat didekripsi tanpa key sebelumnya. Untuk MVP, hapus/disconnect kunci pengguna sebelum rotasi terencana.
- Header identitas `oai-authenticated-user-id` disediakan gateway. Tidak ada login Facebook atau bypass autentikasi.
- Token usage hanya respons berhasil. Batas 20 panggilan/hari per akun, termasuk koneksi dan percobaan gagal; reset 00.00 WIB. Batas bukan jaminan pengeluaran nol.

## Batas data

30 sesi, 200 pesan per sesi, 4.000 karakter per pesan, 30 pedoman, dengan batas total state 1,9 MB. Semua pesan sesi aktif dikirim berurutan ke Muse, hingga 80.000 karakter. Jika batas tercapai, permintaan dihentikan dengan pesan yang jelas; riwayat tidak dipangkas diam-diam. Koneksi dan mode dipulihkan dari akun. Tanpa identitas yang berhasil dimuat, pengiriman diblokir agar riwayat tidak terpisah. Ekspor JSON memuat semua sesi dalam snapshot, jumlah pesan, pedoman, revisi jawaban, draf, waktu dan status penyimpanan; secret tidak disertakan. Memori tidak otomatis menyatukan sesi atau akun berbeda. Tidak ada service worker yang meng-cache percakapan privat.

## Menjalankan dan menguji

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

Node 24 digunakan untuk test harness SQLite. Harness memuat route server aktual dengan D1 mock berbasis SQLite nyata. Provider test menggunakan mock yang jelas, tidak mengklaim panggilan Meta nyata.

Schema `db/schema.ts`; migrasi `drizzle/0000_magenta_echo.sql`. Untuk preview lokal, terapkan migrasi dengan Wrangler lokal ke `dist/server/wrangler.json` setelah build. Deploy Sites menerapkan migrasi produksi. Jangan menambahkan runtime DDL.

## Rancangan untuk demo hackathon

1. Masukkan kebutuhan tempat tinggal dalam bahasa natural.
2. Koreksi satu balasan yang terlalu formal; bandingkan versi sebelum/sesudah.
3. Gunakan skenario pemilik bermasalah air; tunjukkan penggalian kondisi tanpa membuat janji.
4. Uji penolakan pemilik dan permintaan untuk menyamar sebagai manusia. Agen harus jujur dan menghormati penolakan.
5. Tunjukkan catatan, ringkasan, dan ekspor sebagai bahan iterasi berikutnya.

Demo menggunakan Muse hanya setelah koneksi API nyata berhasil. Jangan menjanjikan integrasi Marketplace/Threads/Instagram dalam versi ini.

## Berikutnya

Validasi 10–20 percakapan nyata dengan Anda sebagai penguji; skor relevansi, kehangatan, satu pertanyaan berikutnya, fakta tanpa asumsi, penghormatan penolakan. Baru kemudian tambah akses listing berizin, bukti/provenance, izin per kontak, webhook balasan dan batas follow-up. Periksa aturan platform dan hackathon sebelum demo publik.

## Referensi resmi yang dipakai

- https://dev.meta.ai/docs/protocols/chat-completions
- https://dev.meta.ai/docs/pricing-rate-limits
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable

Web responsif dipilih untuk iterasi cepat, satu basis kode Android/iOS, dan tanpa distribusi APK. Manifest dan ikon disertakan; instalasi Home Screen/perilaku keyboard di perangkat fisik belum diuji.
