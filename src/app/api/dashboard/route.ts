import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();

    // Bu ayın başlangıç ve bitiş tarihlerini hesapla
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Bu ayki toplam satış
    const monthlySales = await Order.aggregate([
      {
        $match: {
          status: 'paid',
          paidAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    // En çok satılan ürünler
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: 'paid',
          paidAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' }
    ]);

    // Günlük satış grafiği için veriler
    const dailySales = await Order.aggregate([
      {
        $match: {
          status: 'paid',
          paidAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
          totalAmount: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Kategori bazlı satışlar
    const categorySales = await Order.aggregate([
      {
        $match: {
          status: 'paid',
          paidAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          totalAmount: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    return NextResponse.json({
      monthlySales: monthlySales[0] || { totalAmount: 0, orderCount: 0 },
      topProducts,
      dailySales,
      categorySales
    });
  } catch (error) {
    console.error('Dashboard verileri yüklenirken hata:', error);
    return NextResponse.json(
      { error: 'Dashboard verileri yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 