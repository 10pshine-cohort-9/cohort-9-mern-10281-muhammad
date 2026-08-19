import mongoose from "mongoose";
import Note from "./notes.model.js";
import {
  CreateNoteInput,
  NoteDocument,
  UpdateNoteInput,
} from "./notes.types.js";

export default class NotesRepository {
  async create(
    userId: mongoose.Types.ObjectId,
    slug: string,
    data: CreateNoteInput,
  ): Promise<NoteDocument> {
    return Note.create({ userId, slug, ...data });
  }

  async findAllByUser(
    userId: mongoose.Types.ObjectId,
  ): Promise<NoteDocument[]> {
    return Note.find({ userId });
  }

  async findByIdAndUser(
    id: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ): Promise<NoteDocument | null> {
    return Note.findOne({ _id: id, userId });
  }

  async findBySlugAndUser(
    slug: string,
    userId: mongoose.Types.ObjectId,
  ): Promise<NoteDocument | null> {
    return Note.findOne({ slug, userId });
  }

  async updateBySlugAndUser(
    slug: string,
    userId: mongoose.Types.ObjectId,
    data: UpdateNoteInput,
  ) {
    return Note.findOneAndUpdate({ slug, userId }, data, { returnDocument: "after" });
  }

  async deleteBySlugAndUser(slug: string, userId: mongoose.Types.ObjectId) {
    return Note.findOneAndDelete({ slug, userId });
  }
}
