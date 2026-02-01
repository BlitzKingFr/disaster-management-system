import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    image: String,
    password: { type: String, select: false },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
