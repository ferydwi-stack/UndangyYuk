# UndangYuk.com - Platform Undangan Digital Multi-Acara & Adat Nusantara

**UndangYuk.com** adalah website platform penyedia layanan dan template undangan digital elegan dengan tema adat Nusantara dan Modern terlengkap di Indonesia, serta kini dilengkapi dengan **Undangan Acara Lainnya** (Khitanan, Aqiqah, Sweet 17th Birthday, dan Wisuda).

---

## 🌟 Struktur Paket & Perbedaan Template (Tiering)

Setiap tingkatan paket dan tema memiliki struktur, jumlah foto, dan layout yang dirancang berbeda:

| Kategori Paket | Jumlah Foto | Karakter Desain & Layout | Fitur Utama |
|---|---|---|---|
| **Paket Standar** | **3 - 4 Foto** | • Tata letak clean, ringkas, dan fokus pada informasi inti.<br>• Frame foto scrapbook / polaroid / oval elegan.<br>• 1 Kolom acara & maps terpadu. | • Unlimited link nama tamu WhatsApp<br>• Audio musik latar<br>• Petunjuk rute Google Maps<br>• Konfirmasi kehadiran WhatsApp |
| **Paket Premium Adat** | **6 - 8 Foto** | • Ornamen budaya kaya (Kubah Keraton Jawa, Gonjong Minang, Kori Agung Bali, Belah Ketupat Bugis, Tenun Gorga Batak).<br>• Galeri Bento Grid / Masonry dinamis.<br>• Multi-kolom acara (Akad & Resepsi terpisah). | • Semua fitur Standar<br>• Amplop Digital & Tombol Salin Rekening<br>• Buku Tamu & RSVP Real-time<br>• Dispatcher Konfirmasi Langsung ke WhatsApp Pengantin |
| **Paket VIP Custom** | **8 - 12 Foto** | • Desain Ultra Luxury kontemporer (Midnight Rose Gold, Glassmorphism, Floating Navigation).<br>• Layout Masonry layar lebar & video teaser embed. | • Semua fitur Premium<br>• Custom Domain (`namapasangan.com`)<br>• Galeri Tanpa Batas & Video Player<br>• QR Code Check-in Tamu & Filter Instagram |

---

## 🎨 Katalog Koleksi Template (16 Template)

### 1. Undangan Pernikahan (Wedding - 12 Tema):
1. **Adat Jawa (Kasultanan)** (`templates/jawa/`): Bingkai Kubah Keraton, Sogan Batik, 6 Foto Arch Grid.
2. **Adat Sunda (Priangan)** (`templates/sunda/`): Oval Floral, Ronce Melati, 5 Foto Kolase Asimetris.
3. **Adat Minangkabau** (`templates/minang/`): Atap Gonjong Hexagon, Songket Marawa, 8 Foto Bento Grid.
4. **Adat Batak Toba** (`templates/batak/`): Strip Ukiran Gorga Triwarna & Ulos Ribbon, 6 Foto Simetris.
5. **Adat Bali (Pawiwahan)** (`templates/bali/`): Candi Bentar & Kori Agung Shrine, 7 Foto Masonry Grid.
6. **Adat Bugis Makassar** (`templates/bugis/`): Frame Belah Ketupat, Tenun Sengkang Sutera Emerald, 6 Foto.
7. **Adat Betawi (Palang Pintu)** (`templates/betawi/`): Border Gigi Balang, Polaroid Scrapbook Tilted, 6 Foto.
8. **Adat Dayak Borneo** (`templates/dayak/`): Perisai Talawang Hexagon, Tribal Motif & Sape Music, 6 Foto.
9. **Adat Madura (Panganten Ageng)** (`templates/madura/`): Widescreen Cinematic Frame, Pese'an Red & Gold, 5 Foto.
10. **Adat Palembang (Aesan Gede)** (`templates/palembang/`): Songket Lepus Emas Kesultanan Sriwijaya, 6 Foto.
11. **Modern Luxury** (`templates/modern/`): Smooth Pill Glassmorphism, Midnight Rose Gold, 8 Foto Masonry.
12. **Rustic Boho** (`templates/rustic/`): Botanical Sage & Terracotta, Torn Paper Edges, 6 Foto Vintage.

### 2. Undangan Acara Lainnya (Non-Wedding - 4 Tema):
13. **Tasyakuran Khitanan** (`templates/khitan/`): Tema Islami Ceria Emerald & Gold, 3 Foto Galeri Anak, Doa Khataman, Maps & Kado Khitan.
14. **Tasyakuran Aqiqah Bayi** (`templates/aqiqah/`): Soft Pastel Warm Coral & Sage, 3 Foto Lucu Bayi, Info Kelahiran, Cukur Rambut & Tabungan Bayi.
15. **Sweet 17th Birthday Party** (`templates/birthday/`): Neon Violet & Rose Gold Glamour, 4 Foto Party Highlights, Dress Code, Countdown & RSVP.
16. **Tasyakuran Wisuda (Graduation)** (`templates/wisuda/`): Academic Royal Navy & Amber Gold, 3 Foto Toga, Info Gelar Cum Laude & Buku Tamu.

---

## ⚡ Alur RSVP & Integrasi Firebase Cloud Database

### 1. Dual-Layer Storage (Firebase + Local Storage Fallback):
Form RSVP pada template bekerja secara instan:
- **Online Real-time**: Jika Firebase Config diisi, data ucapan langsung disinkronkan ke Firebase Firestore/Realtime DB sehingga bisa dibaca oleh semua tamu di seluruh dunia secara detik (*real-time sync*).
- **Fallback Cerdas**: Jika offline atau berjalan lokal, data tetap tersimpan rapi di `localStorage` browser.
- **WhatsApp Dispatcher**: Setelah mengisi form, tamu langsung disodorkan pop-up konfirmasi untuk mengirimkan rekapan kehadiran ke nomor WhatsApp penyelenggara acara.

### 2. Cara Mengaktifkan Firebase (Opsional):
Jika Anda ingin menghubungkan project ke Firebase Console:
1. Buka [Firebase Console](https://console.firebase.google.com/) dan buat project baru.
2. Buat database **Cloud Firestore** dalam mode Test / Production.
3. Masukkan konfigurasi Firebase ke dalam script template:
```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

---

## 🚀 Cara Deploy Website ke Internet (Online)

### Opsi 1: Deploy ke Vercel (Gratis & Tercepat)
1. Buat akun di [Vercel.com](https://vercel.com).
2. Install Vercel CLI atau hubungkan repository GitHub proyek ini.
3. Klik **Import Project** ➔ Klik **Deploy**.
4. Website langsung online dalam 30 detik dengan HTTPS gratis!

### Opsi 2: Deploy ke GitHub Pages (Gratis)
1. Push repository ini ke GitHub.
2. Buka menu **Settings** repository ➔ Pilih menu **Pages**.
3. Pada bagian **Branch**, pilih `main` / `root` ➔ Klik **Save**.
4. Website aktif di `https://username.github.io/proyek-undangan-nikah`.

---

&copy; 2026 **UndangYuk.com**. All Rights Reserved.
