import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// GET all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a user
export async function DELETE(req) {
  try {
    await connectDB();
    const { telegramId } = await req.json();
    await User.findOneAndDelete({ telegramId });
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH (Update user block status)
export async function PATCH(req) {
  try {
    await connectDB();
    const { telegramId, isBlocked } = await req.json();
    await User.findOneAndUpdate({ telegramId }, { isBlocked });
    return NextResponse.json({ message: "User updated" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
