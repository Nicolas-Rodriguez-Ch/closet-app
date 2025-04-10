import { createNewApparel, getAllApparel } from '@/services/apparelServices';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apparels = await getAllApparel();
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

    const newApparel = await createNewApparel(body);
    return NextResponse.json(newApparel, { status: 201 });
  } catch (error) {
    console.error('Error creating apparel item: ', error);
    return NextResponse.json(
      { message: 'Failed to create Apparel item' },
      { status: 500 }
    );
  }
}
