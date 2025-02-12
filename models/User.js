import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true, unique: true },
    firstName: { type: String },
    isBlocked: { type: Boolean, default: false },
    subscribed: { type: Boolean, default: false }, // Controls access to /weather
    step: { type: String }, // Tracks user input state
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
