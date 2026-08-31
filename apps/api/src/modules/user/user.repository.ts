import mongoose from "mongoose";
import User from "./user.model.js";
import { CreateUserInput, UserDocument } from "./user.types.js";

export default class UserRepository {
  create = async (data: CreateUserInput): Promise<UserDocument> => {
    return User.create(data);
  };

  findByUsername = async (username: string): Promise<UserDocument | null> => {
    return User.findOne({ username }).exec();
  };

  findByEmail = async (email: string): Promise<UserDocument | null> => {
    return User.findOne({ email }).exec();
  };

  findByUsernameOrEmail = async (
    username: string,
    email: string,
  ): Promise<UserDocument | null> => {
    return User.findOne({ $or: [{ username }, { email }] }).exec();
  };

  findByUsernameOrEmailWithPassword = async (
    usernameOrEmail: string,
  ): Promise<UserDocument | null> => {
    return User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    })
      .select("+password")
      .exec();
  };

  findById = async (
    id: mongoose.Types.ObjectId,
  ): Promise<UserDocument | null> => {
    return User.findById(id).exec();
  };
}
