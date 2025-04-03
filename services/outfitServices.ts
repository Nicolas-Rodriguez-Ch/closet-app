import connectDB from '@/database/db';
import Apparel from '@/database/models/apparel';
import Outfit from '@/database/models/outfits';

const apparelFields = ['topID', 'bottomID', 'shoesID', 'coatID'];

const populateOptions = apparelFields.map((field) => ({
  path: field,
  model: Apparel,
  foreignField: 'id',
  localField: field,
}));

export const getAllOutfits = async () => {
  connectDB();
  const outfits = Outfit.find({})
    .populate(populateOptions)
    .sort({ updatedAt: -1 });

  return outfits;
};

export const createOutfit = async (body: any) => {
  connectDB();
  const newOutfit = await Outfit.create(body);
  return newOutfit;
};

export const getOutfitById = async (id: string) => {
  connectDB();
  const outfit = await Outfit.findOne({ id }).populate(populateOptions);
  return outfit;
};

export const updateOutfitById = async (id: string, body: any) => {
  connectDB();
  const updatedOutfit = await Outfit.findOneAndUpdate(
    { id },
    { $set: body },
    { new: true, runValidators: true }
  );
  return updatedOutfit;
};

export const deleteOutfitById = async (id: string) => {
  connectDB();
  const deletedOutfit = await Outfit.findOneAndDelete({ id });
  return deletedOutfit;
};
