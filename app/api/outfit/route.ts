import { createOutfit, getAllOutfits } from '@/services/outfitServices';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const outfits = await getAllOutfits();
    if (!outfits.length) {
      return NextResponse.json(
        { message: 'No outfits were found', data: [] },
        { status: 404 }
      );
    }
    return NextResponse.json(outfits, { status: 200 });
  } catch (error) {
    console.error('Error fetching outfits: ', error);
    return NextResponse.json(
      { message: 'Error fetching outfits' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (
      !body.title ||
      !body.topID ||
      !body.bottomID ||
      !body.shoesID ||
      !body.tags
    ) {
      return NextResponse.json(
        {
          message:
            'Missing required fields, please check the information in the body',
        },
        { status: 400 }
      );
    }
    const newOutfit = await createOutfit(body);
    return NextResponse.json(newOutfit, { status: 201 });
  } catch (error) {
    console.error('Error creating outfit: ', error);
    return NextResponse.json(
      { message: 'Failed to create outfit' },
      { status: 500 }
    );
  }
}
