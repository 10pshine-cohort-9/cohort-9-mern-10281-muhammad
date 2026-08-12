import { HydratedDocument } from "mongoose";

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

export interface IUser {
  username: string;
  email: string;
  password: string;
  refreshToken?: string | null;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;
