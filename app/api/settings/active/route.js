import connectDB from "@/lib/mongodb";
import ApiKey from "@/models/ApiKeys";

export async function GET() {
  await connectDB();

  // Fetch the currently active API key
  const activeKey = await ApiKey.findOne({ isActive: true });

  return Response.json(activeKey ? activeKey.key : null);
}
