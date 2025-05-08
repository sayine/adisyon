'use client';

import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Admin Paneli</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => router.push('/admin/products')}
          className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">Ürün Yönetimi</h2>
          <p className="text-blue-100">Ürünleri ekle, düzenle ve kategorileri yönet</p>
        </button>

        <button
          onClick={() => router.push('/admin/dashboard')}
          className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">Satış Raporları</h2>
          <p className="text-green-100">Aylık satış raporları ve istatistikler</p>
        </button>
      </div>
    </div>
  );
} 