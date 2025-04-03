import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/services/uploadService';

export async function POST(request: NextRequest) {
  try {
    const fromData = await request.formData();
    const file = fromData.get('file') as File | null;
    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    const result = await uploadToCloudinary(file);

    if (!result || !result.secure_url) {
      return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
    }
    return NextResponse.json(
      { message: 'Upload succesful', data: { ...result } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading file to Cloudinary', error);
    return NextResponse.json(
      { message: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
