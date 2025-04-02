import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IApparel extends Document {
  id: string;
  pictureURL: string;
  title: string;
  description?: string;
  type: 'TOP' | 'BOTTOM' | 'SHOES';
  createdAt: Date;
  updatedAt: Date;
}

const ApparelSchema = new Schema<IApparel>(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      required: true,
      unique: true,
    },
    pictureURL: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: ['TOP', 'BOTTOM', 'SHOES', 'COAT'],
      required: true,
    },
  },
  { timestamps: true }
);

export const Apparel =
  mongoose.models.Apparel || mongoose.model<IApparel>('Apparel', ApparelSchema);

export default Apparel;
