import { Schema, model, Types } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    bookings: [
      {
        type: Types.ObjectId,
        ref: "Bookings",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("User", UserSchema);
