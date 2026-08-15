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
    data: CreateNoteInput,
  ): Promise<NoteDocument> {
    return Note.create({ userId, ...data });
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

  async existsBySlugAndUser(
    slug: string,
    userId: mongoose.Types.ObjectId,
  ): Promise<boolean> {
    return (await Note.exists({ slug, userId })) !== null;
  }

  async updateBySlugAndUser(
    slug: string,
    userId: mongoose.Types.ObjectId,
    data: UpdateNoteInput,
  ) {
    return Note.updateOne({ slug, userId }, data);
  }

  async deleteBySlugAndUser(slug: string, userId: mongoose.Types.ObjectId) {
    return Note.deleteOne({ slug, userId });
  }
}
