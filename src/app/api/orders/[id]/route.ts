import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const order = await Order.findById(params.id).populate('items.product');

    if (!order) {
      return NextResponse.json({ error: 'Adisyon bulunamadı' }, { status: 404 });
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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const order = await Order.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return NextResponse.json({ error: 'Adisyon bulunamadı' }, { status: 404 });
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
