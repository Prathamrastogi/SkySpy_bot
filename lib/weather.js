import axios from "axios";
import cron from "node-cron";
import connectDB from "./mongodb";
import User from "../models/User";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather`;

async function getWeather(city) {
  try {
    const response = await axios.get(
      `${WEATHER_API_URL}?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    return `🌦 Weather in ${city}: ${response.data.weather[0].description}, 🌡 ${response.data.main.temp}°C`;
  } catch (error) {
    return "Error fetching weather data.";
  }
}

export default getWeather;
