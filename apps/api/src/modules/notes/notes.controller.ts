import { Request, Response } from "express";

import NotesService from "./notes.service.js";
import { sendResponse } from "../../utils/send-response.js";
import { CreateNoteInput, UpdateNoteInput } from "./notes.schema.js";

export default class NotesController {
  private service: NotesService;

  constructor() {
    this.service = new NotesService();
  }

  create = async (
    req: Request<{}, {}, CreateNoteInput>,
    res: Response,
  ): Promise<void> => {
    const userId = req.user!._id;

    const note = await this.service.create(userId, req.body);

    sendResponse(res, 201, note, "Note created successfully");
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!._id;

    const notes = await this.service.getAll(userId);

    sendResponse(res, 200, notes);
  };

  get = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!._id;
    const { slug } = req.params;

    const note = await this.service.get(String(slug), userId);

    sendResponse(res, 200, note);
  };

  update = async (
    req: Request<{ slug: string }, {}, UpdateNoteInput>,
    res: Response,
  ): Promise<void> => {
    const userId = req.user!._id;
    const { slug } = req.params;

    const updated = await this.service.update(String(slug), userId, req.body);

    sendResponse(res, 200, updated, "Note updated successfully");
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!._id;
    const { slug } = req.params;

    await this.service.delete(String(slug), userId);

    sendResponse(res, 200, null, "Note deleted successfully");
  };
}
