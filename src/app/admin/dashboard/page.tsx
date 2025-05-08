'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface DashboardData {
  monthlySales: {
    totalAmount: number;
    orderCount: number;
  };
  topProducts: Array<{
    productDetails: {
      name: string;
      price: number;
    };
    totalQuantity: number;
    totalRevenue: number;
  }>;
  dailySales: Array<{
    _id: string;
    totalAmount: number;
    orderCount: number;
  }>;
  categorySales: Array<{
    _id: string;
    totalAmount: number;
    totalQuantity: number;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error('Dashboard verileri yüklenirken bir hata oluştu');
      }
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
      setError(error instanceof Error ? error.message : 'Dashboard verileri yüklenirken bir hata oluştu');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => router.push('/admin/products')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Ürün Yönetimi
        </button>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Bu Ayki Toplam Satış</h2>
          <p className="text-3xl font-bold text-blue-600">
            {data.monthlySales.totalAmount.toLocaleString('tr-TR')} TL
          </p>
          <p className="text-gray-600 mt-2">
            {data.monthlySales.orderCount} Adisyon
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Ortalama Adisyon Tutarı</h2>
          <p className="text-3xl font-bold text-green-600">
            {(data.monthlySales.totalAmount / data.monthlySales.orderCount || 0).toLocaleString('tr-TR')} TL
          </p>
        </div>
      </div>

      {/* Günlük Satış Grafiği */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Günlük Satışlar</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" name="Satış Tutarı" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* En Çok Satılan Ürünler */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">En Çok Satılan Ürünler</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="productDetails.name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalQuantity" fill="#8884d8" name="Satış Adedi" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kategori Bazlı Satışlar */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Kategori Bazlı Satışlar</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categorySales}
                  dataKey="totalAmount"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 