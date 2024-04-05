import { Schema, model, Types } from "mongoose";

const BookingSchema = new Schema(
  {
    movie: {
      type: Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    numOfTickets: {
      type: String,
      required: true,
    },
    showTime: {
      type: String,
      required: true,
    },
    showDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Booking", BookingSchema);
