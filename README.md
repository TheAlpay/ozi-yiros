# Ozi Yiros — Digital Menu

Brisbane's authentic Greek street food restaurant için geliştirilmiş, Firebase altyapılı tam özellikli dijital menü uygulaması.

**Live:** [ozi-yiros.vercel.app](https://ozi-yiros.vercel.app)

---

## Özellikler

- **Müşteri Menü Görünümü** — Tüm ürünler kategorilere göre gruplandırılmış şekilde listelenir
- **Ürün Arama** — İsim veya içerik bazında anlık arama
- **Kategori Filtresi** — Yiros, Snack Pack, Pizza, Sauces, Extras, Deals
- **Ürün Detay Sayfası** — Kalori, hazırlık süresi, vegetarian etiketi, share butonu
- **Admin Paneli** — PIN korumalı; ürün ekle, düzenle, sil
- **Demo Data Seed** — Veritabanı boşsa otomatik olarak örnek menü yüklenir
- **Gerçek Zamanlı Güncelleme** — Firestore `onSnapshot` ile değişiklikler anında yansır

---

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript 5 |
| Stil | Tailwind CSS 3 |
| Veritabanı | Firebase Firestore |
| Font | Outfit (başlık) + Inter (gövde) via `next/font/google` |
| Deploy | Vercel |

---

## Kurulum

```bash
git clone https://github.com/TheAlpay/ozi-yiros.git
cd ozi-yiros
npm install
```

### Ortam Değişkenleri

Proje kökünde `.env.local` dosyası oluştur:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Opsiyonel — varsayılan: 1234
NEXT_PUBLIC_ADMIN_PIN=senin_sectigin_pin
```

### Geliştirme Sunucusu

```bash
npm run dev
```

`http://localhost:3000` adresini aç.

---

## Proje Yapısı

```
src/
├── app/
│   ├── layout.tsx              # Root layout + font tanımları
│   ├── globals.css             # Tailwind directives + utility sınıflar
│   ├── page.tsx                # Ana sayfa — state yönetimi, Firebase CRUD
│   └── product/[id]/page.tsx  # Ürün detay sayfası
├── components/
│   ├── MenuCustomerView.tsx    # Müşteri menü görünümü
│   ├── AdminDashboard.tsx      # Admin yönetim paneli
│   └── AdminLogin.tsx          # PIN giriş ekranı
└── lib/
    ├── firebase.ts             # Firebase başlatma
    ├── constants.ts            # Kategoriler + demo data
    └── types.ts                # Paylaşılan TypeScript tipleri
```

---

## Admin Kullanımı

1. Menü sayfasının sağ üstündeki dişli ikonuna tıkla
2. PIN'i gir (varsayılan: `1234`, `.env.local` ile değiştirilebilir)
3. Dashboard'dan ürün ekle / düzenle / sil
4. Veritabanı boşsa "Seed Demo Data" butonu ile örnek menü yükle

---

## Adres & İletişim

**Ozi Yiros** — 355 Samsonvale Rd, Warner QLD 4500  
Açık her gün: 11:00 AM – 10:00 PM
