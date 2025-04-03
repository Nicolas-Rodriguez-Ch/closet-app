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

export const findApparelById = async (id: string) => {
  connectDB();
  const apparel = await Apparel.findOne({ id });
  return apparel;
};

export const updateApparelById = async (id: string, body: any) => {
  connectDB();
  const updatedApparel = await Apparel.findOneAndUpdate(
    { id },
    { $set: body },
    { new: true, runValidators: true }
  );
  return updatedApparel;
};

export const deleteApparelById = async (id: string) => {
  connectDB();
  const deletedApparel = await Apparel.findOneAndDelete({ id });
  return deletedApparel;
};
