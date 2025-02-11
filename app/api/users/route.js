import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function GET() {
  await connectDB();
  const users = await User.find({});
  return Response.json(users);
}

export async function DELETE(req) {
  await connectDB();
  const { telegramId } = await req.json();
  await User.findOneAndDelete({ telegramId });
  return Response.json({ message: "User deleted" });
}

export async function PATCH(req) {
  await connectDB();
  const { telegramId, isBlocked } = await req.json();
  await User.findOneAndUpdate({ telegramId }, { isBlocked });
  return Response.json({ message: "User updated" });
}
