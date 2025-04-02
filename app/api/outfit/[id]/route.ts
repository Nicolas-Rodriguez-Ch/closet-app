import Apparel from '@/database/models/apparel';
import Outfit from '@/database/models/outfits';
import { NextResponse } from 'next/server';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

const apparelFields = ['topID', 'bottomID', 'shoesID', 'coatID'];

const populateOptions = apparelFields.map((field) => ({
  path: field,
  model: Apparel,
  foreignField: 'id',
  localField: field,
}));

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  console.log(id)
  try {
    const outfit = await Outfit.findOne({ id }).populate(populateOptions);
    if (!outfit) {
      return NextResponse.json(
        { message: `Outfit with ID ${id} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(outfit, { status: 200 });
  } catch (error) {
    console.error(`Outfit with ID ${id} not found`, error);
    return NextResponse.json(
      { message: `Outfit with ID ${id} nor found` },
      { status: 404 }
    );
  }
}
