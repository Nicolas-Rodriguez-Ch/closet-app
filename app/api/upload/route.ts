import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '@/public/constants/secrets';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64File, {
      folder: 'LookBook',
      resource_type: 'image',
    });

    if (!result || !result.secure_url) {
      return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
    }
    return NextResponse.json(
      { message: 'Upload succesful', pictureURL: result.secure_url },
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
