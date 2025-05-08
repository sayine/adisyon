import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'open';

    const orders = await Order.find({ status })
      .populate('items.product')
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Siparişler yüklenirken hata:', error);
    return NextResponse.json(
      { error: 'Siparişler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    await connectDB();

    // Son adisyon numarasını bul
    const lastOrder = await Order.findOne({}, {}, { sort: { 'orderNumber': -1 } });
    const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

    // Yeni sipariş oluştur
    const order = await Order.create({
      orderNumber,
      items: [],
      status: 'open',
      totalAmount: 0
    });

    // Populate ile ürün detaylarını getir
    const populatedOrder = await Order.findById(order._id).populate('items.product');

    return NextResponse.json(populatedOrder, { status: 201 });
  } catch (error) {
    console.error('Sipariş oluşturulurken hata:', error);
    return NextResponse.json(
      { error: 'Sipariş oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 