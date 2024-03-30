import { Schema, model, Types } from "mongoose";

const BookingSchema = new Schema(
  {
    movie: {
      type: Types.ObjectId,
      ref: "Movies",
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default model("Booking", BookingSchema);
