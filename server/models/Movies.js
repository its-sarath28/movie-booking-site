import { Schema, model } from "mongoose";

const MoviesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    firstShow: {
      type: Boolean,
      required: true,
    },
    matineeShow: {
      type: Boolean,
      required: true,
    },
    eveningShow: {
      type: Boolean,
      required: true,
    },
    nightShow: {
      type: Boolean,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Movies", MoviesSchema);
