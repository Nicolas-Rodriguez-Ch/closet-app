import connectDB from '@/database/db';
import Apparel from '@/database/models/apparel';

export const getAllApparel = async () => {
  connectDB();
  const apparels = await Apparel.find({}).sort({ updatedAt: -1 });
  return apparels;
};

export const createNewApparel = async (body: any) => {
  connectDB();
  const newApparel = await Apparel.create(body);
  return newApparel;
};
