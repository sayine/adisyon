'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
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
  paymentMethod: 'cash' | 'creditCard' | null;
  createdAt: string;
}

export default function OrderPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'creditCard'>('cash');
  const router = useRouter();

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (!response.ok) throw new Error('Sipariş bulunamadı');
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Sipariş yüklenirken hata:', error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    setCategories(uniqueCategories);
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, [params.id]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ürünler yüklenirken hata oluştu:', error);
      setProducts([]);
    }
  };

  const addToOrder = async (product: Product) => {
    if (!order) return;

    const existingItem = order.items.find(item => item.product._id === product._id);
    const updatedItems = existingItem
      ? order.items.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1, price: item.product.price * (item.quantity + 1) }
            : item
        )
      : [...order.items, { product, quantity: 1, price: product.price }];

    const totalAmount = updatedItems.reduce((sum, item) => sum + item.price, 0);

    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: updatedItems, totalAmount }),
      });

      if (response.ok) {
        fetchOrder();
      }
    } catch (error) {
      console.error('Adisyon güncellenirken hata oluştu:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!order || quantity < 1) return;

    const updatedItems = order.items.map(item =>
      item.product._id === productId
        ? { ...item, quantity, price: item.product.price * quantity }
        : item
    );

    const totalAmount = updatedItems.reduce((sum, item) => sum + item.price, 0);

    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: updatedItems, totalAmount }),
      });

      if (response.ok) {
        fetchOrder();
      }
    } catch (error) {
      console.error('Adisyon güncellenirken hata oluştu:', error);
    }
  };

  const removeFromOrder = async (productId: string) => {
    if (!order) return;

    const updatedItems = order.items.filter(item => item.product._id !== productId);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.price, 0);

    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: updatedItems, totalAmount }),
      });

      if (response.ok) {
        fetchOrder();
      }
    } catch (error) {
      console.error('Adisyon güncellenirken hata oluştu:', error);
    }
  };

  const handlePayment = async () => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'paid',
          paymentMethod,
          paidAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Ödeme işlemi sırasında hata oluştu:', error);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  if (!order) {
    return <div className="container mx-auto px-4 py-8">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Adisyon #{order.orderNumber}</h1>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Geri Dön
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ürün Listesi */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Ürünler</h2>
          
          <div className="mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product._id}
                onClick={() => addToOrder(product)}
                className="p-4 border rounded hover:bg-gray-50 text-left"
              >
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-gray-600">{product.price} TL</p>
              </button>
            ))}
          </div>
        </div>

        {/* Adisyon Detayı */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Adisyon Detayı</h2>
          
          {order.items.length === 0 ? (
            <p className="text-gray-500">Henüz ürün seçilmedi</p>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {order.items.map(item => (
                  <div key={item.product._id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-gray-600">{item.price} TL</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromOrder(item.product._id)}
                        className="ml-2 text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Toplam:</span>
                  <span className="font-semibold">{order.totalAmount} TL</span>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödeme Yöntemi
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                        className="mr-2"
                      />
                      Nakit
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="creditCard"
                        checked={paymentMethod === 'creditCard'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'creditCard')}
                        className="mr-2"
                      />
                      Kredi Kartı
                    </label>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                  Ödendi
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 