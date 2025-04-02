import Apparel from '@/database/models/apparel';
import Outfit from '@/database/models/outfits';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apparelFields = ['topID', 'bottomID', 'shoesID', 'coatID'];

    const populateOptions = apparelFields.map((field) => ({
      path: field,
      model: Apparel,
      foreignField: 'id',
      localField: field,
    }));

    const outfits = await Outfit.find({})
      .populate(populateOptions)
      .sort({ updatedAt: -1 });

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
    const newOutfit = await Outfit.create(body);
    return NextResponse.json(newOutfit, { status: 201 });
  } catch (error) {
    console.error('Error creating outfit: ', error);
    return NextResponse.json(
      { message: 'Failed to create outfit' },
      { status: 500 }
    );
  }
}
