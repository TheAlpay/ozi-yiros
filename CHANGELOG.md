# Changelog

## [Refactor] — 2026-05-12

Bu sürümde projenin tamamı baştan incelenerek aşağıdaki bug'lar giderilmiş, eksikler tamamlanmış ve kod kalitesi iyileştirilmiştir.

---

### Kritik Bug Düzeltmeleri

#### Auto-seed race condition
- **Sorun:** `onSnapshot` callback'i içinde `loading` state'i stale (bayat) okunuyordu. `loading` başlangıçta `true` olarak set edilip ilk snapshot geldiğinde hâlâ `true` kalıyordu; bu yüzden `!loading` koşulu hiç sağlanmıyor ve otomatik seed hiçbir zaman çalışmıyordu.
- **Düzeltme:** `seedAttempted` adlı bir `useRef` eklendi. Artık state yerine ref kontrol edildiğinden race condition ortadan kalktı.

#### `setLoading` inside `useEffect` anti-pattern
- **Sorun:** `useEffect` gövdesinde senkron `setState` çağrısı React'in cascade render kuralını ihlal ediyordu (ESLint `react-hooks/set-state-in-effect` hatası).
- **Düzeltme:** `useState` başlangıç değeri `db !== null` olarak ayarlandı. Firebase bağlantısı yoksa loading zaten `false` başlar; varsa `true` başlar ve `onSnapshot` geldiğinde `false` olur — effect içinde ayrıca set etmeye gerek kalmadı.

#### `border-3` geçersiz Tailwind sınıfı
- **Sorun:** `product/[id]/page.tsx` içindeki loading spinner'da `border-3` kullanılıyordu. Bu sınıf Tailwind CSS 3'te bulunmuyor; spinner görünmüyordu.
- **Düzeltme:** `border-[3px]` (arbitrary value) ile değiştirildi.

#### Share butonu işlevsiz
- **Sorun:** Ürün detay sayfasındaki Share butonunun hiç `onClick` handler'ı yoktu, tamamen dekorasyondu.
- **Düzeltme:** Web Share API entegre edildi. Destekleyen tarayıcılarda native share sheet açılıyor, desteklemeyenlerde URL clipboard'a kopyalanıyor ve "Copied!" bildirimi gösteriliyor.

#### `ingredients?.toLowerCase()` güvensiz erişim
- **Sorun:** `MenuCustomerView.tsx` içindeki arama filtresinde `item.ingredients.toLowerCase()` doğrudan çağrılıyordu. `ingredients` alanı `undefined` olduğunda uygulama crash ediyordu.
- **Düzeltme:** `(item.ingredients ?? '').toLowerCase()` olarak güvenli hale getirildi.

---

### Tip Güvenliği İyileştirmeleri

#### `src/lib/types.ts` (yeni dosya)
Daha önce her dosyada `any` ile geçiştirilen tipler merkezi bir dosyada tanımlandı:
- `Product` — Firestore ürün dökümanının tam arayüzü
- `ViewType` — `'menu' | 'admin-login' | 'admin'` union tipi (önceden loose string)
- `ProductFormData` — Form alanlarının tipi
- `EMPTY_FORM` — Form sıfırlama için tek kaynaklı sabit

Tüm componentlerde `any[]` ve `any` kullanan prop tipleri `Product`, `ProductFormData`, `ViewType` ile değiştirildi.

---

### UX İyileştirmeleri

#### Menüde kategori gruplandırması
- **Önceki durum:** "All" seçiliyken tüm ürünler düz bir liste olarak akıyordu; hangi kategorinin nerede başladığı belli değildi.
- **Yeni durum:** "All" görünümünde her kategori kendi section başlığıyla (`<h2>`) ve kaç ürün içerdiğini gösteren sayaçla ayrı bir blok olarak gösteriliyor.

#### Admin paneline kategori filtresi
- **Önceki durum:** Admin listesinde tüm ürünler tek seferde görünüyordu, filtreleme yoktu.
- **Yeni durum:** Sağ üstteki dropdown ile kategoriye göre filtrelenebiliyor; `filtrelenmiş / toplam` sayısı gösteriliyor.

#### Admin seed bildirimi
- **Önceki durum:** Seed tamamlandığında `alert()` kullanılıyordu (tarayıcı dialog'u).
- **Yeni durum:** Buton içinde inline "Done!" ✓ bildirimi gösteriyor, 3 saniye sonra kayboluyor.

#### Font loading optimizasyonu
- **Önceki durum:** `globals.css` içinden `@import url(...)` ile Google Fonts yükleniyordu. Bu render-blocking bir istektir ve Lighthouse performans skorunu düşürür.
- **Yeni durum:** `next/font/google` kullanılarak fontlar build-time'da indirilip self-hosted ediliyor. `@import` satırları kaldırıldı.

#### Admin PIN çevre değişkeni
- **Önceki durum:** PIN `'1234'` olarak kaynak koduna hardcode edilmişti.
- **Yeni durum:** `process.env.NEXT_PUBLIC_ADMIN_PIN` okunuyor; tanımlı değilse `'1234'` fallback. `.env.local` ile özelleştirilebilir.

---

### Silinen Dosyalar (Dead Code)

Aşağıdaki dosyalar projede hiçbir yerde import edilmiyordu; kaldırıldı.

| Dosya | Sorun |
|-------|-------|
| `src/components/menu/ProductCard.tsx` | Hiç kullanılmıyor; ayrıca veri modelinde bulunmayan `image` ve `description` alanlarına referans veriyordu |
| `src/components/menu/ProductCard.module.css` | Yukarıdakinin CSS'i |
| `src/components/layout/Header.tsx` | Hiç kullanılmıyor; mevcut olmayan `/admin/login` route'una link veriyordu |
| `src/components/layout/Header.module.css` | Yukarıdakinin CSS'i |
| `src/components/ui/Button.tsx` | Hiç kullanılmıyor |
| `src/components/ui/Button.module.css` | Yukarıdakinin CSS'i |
| `src/app/page.module.css` | Hiçbir sayfada import edilmiyor |

---

### Dosya Durumu Özeti

| Dosya | Değişiklik |
|-------|-----------|
| `src/lib/types.ts` | **Yeni** — paylaşılan TypeScript tipleri |
| `src/app/page.tsx` | Güncellendi — bug fix, tipler, auto-seed fix |
| `src/app/layout.tsx` | Güncellendi — `next/font/google` entegrasyonu |
| `src/app/globals.css` | Güncellendi — `@import` kaldırıldı |
| `src/app/product/[id]/page.tsx` | Güncellendi — share butonu, `border-3` fix, tipler |
| `src/components/MenuCustomerView.tsx` | Güncellendi — kategori gruplandırma, null-safe arama, tipler |
| `src/components/AdminDashboard.tsx` | Güncellendi — kategori filtresi, `alert()` kaldırıldı, tipler |
| `src/components/AdminLogin.tsx` | Güncellendi — `ViewType` ile tip güvenliği |
| `src/lib/firebase.ts` | Değiştirilmedi |
| `src/lib/constants.ts` | Değiştirilmedi |
| 7 dosya | **Silindi** — dead code temizliği |
