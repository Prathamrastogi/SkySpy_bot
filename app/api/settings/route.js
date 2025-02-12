import connectDB from "../../../lib/mongodb";
import ApiKey from "../../../models/ApiKeys";

export async function GET() {
  await connectDB();
  const apiKeys = await ApiKey.find({});
  return Response.json(apiKeys);
}

export async function POST(req) {
  await connectDB();
  const { key } = await req.json();

  if (!key) {
    return Response.json({ error: "API key is required" }, { status: 400 });
  }

  const existingKey = await ApiKey.findOne({ key });
  if (existingKey) {
    return Response.json({ error: "API key already exists" }, { status: 400 });
  }

  const newKey = new ApiKey({ key });
  await newKey.save();

  return Response.json({ message: "API key added successfully" });
}

export async function PATCH(req) {
  await connectDB();
  const { key, isActive } = await req.json();

  if (isActive) {
    // Deactivate all other API keys
    await ApiKey.updateMany({}, { isActive: false });
  }

  // Activate the selected API key
  const updatedKey = await ApiKey.findOneAndUpdate(
    { key },
    { isActive },
    { new: true }
  );

  if (!updatedKey) {
    return Response.json({ error: "API key not found" }, { status: 404 });
  }

  return Response.json({ message: "API key updated", updatedKey });
}

export async function DELETE(req) {
  await connectDB();
  const { key } = await req.json();

  const deletedKey = await ApiKey.findOneAndDelete({ key });

  if (!deletedKey) {
    return Response.json({ error: "API key not found" }, { status: 404 });
  }

  return Response.json({ message: "API key deleted" });
}
