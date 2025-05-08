import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

type RouteParams = {
  id: string;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: RouteParams }
): Promise<Response> {
  try {
    await connectToDatabase();
    const order = await Order.findById(params.id).populate('items.product');
    
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
  request: NextRequest,
  { params }: { params: RouteParams }
): Promise<Response> {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const order = await Order.findByIdAndUpdate(
      params.id,
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