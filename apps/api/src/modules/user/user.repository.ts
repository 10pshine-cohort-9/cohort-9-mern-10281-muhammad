import mongoose from "mongoose";
import User from "./user.model.js";
import { CreateUserInput, UserDocument } from "./user.types.js";

class UserRepository {
  async create(data: CreateUserInput): Promise<UserDocument> {
    return User.create(data);
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return User.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return User.findOne({ email }).exec();
  }

  async findByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<UserDocument | null> {
    return User.findOne({ $or: [{ username }, { email }] }).exec();
  }

  async findByUsernameOrEmailWithPassword(
    usernameOrEmail: string,
  ): Promise<UserDocument | null> {
    return User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    })
      .select("+password")
      .exec();
  }

  async findById(id: mongoose.Types.ObjectId): Promise<UserDocument | null> {
    return User.findById(id);
  }
}

const userRepository = new UserRepository();

export default userRepository;
