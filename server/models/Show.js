import { Schema, Types, model } from "mongoose";

const ShowSchema = new Schema(
  {
    movie: {
      type: Types.ObjectId,
      ref: "Movie",
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

export default model("Show", ShowSchema);
