import { Schema, model, Types } from 'mongoose';

export interface ISweet {
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  userId: Types.ObjectId;
}

const SweetSchema = new Schema<ISweet>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  imageUrl: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default model<ISweet>('Sweet', SweetSchema);