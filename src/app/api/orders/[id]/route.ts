import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  
  try {
    await connectDB();
    const order = await Order.findById(id).populate('items.product');
    
    if (!order) {
      return NextResponse.json(
        { error: 'Adisyon bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Adisyon yüklenirken hata:', error);
    return NextResponse.json(
      { error: 'Adisyon yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  
  try {
    await connectDB();
    const body = await request.json();
    
    const order = await Order.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return NextResponse.json(
        { error: 'Adisyon bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Adisyon güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Adisyon güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 