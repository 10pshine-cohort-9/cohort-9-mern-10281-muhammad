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
  },
  { timestamps: true, versionKey: false },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
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
