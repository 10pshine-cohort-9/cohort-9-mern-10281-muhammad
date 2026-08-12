import type { UserDocument } from "../modules/user/user.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export {};
