import mongoose from "mongoose";
import slugify from "slugify";

import NotesRepository from "./notes.repository.js";
import {
  CreateNoteInput,
  NoteDocument,
  UpdateNoteInput,
} from "./notes.types.js";
import { NotFoundError } from "../../utils/http-errors.js";
import logger from "../../config/logger.js";

export default class NotesService {
  private repository: NotesRepository;

  constructor() {
    this.repository = new NotesRepository();
  }

  async create(
    userId: mongoose.Types.ObjectId,
    data: CreateNoteInput,
  ): Promise<NoteDocument> {
    try {
      const slug = await this.uniqueSlugByTitle(data.title, userId);

      const note = await this.repository.create(userId, {
        ...data,
        slug,
      });

      logger.info(
        { userId: userId.toString(), noteId: note._id.toString() },
        "Note created successfully",
      );

      return note;
    } catch (error) {
      logger.error(
        { err: error, userId: userId.toString() },
        "Failed to create note",
      );

      throw error;
    }
  }

  async getAll(userId: mongoose.Types.ObjectId): Promise<NoteDocument[]> {
    try {
      const notes = await this.repository.findAllByUser(userId);

      logger.debug(
        { userId: userId.toString(), count: notes.length },
        "Notes retrieved successfully",
      );

      return notes;
    } catch (error) {
      logger.error(
        { err: error, userId: userId.toString() },
        "Failed to retrieve notes",
      );

      throw error;
    }
  }

  async get(
    slug: string,
    userId: mongoose.Types.ObjectId,
  ): Promise<NoteDocument> {
    try {
      const note = await this.repository.findBySlugAndUser(slug, userId);

      if (!note) {
        throw new NotFoundError("Note not found");
      }

      logger.debug(
        { userId: userId.toString(), noteId: note._id.toString() },
        "Note retrieved successfully",
      );

      return note;
    } catch (error) {
      logger.error(
        { err: error, userId: userId.toString(), slug },
        "Failed to retrieve note",
      );

      throw error;
    }
  }

  async update(
    slug: string,
    userId: mongoose.Types.ObjectId,
    data: UpdateNoteInput,
  ) {
    try {
      await this.get(slug, userId);

      const result = await this.repository.updateBySlugAndUser(
        slug,
        userId,
        data,
      );

      logger.info(
        { userId: userId.toString(), slug },
        "Note updated successfully",
      );

      return result;
    } catch (error) {
      logger.error(
        { err: error, userId: userId.toString(), slug },
        "Failed to update note",
      );

      throw error;
    }
  }

  async delete(slug: string, userId: mongoose.Types.ObjectId) {
    try {
      await this.get(slug, userId);

      const result = await this.repository.deleteBySlugAndUser(slug, userId);

      logger.info(
        { userId: userId.toString(), slug },
        "Note deleted successfully",
      );

      return result;
    } catch (error) {
      logger.error(
        { err: error, userId: userId.toString(), slug },
        "Failed to delete note",
      );

      throw error;
    }
  }

  private async uniqueSlugByTitle(
    title: string,
    userId: mongoose.Types.ObjectId,
  ): Promise<string> {
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;
    let counter = 1;

    while (await this.repository.existsBySlugAndUser(slug, userId)) {
      slug = `${baseSlug}-${counter++}`;
    }

    return slug;
  }
}
