import Apparel from '@/database/models/apparel';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const apparel = await Apparel.findOne({ id });

    if (!apparel) {
      return NextResponse.json(
        { message: `Apparel with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(apparel, { status: 200 });
  } catch (error) {
    console.error(`Error fetching apparel with ID ${params.id}:`, error);
    return NextResponse.json(
      {
        message: 'Failed to fetch apparel item',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedApparel = await Apparel.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedApparel) {
      return NextResponse.json(
        { message: `Apparel with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedApparel, { status: 200 });
  } catch (error) {
    console.error(`Error updating apparel with ID ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Failed to update apparel item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const deletedApparel = await Apparel.findOneAndDelete({ id });

    if (!deletedApparel) {
      return NextResponse.json(
        { message: `Apparel with ID ${id} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: `Apparel with ID ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting apparel with ID ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Failed to delete apparel item' },
      { status: 500 }
    );
  }
}
