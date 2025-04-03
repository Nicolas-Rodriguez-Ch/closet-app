import {
  deleteOutfitById,
  getOutfitById,
  updateOutfitById,
} from '@/services/outfitServices';
import { NextResponse } from 'next/server';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const outfit = await getOutfitById(id);
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
    const updatedOutfit = await updateOutfitById(id, body);
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
    const deletedOutfit = await deleteOutfitById(id);
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
