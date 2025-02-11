import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    weatherApiKey: { type: String, required: true },
    botStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
