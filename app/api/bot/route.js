import { Telegraf } from "telegraf";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

const bot = new Telegraf(process.env.BOT_TOKEN);

// Start command
bot.start((ctx) =>
  ctx.reply("Welcome! Use /subscribe to get daily weather updates.")
);

// Subscribe command
bot.command("subscribe", async (ctx) => {
  await connectDB();
  const user = await User.findOne({ telegramId: ctx.message.chat.id });

  if (!user) {
    await User.create({ telegramId: ctx.message.chat.id, isBlocked: false });
  }

  ctx.reply("You have subscribed to daily weather updates.");
});

// Unsubscribe command
bot.command("unsubscribe", async (ctx) => {
  await connectDB();
  await User.deleteOne({ telegramId: ctx.message.chat.id });
  ctx.reply("You have unsubscribed from daily weather updates.");
});

bot.launch();

export async function GET(req) {
  return Response.json({ message: "Telegram bot is running" });
}
