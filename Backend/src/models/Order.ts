import { Schema, model, Types } from "mongoose";

export interface OrderItems {
  user: Types.ObjectId;
  items: {
    sweetId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
}

const OrderSchema = new Schema(
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
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending"
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default model<OrderItems>("Order", OrderSchema);