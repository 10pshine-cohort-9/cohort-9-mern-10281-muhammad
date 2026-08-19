import mongoose, { Schema, type Model } from "mongoose";

import { type INote } from "./notes.types.js";

const noteSchema = new Schema<INote, Model<INote>>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    slug: {
      type: String,
      required: true,
      maxlength: 255,
    },
    content: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, versionKey: false },
);

noteSchema.index({
  title: "text",
  content: "text",
});

noteSchema.index({ userId: 1, slug: 1 }, { unique: true });

const Note = mongoose.model<INote, Model<INote>>("Note", noteSchema);

export default Note;
