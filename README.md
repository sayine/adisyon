# Adisyon Yönetim Sistemi

Bu proje, küçük kafeler için geliştirilmiş bir adisyon (sipariş) yönetim sistemidir. Next.js, MongoDB, Tailwind CSS ve TypeScript kullanılarak geliştirilmiştir.

## Özellikler

- 📱 Mobil uyumlu arayüz
- 🛍️ Ürün ve kategori yönetimi
- 📊 Satış raporları ve istatistikler
- 💳 Çoklu ödeme yöntemi desteği
- 🔄 Gerçek zamanlı adisyon takibi

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/kullaniciadi/adisyon.git
cd adisyon
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını oluşturun:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Kullanım

- Ana sayfa: Açık adisyonları görüntüleme ve yeni adisyon oluşturma
- Admin Paneli: Ürün yönetimi ve satış raporları
- Adisyon Detay: Ürün ekleme, miktar güncelleme ve ödeme alma

## Teknolojiler

- Next.js 14
- MongoDB
- Mongoose
- Tailwind CSS
- TypeScript
- Recharts (Grafikler için)

## Lisans

MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
