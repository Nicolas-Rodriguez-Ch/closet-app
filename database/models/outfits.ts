import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IOutfit extends Document {
  id: string;
  title: string;
  description?: string;
  topID: mongoose.Types.ObjectId;
  bottomID: mongoose.Types.ObjectId;
  shoesID: mongoose.Types.ObjectId;
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
      type: Schema.Types.ObjectId,
      ref: 'Apparel',
      required: true,
    },
    bottomID: {
      type: Schema.Types.ObjectId,
      ref: 'Apparel',
      required: true,
    },
    shoesID: {
      type: Schema.Types.ObjectId,
      ref: 'Apparel',
      required: true,
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
