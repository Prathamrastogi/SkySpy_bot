import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.model';
import { ApiKeysService } from '../apikeys/apikeys.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly apiKeyService: ApiKeysService
  ) {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    if (!BOT_TOKEN) throw new Error('❌ BOT_TOKEN is missing');

    this.bot = new Telegraf(BOT_TOKEN);
  }

  getBot(): Telegraf {
    return this.bot;
  }

  async onModuleInit() {
    console.log('🤖 Bot is starting...');

    this.bot.start(async (ctx) => {
      const chat = ctx.message.chat;
      const firstName = (chat.type === 'private' && 'first_name' in chat) ? chat.first_name : 'Unknown';

      await this.userModel.updateOne(
        { telegramId: chat.id },
        { firstName, isBlocked: false },
        { upsert: true }
      );

      ctx.reply(
        `✨ *Hello, ${firstName}!* ✨\n\n`
        + `I'm *SkySpy* 🛰️, your personal weather assistant! 🌤️\n`
        + `📌 *Commands:*\n`
        + `▶️ */subscribe* – Get daily weather updates.\n`
        + `▶️ */weather* – Check current weather.\n`
        + `▶️ */unsubscribe* – Stop receiving updates.\n\n`
        + `💡 Type */weather* to start! 🌍`,
        { parse_mode: 'Markdown' }
      );
    });

    this.bot.command('subscribe', async (ctx) => {
      const telegramId = ctx.message.chat.id;
      const user = await this.userModel.findOne({ telegramId });

      if (user?.isBlocked) {
        return ctx.reply('🚫 You’ve been blocked by the admin.');
      }
      if (user?.subscribed) {
        return ctx.reply('✅ You are already subscribed!');
      }

      await this.userModel.updateOne(
        { telegramId },
        { subscribed: true },
        { upsert: true }
      );
      ctx.reply('✅ Subscription successful! Use /weather to get updates. 😊🌤️');
    });

    this.bot.command('unsubscribe', async (ctx) => {
      const telegramId = ctx.message.chat.id;
      const user = await this.userModel.findOne({ telegramId });

      if (!user || !user.subscribed) {
        return ctx.reply("❌ You're not subscribed yet.");
      }

      await this.userModel.updateOne({ telegramId }, { subscribed: false });
      return ctx.reply("✅ You've unsubscribed successfully.");
    });

    this.bot.command('weather', async (ctx) => {
      const telegramId = ctx.message.chat.id;
      const user = await this.userModel.findOne({ telegramId });

      if (!user) {
        return ctx.reply('❌ You need to /start the bot first.');
      }
      if (user.isBlocked) {
        return ctx.reply('🚫 You are blocked by the admin.');
      }
      if (!user.subscribed) {
        return ctx.reply('❌ Subscribe first using /subscribe.');
      }

      await this.userModel.updateOne({ telegramId }, { step: 'awaiting_city' });
      return ctx.reply('🌍 Please enter the city for weather details.');
    });

    // 🌍 Handling city input for weather
    this.bot.on('text', async (ctx) => {
      const telegramId = ctx.message.chat.id;
      const user = await this.userModel.findOne({ telegramId });

      if (!user) {
        return ctx.reply('❌ You need to /start the bot first.');
      }

      // ✅ Only process text if the user is in 'awaiting_city' step
      if (user.step === 'awaiting_city') {
        const city = ctx.message.text.trim();
        console.log(`🔍 Fetching weather for: ${city}`);

        try {
          const waitMessage = await ctx.reply('⏳ Fetching weather...');

          const WEATHER_API_KEY = await this.apiKeyService.getActiveKey();
          if (!WEATHER_API_KEY) {
            return ctx.reply('❌ API key is invalid or missing. Contact admin.');
          }

          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;
          const response = await fetch(weatherUrl);
          const data = await response.json();

          if (data.cod === 401) {
            return ctx.reply('❌ API key is invalid. Contact admin.');
          }
          if (data.cod === 404) {
            return ctx.reply('❌ City not found. Please check the spelling and try again.');
          }
          if (data.cod !== 200) {
            return ctx.reply(`❌ Error: ${data.message || 'Unknown error.'}`);
          }

          const weatherInfo = `🌍 *Location:* ${data.name}, ${data.sys.country}\n🌡 *Temp:* ${data.main.temp}°C\n☁️ *Condition:* ${data.weather[0].description}\n💨 *Wind:* ${data.wind.speed} m/s`;

          await this.userModel.updateOne({ telegramId }, { step: null });
          await ctx.telegram.deleteMessage(ctx.chat.id, waitMessage.message_id);
          return ctx.reply(weatherInfo, { parse_mode: 'Markdown' });
        } catch (error) {
          console.error('❌ Fetch error:', error);
          return ctx.reply('❌ Failed to fetch weather data. Try again later.');
        }
      }

      // ❌ If user is NOT in 'awaiting_city' step, show invalid command message
      return ctx.reply('⚠️ Invalid input. Use /weather to start.');
    });

    // ❌ Handling invalid commands
    this.bot.on('message', async (ctx) => {
      if ('text' in ctx.message && ctx.message.text.startsWith('/')) {
        return ctx.reply("⚠️ Invalid command. Use /start to see available commands.");
      }
    });

    this.bot.launch();
  }
}
