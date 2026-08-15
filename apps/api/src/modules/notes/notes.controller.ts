import { Request, Response } from "express";
import mongoose from "mongoose";

import NotesService from "./notes.service.js";
import { sendResponse } from "../../utils/send-response.js";

export default class NotesController {
  private service: NotesService;

  constructor() {
    this.service = new NotesService();
  }

  create = async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const note = await this.service.create(userId, req.body);

    return sendResponse(res, 201, note, "Note created successfully");
  };

  getAll = async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const notes = await this.service.getAll(userId);

    return sendResponse(res, 200, notes);
  };

  get = async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { slug } = req.params;

    const note = await this.service.get(String(slug), userId);

    return sendResponse(res, 200, note);
  };

  update = async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { slug } = req.params;

    const updated = await this.service.update(String(slug), userId, req.body);

    return sendResponse(res, 200, updated, "Note updated successfully");
  };

  delete = async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { slug } = req.params;

    await this.service.delete(String(slug), userId);

    return sendResponse(res, 200, null, "Note deleted successfully");
  };
}
