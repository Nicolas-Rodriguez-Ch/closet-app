import connectDB from '@/database/db';
import Apparel from '@/database/models/apparel';
import Outfit from '@/database/models/outfits';

export const getAllOutfits = async () => {
  connectDB();
  const apparelFields = ['topID', 'bottomID', 'shoesID', 'coatID'];

  const populateOptions = apparelFields.map((field) => ({
    path: field,
    model: Apparel,
    foreignField: 'id',
    localField: field,
  }));

  const outfits = Outfit.find({})
    .populate(populateOptions)
    .sort({ updatedAt: -1 });

  return outfits;
};

export const createOutfit = async (body: any) => {
  connectDB();
  const newOutfit = await Outfit.create(body);
  return newOutfit
};
