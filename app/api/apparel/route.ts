import connectDB from '@/database/db';
import Apparel from '@/database/models/apparel';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    connectDB();
    const apparels = await Apparel.find({}).sort({ updatedAt: -1 });
    if (!apparels.length) {
      return NextResponse.json(
        { message: 'No apparel items were found', data: [] },
        { status: 404 }
      );
    }
    return NextResponse.json(apparels, { status: 200 });
  } catch (error) {
    console.error('Error fetching apparel', error);
    return NextResponse.json(
      { message: 'Failed to fetch apparel items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    connectDB();
    const body = await request.json();

    if (!body.title || !body.pictureURL || !body.type) {
      return NextResponse.json(
        {
          message:
            'Missing required fields: title, pictureURL, and type are required',
        },
        { status: 400 }
      );
    }

    if (!['TOP', 'BOTTOM', 'SHOES', 'COAT'].includes(body.type)) {
      return NextResponse.json(
        { message: 'Invalid apparel type. Must be TOP, BOTTOM, SHOES or COAT' },
        { status: 400 }
      );
    }

    const newApparel = await Apparel.create(body);
    return NextResponse.json(newApparel, { status: 201 });
  } catch (error) {
    console.error('Error creating apparel item: ', error);
    return NextResponse.json(
      { message: 'Failed to create Apparel item' },
      { status: 500 }
    );
  }
}
