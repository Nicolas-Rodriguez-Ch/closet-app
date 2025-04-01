import Apparel from '@/database/models/apparel';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apparels = await Apparel.find({}).sort({ createdAt: -1 });
    if (!apparels.length) {
      return NextResponse.json(
        { message: 'No apparel items were found', data: [] },
        { status: 404 }
      );
    }
    return NextResponse.json(apparels, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching apparel', error);
    return NextResponse.json(
      { message: 'Failed to fetch apparel items' },
      { status: 500 }
    );
  }
}
