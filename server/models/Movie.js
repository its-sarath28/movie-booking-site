import { Schema, model } from "mongoose";

const MovieSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    imageURL: {
      type: String,
    },
    genere: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Movie", MovieSchema);
