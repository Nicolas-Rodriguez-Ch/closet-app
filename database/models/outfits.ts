import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IOutfit extends Document {
  id: string;
  title: string;
  description?: string;
  pictureURL?: string;
  topID: string;
  bottomID: string;
  shoesID: string;
  coatID?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const OutfitSchema = new Schema<IOutfit>(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    topID: {
      type: String,
      ref: 'Apparel',
      required: true,
    },
    bottomID: {
      type: String,
      ref: 'Apparel',
      required: true,
    },
    shoesID: {
      type: String,
      ref: 'Apparel',
      required: true,
    },
    coatID: {
      type: String,
      ref: 'Apparel',
      required: false,
    },
    pictureURL: {
      type: String,
      require: false,
    },
    tags: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Outfit =
  mongoose.models.Outfit || mongoose.model<IOutfit>('Outfit', OutfitSchema);

export default Outfit;
