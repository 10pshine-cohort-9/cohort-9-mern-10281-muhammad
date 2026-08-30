import mongoose from "mongoose";
import slugify from "slugify";

import NotesRepository from "./notes.repository.js";
import {
  CreateNoteInput,
  NoteDocument,
  UpdateNoteInput,
} from "./notes.types.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../utils/http-errors.js";
import logger from "../../config/logger.js";
import { MongoDuplicateKeyError } from "../../types/mongo-error.types.js";

export default class NotesService {
  constructor(private repository: NotesRepository) {}

  create = async (
    userId: mongoose.Types.ObjectId,
    data: CreateNoteInput,
  ): Promise<NoteDocument> => {
    const baseSlug = slugify(data.title, {
      lower: true,
      strict: true,
      trim: true,
    });

    if (!baseSlug) {
      throw new BadRequestError("Invalid title");
    }

    let slug = baseSlug;

    const MAX_RETRIES = 3;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const note = await this.repository.create(userId, slug, data);

        logger.info(
          { userId: userId.toString(), slug },
          "Note created successfully",
        );

        return note;
      } catch (err) {
        if (this.isDuplicateSlugError(err)) {
          slug = `${baseSlug}-${attempt + 1}`;
          continue;
        }
        throw err;
      }
    }

    logger.error("Failed to create the note");
    throw new ConflictError(
      "Failed to generate a unique slug after multiple attempts",
    );
  };

  getAll = async (
    userId: mongoose.Types.ObjectId,
    search?: string,
  ): Promise<NoteDocument[]> => {
    try {
      const notes = await this.repository.findAllByUser(userId, search);

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
  };

  get = async (
    slug: string,
    userId: mongoose.Types.ObjectId,
  ): Promise<NoteDocument> => {
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
  };

  update = async (
    slug: string,
    userId: mongoose.Types.ObjectId,
    data: UpdateNoteInput,
  ): Promise<NoteDocument> => {
    try {
      const result = await this.repository.updateBySlugAndUser(
        slug,
        userId,
        data,
      );

      if (!result) {
        throw new NotFoundError("Note not found");
      }

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
  };

  delete = async (
    slug: string,
    userId: mongoose.Types.ObjectId,
  ): Promise<NoteDocument> => {
    try {
      const result = await this.repository.deleteBySlugAndUser(slug, userId);

      if (!result) {
        throw new NotFoundError("Note not found");
      }

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
  };

  private isDuplicateSlugError = (
    err: unknown,
  ): err is MongoDuplicateKeyError => {
    return (
      typeof err === "object" &&
      err !== null &&
      (err as any).code === 11000 &&
      (err as any).keyPattern?.slug !== undefined
    );
  };
}
