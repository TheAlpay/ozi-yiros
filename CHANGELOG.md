# Changelog

---

## [Cleanup & Move] — 2026-05-12

### Temizlik

- **Default Next.js/Vercel varlıkları silindi:** `public/next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`
- **`AGENTS.md` silindi:** yanıltıcı içerik
- **`next.config.ts` güncellendi:** `poweredByHeader: false` eklendi — HTTP yanıtlarından "X-Powered-By: Next.js" başlığı kaldırıldı
- **Token temizliği:** Tüm credentials yalnızca `.env.local` içinde (gitignore'da), kaynak kodda sabit değer yok
- **Proje `/c/Users/alpay/ozi-yiros/` konumuna taşındı**

### Firestore Seed

- 37 ürün MENU.md'den Firestore'a yüklendi (REST API ile)
- Kategoriler: Yiros (5), Snack Pack (7), Pizza (8), Sauces (9), Extras (6), Deals (2)

---

## [Refactor] — 2026-05-12

### Kritik Bug Düzeltmeleri

- **Auto-seed race condition:** Stale `loading` closure → `useRef` ile düzeltildi
- **`border-3` geçersiz Tailwind sınıfı:** `border-[3px]` olarak düzeltildi
- **Share butonu:** Web Share API + clipboard fallback eklendi
- **`ingredients` null-safe erişim:** `.toLowerCase()` çağrısından önce `?? ''` eklendi

### Tip Güvenliği

- `src/lib/types.ts` oluşturuldu: `Product`, `ViewType`, `ProductFormData`, `EMPTY_FORM`
- Tüm `any` tipleri kaldırıldı

### UX İyileştirmeleri

- "All" kategorisinde section header'ları eklendi
- Admin paneline kategori filtresi eklendi
- `alert()` → inline feedback
- Font loading: `@import` → `next/font/google`
- Admin PIN: `NEXT_PUBLIC_ADMIN_PIN` env var'a taşındı

### Silinen Dead Code

`ProductCard`, `Header`, `Button` bileşenleri ve CSS modülleri, `page.module.css`

---

## [Initial Build] — 2026-05-11

- Next.js + TypeScript + Tailwind + Firebase kurulumu
- Müşteri menü görünümü, admin paneli, ürün detay sayfası
- Firestore real-time listener ile CRUD
- Vercel deploy
