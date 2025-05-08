import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Ürünler yüklenirken hata:', error);
    return NextResponse.json(
      { error: 'Ürünler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Gelen veriyi kontrol et
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Ürün adı, fiyat ve kategori zorunludur' },
        { status: 400 }
      );
    }

    // Fiyatı sayıya çevir
    const price = parseFloat(body.price);
    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: 'Geçersiz fiyat değeri' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name: body.name,
      price: price,
      category: body.category,
      isAvailable: true
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Ürün eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Ürün eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 