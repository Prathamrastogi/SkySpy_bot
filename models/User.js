import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true, unique: true },
    isBlocked: { type: Boolean, default: false },
    subscribed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
