import bcrypt from "bcryptjs";
import mongoose, { type Model } from "mongoose";

import type { IUser, IUserMethods } from "./user.types.js";

const userSchema = new mongoose.Schema<
  IUser,
  Model<IUser, {}, IUserMethods>,
  IUserMethods
>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (error) {
    throw new Error("Failed to hash password", { cause: error });
  }
});

userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser, Model<IUser, {}, IUserMethods>>(
  "User",
  userSchema,
);

export default User;
