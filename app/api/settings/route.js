import connectDB from "../../../lib/mongodb";
import Settings from "../../../models/Settings";

export async function GET() {
  await connectDB();
  const settings = await Settings.findOne({});
  return Response.json(settings);
}

export async function POST(req) {
  await connectDB();
  const { weatherApiKey } = await req.json();
  await Settings.findOneAndUpdate({}, { weatherApiKey }, { upsert: true });
  return Response.json({ message: "API Key updated" });
}
