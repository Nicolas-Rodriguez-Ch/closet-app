import connectDB from '@/database/db';
import Apparel from '@/database/models/apparel';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    connectDB();
    const apparel = await Apparel.findOne({ id });
    if (!apparel) {
      return NextResponse.json(
        { message: `Apparel with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(apparel, { status: 200 });
  } catch (error) {
    console.error(`Error fetching apparel with ID ${id}:`, error);
    return NextResponse.json(
      {
        message: 'Failed to fetch apparel item',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    connectDB();
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
    console.error(`Error updating apparel with ID ${id}:`, error);
    return NextResponse.json(
      { message: 'Failed to update apparel item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    connectDB();
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
    console.error(`Error deleting apparel with ID ${id}:`, error);
    return NextResponse.json(
      { message: 'Failed to delete apparel item' },
      { status: 500 }
    );
  }
}
