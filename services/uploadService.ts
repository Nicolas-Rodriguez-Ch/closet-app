import { CLOUDINARY_FOLDER } from '@/public/constants/secrets';
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

export const uploadToCloudinary = async (file: File) => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64File, {
      folder: CLOUDINARY_FOLDER,
      resource_type: 'image',
    });
    return { secure_url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    throw new Error(
      'Error uploading to cloudinary: ' + (error as Error).message
    );
  }
};
