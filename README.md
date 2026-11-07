# bootstrap-kemenkes-theme (unofficial)

Tema **Bootstrap 5** bergaya visual 2024 (palet teal–lime, tabel bergaris, kartu KPI,
sidebar, callout, badge status) untuk dashboard/aplikasi.

> **Unofficial.** Proyek ini **bukan** produk resmi dan tidak berafiliasi/endorsed oleh
> Kementerian Kesehatan RI. Paket ini **tidak** memuat logo resmi, supergrafis, atau file
> font komersial (VAG Rounded). Palet warna dan tata letak adalah karya orisinal.

## Fitur

- Token warna & tipografi lewat CSS custom properties (mudah di-override).
- Override langsung ke variabel Bootstrap 5 (`--bs-primary`, `--bs-*`).
- Komponen: navbar, sidebar, kartu, KPI card (dengan ikon), tabel bergaris, badge status, callout, form, progress, pagination.
- Contoh galeri ikon (`examples/icons.html`).
- Logo & supergrafis (`examples/logo.html`) dan font picker (`examples/font-picker.html`).
- Kitchen-sink komponen (`examples/components.html`): tombol, form, tab, modal, offcanvas, toast, timeline, skeleton, dll.
- **Buttons** (`examples/buttons.html`): solid/outline/soft, ukuran, ikon, group — warna base palette.
- Helper JS (`js/bootstrap-kemenkes.js`): font picker, toast, copy CSS.
- **Data table** (`examples/data-table.html`): sortir kolom, pencarian, pagination.
- **Form wizard** (`examples/wizard.html`): langkah bertahap + progres.
- **Chart ringan** (`examples/charts.html`): sparkline (SVG) & bar chart (CSS).
- **Card + Ikon** (`examples/cards-icons.html`): variasi kartu + 308 ikon dengan warna dari base palette.
- Dua cara pakai: **CDN override** (tanpa build) atau **build SCSS** (Bootstrap dibundel).

## Mulai cepat (tanpa build)

Muat Bootstrap 5 lalu stylesheet tema ini:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="dist/bootstrap-kemenkes.css" rel="stylesheet">
```

Lihat `examples/index.html` (komponen) dan `examples/dashboard.html` (layout dashboard).

## Helper JS

```html
<script src="js/bootstrap-kemenkes.js"></script>
<script>
  KmkTheme.toast("Tersimpan");        // notifikasi
  KmkTheme.copy(":root{...}");        // salin teks
  KmkTheme.applyFonts({ size: 15, radius: 10 }); // ubah preferensi
</script>
```

Halaman dengan `[data-kmk-font-picker]` otomatis mengaktifkan font picker (tersimpan di localStorage).

## Build penuh (SCSS)

```bash
npm install
npm run build
# hasil: dist/bootstrap-kemenkes.full.css (Bootstrap + tema dalam satu file)
```

## Token warna

Palet resmi Kemenkes 2024 (ekuivalen RGB dari set CMYK brand):

| Token | HEX | Pemakaian |
|---|---|---|
| `--kmk-teal` | `#06B2BB` | Aksen utama, tombol primary |
| `--kmk-teal-cyan` | `#00D0D7` | Aksen terang/highlight |
| `--kmk-teal-dark` | `#087B6D` | Link, heading, teks di atas lime |
| `--kmk-teal-deep` | `#007276` | Panel/teks tebal |
| `--kmk-teal-light` | `#16AE97` | Success/aksen |
| `--kmk-green-leaf` | `#43B077` | Hijau pendukung |
| `--kmk-lime` | `#D2DB2F` | Header tabel, highlight |
| `--kmk-olive` | `#C3B82B` | Lime gelap |
| `--kmk-lime-soft` | `#F4F7C2` | Latar kartu/callout |
| `--kmk-orange` | `#E3862D` | Peringatan/aksen |
| `--kmk-red` | `#C00000` | Error/hapus, status kritis |
| `--kmk-gray` | `#696A69` | Body text |
| `--kmk-gray-soft` | `#898983` | Caption/muted |
| `--kmk-gray-dark` | `#62625E` | Teks netral gelap |
| `--kmk-gray-light` | `#BFBFBF` | Garis/sekunder netral |
| `--kmk-pale-teal` | `#C7EDEB` | Latar kartu/callout |
| `--kmk-canvas` | `#F2F2F2` | Zebra tabel |
| `--kmk-line` | `#D9DDDB` | Border |

