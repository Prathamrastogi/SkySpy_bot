import { Telegraf } from "telegraf";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import fetch from "node-fetch";

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is required");

// ✅ Ensure only one bot instance globally (for Vercel deployments)
if (!global.botInstance) {
  global.botInstance = new Telegraf(BOT_TOKEN);
}
const bot = global.botInstance;

// ✅ Set up bot commands
bot.start(async (ctx) => {
  await connectDB();
  const telegramId = ctx.message.chat.id;
  const firstName = ctx.message.chat.first_name;

  await User.updateOne(
    { telegramId },
    { firstName, blocked: false },
    { upsert: true }
  );

  ctx.reply(
    `Hey there, ${firstName}! 🌟 Welcome! Use /subscribe to get daily weather updates. ☀️🌧️`,
    { parse_mode: "Markdown" }
  );
});

bot.command("subscribe", async (ctx) => {
  await connectDB();
  const telegramId = ctx.message.chat.id;
  const firstName = ctx.message.chat.first_name;
  const user = await User.findOne({ telegramId });

  if (user?.blocked) {
    return ctx.reply("🚫 You’ve been blocked by the admin.");
  }
  if (user?.subscribed) {
    return ctx.reply("✅ You're already subscribed!");
  }

  await User.updateOne(
    { telegramId },
    { firstName, subscribed: true },
    { upsert: true }
  );
  ctx.reply("✅ Subscription successful! Use /weather to get updates. 😊🌤️");
});

bot.command("weather", async (ctx) => {
  await connectDB();
  const telegramId = ctx.message.chat.id;
  const user = await User.findOne({ telegramId });

  if (!user) {
    return ctx.reply("❌ You need to /start the bot first.");
  }
  if (user.blocked) {
    return ctx.reply("🚫 You're blocked by the admin.");
  }
  if (!user.subscribed) {
    return ctx.reply("❌ Subscribe first using /subscribe.");
  }

  await User.updateOne({ telegramId }, { step: "awaiting_city" });
  return ctx.reply("🌍 Please enter the city for weather details.");
});

bot.on("text", async (ctx) => {
  await connectDB();
  const telegramId = ctx.message.chat.id;
  const user = await User.findOne({ telegramId });

  if (!user || user.step !== "awaiting_city") {
    return ctx.reply("⚠️ Invalid input. Use /weather to get updates.");
  }

  const city = ctx.message.text.trim();
  console.log(`🔍 Fetching weather for: ${city}`);

  try {
    const waitMessage = await ctx.reply("⏳ Fetching weather...");

    // 🔥 Fetch the active API key dynamically
    const apiKeyResponse = await fetch(
      "https://sky-spy-bot-git-main-pratham-rastogis-projects.vercel.app/api/settings/active"
    );
    const { WEATHER_API_KEY } = await apiKeyResponse.json();

    if (!WEATHER_API_KEY) {
      return ctx.reply("❌ No active weather API key found. Contact admin.");
    }

    console.log(`🟢 Using API Key: ${WEATHER_API_KEY}`);

    // 🌤 Fetch weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${WEATHER_API_KEY}&units=metric`;

    const response = await fetch(weatherUrl);
    const data = await response.json();

    if (data.cod === 401) {
      return ctx.reply("❌ API key is invalid or expired. Contact admin.");
    }
    if (data.cod !== 200) {
      return ctx.reply(
        `❌ Error: ${
          data.message || "City not found. Try checking the city name again."
        }`
      );
    }

    const weatherInfo = `🌍 *Location:* ${data.name}, ${data.sys.country}\n🌡 *Temp:* ${data.main.temp}°C\n☁️ *Condition:* ${data.weather[0].description}\n💨 *Wind:* ${data.wind.speed} m/s`;

    await User.updateOne({ telegramId }, { step: null });
    await ctx.telegram.deleteMessage(ctx.chat.id, waitMessage.message_id);
    return ctx.reply(weatherInfo, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return ctx.reply("❌ Failed to fetch weather data. Try again later.");
  }
});

bot.on("message", async (ctx) => {
  if (ctx.message?.text?.startsWith("/")) {
    return ctx.reply(
      "⚠️ Invalid command. Use /help to see available commands."
    );
  }
});

// ✅ Webhook handler
export async function POST(req) {
  // ✅ Ensure requests are coming from Telegram (Optional but recommended)
  const TELEGRAM_SECRET_TOKEN = process.env.TELEGRAM_SECRET_TOKEN; // Store a secret token in .env
  const botToken = process.env.BOT_TOKEN;

  if (!botToken) {
    console.error("❌ BOT_TOKEN is missing");
    return new Response("BOT_TOKEN missing", { status: 500 });
  }

  // ✅ Validate Telegram Secret Token (if set)
  if (TELEGRAM_SECRET_TOKEN && req.headers.get("x-telegram-bot-api-secret-token") !== TELEGRAM_SECRET_TOKEN) {
    console.error("❌ Unauthorized Webhook Request");
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("📥 Incoming Webhook Update:", JSON.stringify(body, null, 2));
    await global.botInstance.handleUpdate(body);
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new Response("Error", { status: 500 });
  }
}

