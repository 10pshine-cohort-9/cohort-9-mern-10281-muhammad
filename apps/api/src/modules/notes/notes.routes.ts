import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import NotesController from "./notes.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import { createNoteSchema, updateNoteSchema } from "./notes.schema.js";

const router = Router();

const controller = new NotesController();

router.use(authenticate);

router.get("/", controller.getAll);
router.post("/", validate(createNoteSchema), controller.create);
router.get("/:slug", controller.get);
router.patch("/:slug", validate(updateNoteSchema), controller.update);
router.delete("/:slug", controller.delete);

export default router;
