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

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updatedOutfit = await Outfit.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!updatedOutfit) {
      return NextResponse.json(
        { message: `Outfit with ID ${id} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedOutfit, { status: 200 });
  } catch (error) {
    console.error(`Error updating outfit with ID ${id}`, error);
    return NextResponse.json(
      { message: `Failed to update outfit` },
      { status: 404 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const deletedOutfit = await Outfit.findOneAndDelete({ id });
    if (!deletedOutfit) {
      return NextResponse.json(
        { message: `Outfit with ID ${id} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: `Outfit with ID ${id} deleted succesfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting outfit with ID ${id}`, error);
    return NextResponse.json(
      {
        message: 'Failed to delete outfit',
      },
      { status: 500 }
    );
  }
}
