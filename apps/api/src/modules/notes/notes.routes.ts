import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import NotesController from "./notes.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import { createNoteSchema, updateNoteSchema } from "./notes.schema.js";
import NotesService from "./notes.service.js";
import NotesRepository from "./notes.repository.js";

const router = Router();

const repository = new NotesRepository();
const service = new NotesService(repository);
const controller = new NotesController(service);

router.use(authenticate);

router.get("/", controller.getAll);
router.post("/", validate(createNoteSchema), controller.create);
router.get("/:slug", controller.get);
router.patch("/:slug", validate(updateNoteSchema), controller.update);
router.delete("/:slug", controller.delete);

export default router;
