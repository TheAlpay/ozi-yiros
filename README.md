# Ozi Yiros — Digital Menu

Brisbane'in otantik Yunan sokak yemeği restoranı için Firebase altyapılı dijital menü uygulaması.

**Live:** [ozi-yiros.vercel.app](https://ozi-yiros.vercel.app)

---

## Özellikler

- Tüm ürünler kategoriye göre gruplandırılmış menü listesi
- İsim ve içerik bazında anlık arama
- Yiros, Snack Pack, Pizza, Sauces, Extras, Deals kategorileri
- Ürün detay sayfası — kalori, hazırlık süresi, vegetarian etiketi, share butonu
- PIN korumalı admin paneli — ürün ekle, düzenle, sil
- Veritabanı boşsa otomatik demo data seed
- Firestore ile gerçek zamanlı güncelleme

---

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript 5 |
| Stil | Tailwind CSS 3 |
| Veritabanı | Firebase Firestore |
| Font | Outfit + Inter via `next/font/google` |
| Deploy | Vercel |

---

## Kurulum

```bash
git clone https://github.com/TheAlpay/ozi-yiros.git
cd ozi-yiros
npm install
```

### Ortam Değişkenleri

Proje kökünde `.env.local` oluştur:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Opsiyonel — varsayılan: 1234
NEXT_PUBLIC_ADMIN_PIN=...
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
│   ├── globals.css             # Tailwind + utility sınıflar
│   ├── page.tsx                # Ana sayfa — state, Firebase CRUD
│   └── product/[id]/page.tsx  # Ürün detay sayfası
├── components/
│   ├── MenuCustomerView.tsx    # Müşteri menü görünümü
│   ├── AdminDashboard.tsx      # Admin yönetim paneli
│   └── AdminLogin.tsx          # PIN giriş ekranı
└── lib/
    ├── firebase.ts             # Firebase başlatma
    ├── constants.ts            # Kategoriler + demo data
    └── types.ts                # TypeScript tipleri
```

---

## Firebase Kurulumu

1. [console.firebase.google.com](https://console.firebase.google.com) adresinden yeni proje oluştur
2. Firestore Database → **Create database** → Test mode
3. Project Settings → Web app credentials'ı `.env.local`'a ekle
4. Firestore kurallarını güncelle (production için auth ekle)

---

## Admin Kullanımı

1. Menü sayfasının sağ üstündeki dişli ikonuna tıkla
2. PIN gir (varsayılan: `1234`, `.env.local` ile değiştirilebilir)
3. Dashboard'dan ürün ekle / düzenle / sil

---

## Adres

**Ozi Yiros** — 355 Samsonvale Rd, Warner QLD 4500  
Açık her gün: 11:00 AM – 10:00 PM
