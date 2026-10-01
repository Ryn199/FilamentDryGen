# Filament Dryer G-Code Generator

**Bahasa Indonesia** | [English](README.en.md)

Aplikasi web untuk membuat file G-code pengering filamen menggunakan heatbed printer 3D (kompatibel dengan Marlin, Klipper, RepRap, dan firmware printer 3D pada umumnya). 

File G-code yang dihasilkan dirancang aman: printer tidak melakukan homing otomatis saat mulai, motor stepper dibebaskan, dan nozzle dipastikan mati sehingga tidak berisiko menabrak kotak pengering yang diletakkan di atas heatbed.

---

## Alur Penggunaan

Sebelum menjalankan file G-code di printer 3D, lakukan persiapan berikut:

1. Nyalakan printer 3D.
2. Naikkan posisi sumbu Z (toolhead/nozzle) secara manual atau melalui menu LCD printer sampai cukup tinggi agar tidak menyentuh gulungan filamen.
3. Letakkan spool filamen di atas heatbed.
4. Tutup spool menggunakan kardus (misalnya kardus bawaan filamen) yang sudah diberi beberapa lubang ventilasi di bagian atas untuk sirkulasi dan pembuangan uap lembap.
5. Jalankan file `.gcode` hasil generate melalui SD card atau Web UI printer (OctoPrint / Mainsail / Fluidd).
6. Heatbed akan memanaskan bed sampai suhu target, menahan suhu selama durasi yang ditentukan, mematikan pemanas saat selesai, dan membunyikan alarm/buzzer.

---

## Fitur

- **Preset Material**: Pilihan cepat suhu dan durasi rekomendasi untuk PLA, PETG, TPU, ABS/ASA, Nylon (PA), PC, dan PVA.
- **Pengaturan Fleksibel**: Bebas mengatur suhu (30–125°C) dan durasi (jam & menit) sesuai kebutuhan.
- **Alarm / Beep Notifikasi**:
  - Mode durasi nada tunggal (1–30 detik).
  - Mode preset melodi (Chime, Fanfare, Classic 3-Beep, Alert, Mario Coin, dll) yang dapat di-preview langsung di browser menggunakan Web Audio API.
- **Kipas Sirkulasi Opsional**: Pengaturan kecepatan part cooling fan (PWM) untuk meratakan panas di dalam kotak pengering.
- **Keamanan Bawaan**:
  - Heater nozzle selalu dimatikan (`M104 S0`).
  - Motor stepper dibebaskan (`M84`) agar tidak panas dan tidak mengunci posisi.
  - Homing otomatis dinonaktifkan secara default agar tidak menabrak kardus di atas bed.
- **Live Preview & Download**: Preview isi G-code secara real-time, tombol salin ke clipboard, dan download langsung file `.gcode`.

---

## Panduan Instalasi & Menjalankan

### 1. Menjalankan Langsung dengan Python

**Prasyarat:** Python 3.8 atau yang lebih baru.

1. Clone repositori ini atau download foldernya:
   ```bash
   git clone https://github.com/username/filamentDryerGcodeGenerator.git
   cd filamentDryerGcodeGenerator
   ```

2. Pasang dependensi:
   ```bash
   pip install -r requirements.txt
   ```

3. Jalankan aplikasi:
   ```bash
   python app.py
   ```

4. Buka browser dan akses:
   ```
   http://localhost:5000
   ```

---

### 2. Menjalankan Menggunakan Docker Compose (Homeserver)

Untuk kemudahan deployment di homeserver (seperti CasaOS, Portainer, Unraid, atau server Ubuntu/Debian):

1. Pastikan Docker dan Docker Compose sudah terpasang di sistem.
2. Jalankan perintah berikut di folder project:
   ```bash
   docker compose up -d
   ```
3. Buka browser dan akses melalui IP server Anda:
   ```
   http://<IP-SERVER>:5000
   ```
4. Untuk menghentikan container:
   ```bash
   docker compose down
   ```

---

### 3. Build Docker Image Manual

Jika ingin menjalankan container tanpa Docker Compose:

```bash
docker build -t filament-dryer .
docker run -d --name filament-dryer -p 5000:5000 --restart unless-stopped filament-dryer
```

---

## Variabel Lingkungan (Environment Variables)

Aplikasi mendukung beberapa konfigurasi environment:

| Variabel | Default | Keterangan |
|---|---|---|
| `PORT` | `5000` | Port listen aplikasi web |
| `HOST` | `0.0.0.0` | Host bind IP |
| `FLASK_ENV` | `production` | Set ke `development` untuk mengaktifkan template reload |

Contoh kustomisasi port pada `docker-compose.yml`:
```yaml
ports:
  - "8080:5000"
```

---

## Struktur Proyek

```
filamentDryerGcodeGenerator/
├── app.py                 # Backend Flask & API
├── generator.py           # Logika pembuatan G-code & kalkulasi
├── main.py                # Antarmuka CLI sederhana
├── templates/
│   └── index.html         # Template UI web
├── static/
│   ├── css/
│   │   └── style.css      # Styling tampilan & layout
│   └── js/
│       └── app.js         # Interaktivitas UI, preview G-code & audio player
├── Dockerfile             # Konfigurasi container Docker
├── docker-compose.yml     # Konfigurasi Docker Compose
├── requirements.txt       # Dependensi Python
└── README.md              # Dokumentasi proyek
```

---

## Panduan Suhu dan Tips Pengeringan

| Material | Suhu Rekomendasi | Durasi Rekomendasi |
|---|---|---|
| PLA / PLA+ | 45 - 50°C | 4 - 6 Jam |
| PETG | 60 - 65°C | 5 - 7 Jam |
| TPU / TPE | 50 - 55°C | 4 - 6 Jam |
| ABS / ASA | 75 - 80°C | 4 - 6 Jam |
| Nylon (PA) | 80 - 90°C | 8 - 12 Jam |
| PC (Polycarbonate) | 90 - 100°C | 6 - 8 Jam |

**Catatan Penting:**
- Jangan menyetel suhu heatbed melampaui suhu transisi kaca (glass transition temperature / Tg) dari material, terutama PLA (maksimal 50°C). Suhu berlebih dapat menyebabkan filamen melunak dan saling menempel di dalam spool.
- Gunakan kardus yang bersih dan pastikan ada lubang ventilasi di bagian atas. Tanpa ventilasi, udara lembap yang keluar dari filamen akan terperangkap kembali di dalam kardus.
- Pastikan printer berada di ruangan dengan ventilasi yang baik, terutama saat mengeringkan material seperti ABS atau Nylon.
