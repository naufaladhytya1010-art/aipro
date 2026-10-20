# Master Prompt AI

Aplikasi generator master prompt berbasis HTML, CSS, dan JavaScript murni. Tampilan responsif dengan tema hitam-merah, riwayat/favorit lokal, dua bahasa, PWA, ekspor TXT/PDF, dan integrasi opsional OpenAI, Anthropic, serta Google Gemini.

## Struktur

```text
master-prompt-ai/
├── index.html
├── style.css
├── app.js
├── manifest.json
├── sw.js
├── icon.svg
└── README.md
```

## Menjalankan

**Cara yang disarankan:** jalankan server lokal sederhana dari folder proyek:

```bash
python3 -m http.server 8000
```

Buka `http://localhost:8000` di browser. PWA/service worker memerlukan HTTPS atau localhost; membuka `index.html` langsung tetap memungkinkan fungsi dasar, tetapi instalasi PWA/offline tidak akan aktif penuh.

## Instal sebagai PWA

1. Upload semua file ke hosting HTTPS (misalnya GitHub Pages).
2. Buka situs di browser yang mendukung PWA.
3. Di Chrome/Edge, pilih **Install app** dari menu browser. Pada Android, pilih **Add to Home screen / Install app** bila tersedia.
4. Untuk ikon yang kompatibel luas, sebaiknya tambahkan ikon PNG 192×192 dan 512×512 lalu daftarkan keduanya di `manifest.json`. Ikon SVG saat ini digunakan sebagai ikon fleksibel.

## Mengubah menjadi APK

### Opsi A — PWABuilder
1. Deploy situs ke HTTPS.
2. Buka https://www.pwabuilder.com dan masukkan URL situs.
3. Ikuti pemeriksaan manifest/service worker, lalu gunakan paket Android yang disediakan.
4. Uji APK pada perangkat sendiri sebelum distribusi.

### Opsi B — Capacitor
Capacitor umumnya membutuhkan Node.js dan Android Studio. Untuk proyek web statis:
1. Buat proyek Node dan pasang Capacitor:
   ```bash
   npm init -y
   npm install @capacitor/core @capacitor/cli
   npx cap init "Master Prompt AI" "com.example.masterpromptai"
   ```
2. Jadikan folder proyek ini sebagai direktori web Capacitor, misalnya salin file web ke folder `www` dan set `webDir` ke `www` pada konfigurasi Capacitor.
3. Pasang platform Android:
   ```bash
   npm install @capacitor/android
   npx cap add android
   npx cap sync android
   npx cap open android
   ```
4. Bangun APK dari Android Studio. Ikuti dokumentasi resmi Capacitor karena konfigurasi Android dapat berubah antarversi.

## Integrasi API — baca sebelum digunakan

Pengaturan menyimpan key di `localStorage` browser dan panggilan API dibuat langsung dari klien. Ini praktis untuk uji coba lokal, tetapi **tidak aman untuk aplikasi publik**: pengguna browser dapat memeriksa dan mengekstrak API key, dan provider dapat mengubah kebijakan CORS/model sewaktu-waktu. Untuk deployment publik, pindahkan panggilan API ke backend/serverless proxy, simpan key di environment variables server, tambahkan autentikasi dan rate limiting, dan jangan pernah menaruh secret di repositori.

- OpenAI: default `gpt-4.1-mini`
- Anthropic: default `claude-3-5-haiku-latest`
- Gemini: default `gemini-2.0-flash`

Nama model yang tersedia dapat berubah; isi model yang didukung akunmu pada Pengaturan. Error API ditampilkan di area status generator. Template lokal selalu dapat digunakan tanpa API key.

## Data dan privasi

Riwayat, favorit, bahasa, dan pengaturan disimpan di `localStorage` pada browser/perangkat yang sama. Membersihkan data situs/browser akan menghapus data tersebut. Jangan masukkan API key ke perangkat bersama.

## Catatan ekspor

TXT diunduh sebagai file teks. Ekspor PDF membuka dialog cetak browser; pilih **Save to PDF** sebagai printer tujuan.
