'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'open' | 'paid' | 'cancelled';
  createdAt: string;
}

export default function Home() {
  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchOpenOrders();
  }, []);

  const fetchOpenOrders = async () => {
    try {
      const response = await fetch('/api/orders?status=open');
      if (!response.ok) {
        throw new Error('Adisyonlar yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setOpenOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Adisyonlar yüklenirken hata:', error);
      setError(error instanceof Error ? error.message : 'Adisyonlar yüklenirken bir hata oluştu');
      setOpenOrders([]);
    }
  };

  const createNewOrder = async () => {
    try {
      setError(null);
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Yeni adisyon oluşturulurken bir hata oluştu');
      }

      const newOrder = await response.json();
      router.push(`/orders/${newOrder._id}`);
    } catch (error) {
      console.error('Yeni adisyon oluşturulurken hata:', error);
      setError(error instanceof Error ? error.message : 'Yeni adisyon oluşturulurken bir hata oluştu');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/admin"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Admin Paneli
        </Link>
        
        <div className="relative w-48 h-16">
          <Image
            src="/assets/ara.jpg"
            alt="ARA COFFEE | DESIGN"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        <button
          onClick={createNewOrder}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Yeni Adisyon
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {openOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Adisyon #{order.orderNumber}</h3>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span>{item.product.name}</span>
                  <span>{item.quantity} x {item.product.price} TL</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-semibold">
                <span>Toplam</span>
                <span>{order.totalAmount} TL</span>
              </div>
            </div>
            <button
              onClick={() => router.push(`/orders/${order._id}`)}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Adisyonu Düzenle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
