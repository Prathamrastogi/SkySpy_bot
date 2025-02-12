import mongoose from "mongoose";

const ApiKeySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.ApiKey || mongoose.model("ApiKey", ApiKeySchema);
