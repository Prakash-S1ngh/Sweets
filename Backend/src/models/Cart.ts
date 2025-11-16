import { Schema,model,Types } from "mongoose";

export interface CartItems{
    user:Types.ObjectId
    price:number
  items: Array<{
    sweetId: Types.ObjectId;
    quantity: number;
    price: number;
  }>;
}

const CartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        sweetId: {
          type: Types.ObjectId,
          ref: "Sweet",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

export default model<CartItems>('Cart', CartSchema);