## Tipografi

- Heading: `"VAG Rounded"`, fallback `"Quicksand"` (SIL OFL) / `"Varela Round"` / system.
- Body: `"Segoe UI Brand"`, fallback `"Segoe UI"` / `system-ui`.

`dist/bootstrap-kemenkes.css` mendeklarasikan `@font-face` yang menunjuk ke
`assets/fonts/vagrounded-bold.ttf` dan `assets/fonts/segoeui.ttf`.

File font disertakan di `assets/fonts/` (`vagrounded-bold.ttf`, `segoeui.ttf`). Bila file
tidak tersedia, browser otomatis memakai fallback Quicksand/system.

## Kebijakan aset brand

Paket ini sengaja **tidak** memuat:

- Logo/supergrafis resmi Kementerian Kesehatan — gunakan `assets/logo-placeholder.svg`
  atau logo milik Anda sendiri.
- Font VAG Rounded / Segoe UI Brand (`assets/fonts/`).
- Logo & supergrafis resmi (`assets/logo-kemenkes/`).
- Ikon default dashboard (`assets/ep-brand/icons/`, 208 ikon).

Semua aset tersebut disertakan untuk keperluan internal/standarisasi. Hak atas logo,
supergrafis, dan font tetap milik pemiliknya.

Jika Anda perlu memakai aset resmi, urus izin ke pemilik aset. Warna dan komponen CSS
bebas dipakai di bawah lisensi MIT.

## Struktur

```
bootstrap-kemenkes-theme/
├─ assets/logo-placeholder.svg
├─ assets/fonts/                    # VAG Rounded + Segoe UI
├─ assets/logo-kemenkes/            # logo & supergrafis resmi
├─ assets/ep-brand/icons/           # 208 ikon default dashboard
├─ assets/icons/ + icons-white/     # ikon kurasi + hasil ekstraksi
├─ js/bootstrap-kemenkes.js          # helper (font picker, toast, copy, datatable, wizard, chart)
├─ examples/_pub/                   # CSS dashboard publik
├─ dist/bootstrap-kemenkes.css      # override-only (pakai setelah Bootstrap CDN)
├─ js/bootstrap-kemenkes.js          # helper (font picker, toast, copy, datatable, wizard, chart)
├─ examples/
│  ├─ index.html                    # galeri komponen
│  ├─ dashboard.html                # contoh layout dashboard
│  ├─ renggar.html                  # contoh statis Dashboard Publik
│  ├─ renggar-anggaran.html         # contoh statis Monitoring Anggaran

├─ scss/
│  ├─ _tokens.scss
│  ├─ _components.scss
│  └─ bootstrap-kemenkes.scss
├─ LICENSE
└─ package.json
```

## Lisensi

MIT — lihat [LICENSE](LICENSE). Berlaku untuk kode CSS/HTML/SCSS. Aset pihak ketiga
(logo/font) tidak termasuk dan tetap milik pemiliknya.

## Kontribusi

Issue dan PR terbuka. Mohon jangan mengirim logo resmi atau file font berbayar ke repo ini.


## Development

```bash
npm install
npm run build     # dist/bootstrap-kemenkes.full.css (Bootstrap + tema)
npm run check     # validasi semua link/aset lokal
npm run serve     # demo: http://localhost:3000/examples/index.html
```

## Deployment (GitHub Pages)

Repo ini menyertakan workflow `.github/workflows/pages.yml`. Push ke branch `main`,
lalu aktifkan Pages (Source: GitHub Actions). Demo tersedia di
`https://<user>.github.io/<repo>/examples/index.html`.

## Browser support

Browser modern (Chrome/Edge/Safari/Firefox terbaru). CSS memakai `color-mix()`
dan `:focus-visible`; browser lama otomatis fallback ke warna dasar.

## Changelog

Lihat [CHANGELOG.md](CHANGELOG.md).

## Aksesibilitas

Skip-link ke konten, focus ring `:focus-visible`, `lang="id"`, dan tabel responsif.
