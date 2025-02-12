import { Telegraf } from "telegraf";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import fetch from "node-fetch";

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is required");

setInterval(async () => {
  try {
    await fetch("http://localhost:3000/api/bot");
    console.log("🔄 Pinged bot API to keep it active");
  } catch (error) {
    console.error("❌ Bot self-ping failed:", error);
  }
}, 5 * 60 * 1000); // ⏳ Ping every 5 minutes

// ✅ Singleton pattern to prevent multiple bot instances
if (!global.botInstance) {
  global.botInstance = new Telegraf(BOT_TOKEN);
}
const bot = global.botInstance;

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

bot.command("unsubscribe", async (ctx) => {
  await connectDB();
  const telegramId = ctx.message.chat.id;
  const user = await User.findOne({ telegramId });

  if (!user || !user.subscribed) {
    return ctx.reply("❌ You're not subscribed yet.");
  }

  await User.updateOne({ telegramId }, { subscribed: false });
  return ctx.reply("✅ You've unsubscribed successfully.");
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
    const WEATHER_API_KEY = await apiKeyResponse.json();

    if (!WEATHER_API_KEY) {
      return ctx.reply("❌ No active weather API key found. Contact admin.");
    }

    console.log(`🟢 Using API Key: ${WEATHER_API_KEY}`);

    // ⏳ Create a timeout function (AbortController)
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort(); // Abort the request if it takes too long
    }, 10000);

    // 🌤 Fetch weather data with timeout handling
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await fetch(weatherUrl, {
      signal: controller.signal,
    }).catch((err) => {
      if (err.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw err;
    });

    clearTimeout(timeout); // 🛑 Clear timeout if request succeeds

    const data = await response.json();
    console.log("🔍 API Response:", data);

    if (data.cod === 401) {
      return ctx.reply("❌ API key is invalid or expired. Contact admin.");
    }
    if (data.cod !== 200) {
      return ctx.reply(
        `❌ Error: ${
          data.message || "City not found. try checking city again "
        }`
      );
    }

    const weatherInfo = `🌍 *Location:* ${data.name}, ${data.sys.country}\n🌡 *Temp:* ${data.main.temp}°C\n☁️ *Condition:* ${data.weather[0].description}\n💨 *Wind:* ${data.wind.speed} m/s`;

    await User.updateOne({ telegramId }, { step: null });
    await ctx.telegram.deleteMessage(ctx.chat.id, waitMessage.message_id);
    return ctx.reply(weatherInfo, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("❌ Fetch error:", error);

    if (error.message === "Request timed out") {
      return ctx.reply(
        "⚠️ The weather service is taking too long. The API key might be broken. Please contact the admin."
      );
    }

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

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📥 Incoming Webhook Update:", JSON.stringify(body, null, 2));
    await bot.handleUpdate(body);
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new Response("Error", { status: 500 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: "Telegram bot is running" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
