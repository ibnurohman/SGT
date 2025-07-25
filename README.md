# Prasyarat
Sebelum memulai, pastikan Anda telah menginstal yang berikut:
Node.js (versi 18.x atau lebih tinggi direkomendasikan)
npm atau Yarn (manajer paket)
Akses ke Firebase Project (atau siapkan yang baru)
Backend Express.js yang sudah berjalan dan terkonfigurasi untuk API produk dan autentikasi. (Asumsi ini adalah proyek terpisah atau akan disediakan).

# Setup Awal
Clone Repositori
git clone 

# Instalasi Dependensi
Setelah meng-clone repositori, instal semua dependensi yang diperlukan:
yarn install

# ketika saya mengkonfigurasi firebase banyak perubahan yang saya lakukan di backend jadi mungkin jika
# beda backend akan tidak bisa jalan tetapi saya bisa pastikan jika konfigurasi yang saya lakukan berhasil

# Konfigurasi Firebase
Aplikasi ini menggunakan Firebase Authentication untuk mengelola sesi pengguna. Anda perlu menyiapkan proyek Firebase dan mengonfigurasi kredensialnya.

1. Membuat Proyek Firebase
Jika Anda belum memiliki proyek Firebase, buat yang baru:

Buka Firebase Console.

Klik "Add project" atau "Buat proyek".

Ikuti langkah-langkah untuk membuat proyek baru.

2. Mengaktifkan Autentikasi
Dalam proyek Firebase Anda:

Navigasi ke bagian Authentication di panel kiri.

Pilih tab Sign-in method.

Aktifkan provider Email/Password.

3. Mengisi Environment Variables
Anda perlu menambahkan kredensial Firebase Anda ke aplikasi Next.js.

Di root folder proyek Anda, buat file baru bernama .env.local.

Tambahkan variabel lingkungan berikut ke file .env.local Anda:

Cuplikan kode

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID"
Cara Mendapatkan Nilai-nilai Ini:

Di Firebase Console Anda, pilih proyek Anda.

Klik ikon Settings (roda gigi) di samping "Project overview" dan pilih Project settings.

Gulir ke bawah ke bagian Your apps.

Jika Anda belum memiliki aplikasi web, klik ikon Web (</>) untuk menambahkan aplikasi baru. Ikuti petunjuknya.

Setelah aplikasi web Anda terdaftar, Anda akan melihat konfigurasi Firebase JavaScript. Salin nilai-nilai yang sesuai (apiKey, authDomain, projectId, dll.) dan tempelkan ke file .env.local Anda. Pastikan untuk menambahkan prefix NEXT_PUBLIC_ karena ini adalah variabel yang akan diakses di sisi klien Next.js.


# Menjalankan Aplikasi
Setelah semua dependensi terinstal dan konfigurasi Firebase selesai, Anda dapat menjalankan aplikasi:

yarn dev
