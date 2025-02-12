"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const images = ["/screen02.png", "/screen01.png", "/screen03.png"];

setInterval(async () => {
  try {
    await fetch("https://sky-spy-bot-git-main-pratham-rastogis-projects.vercel.app/api/bot");
    console.log("🔄 Pinged bot API to keep it active");
  } catch (error) {
    console.error("❌ Bot self-ping failed:", error);
  }
}, 5 * 60 * 1000); // ⏳ Ping every 5 minutes

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 text-white pt-20">
      {/* Left Content */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 text-center lg:text-left">
        <h1 className="text-3xl lg:text-5xl font-bold mb-3 lg:mb-4">
          Welcome to SkySpy
        </h1>
        <p className="text-md lg:text-lg mb-4 lg:mb-6">
          Your ultimate weather companion.
        </p>
        <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
          <a
            href="/admin"
            className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-gray-100"
          >
            Go to Admin Panel
          </a>
          <a
            href="https://t.me/skyspyupdate_bot"
            target="_blank"
            className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-gray-100"
          >
            Try our Bot
          </a>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="w-full lg:w-1/2 flex justify-center mt-8 lg:mt-0">
        <motion.img
          key={index}
          src={images[index]}
          alt="Weather Preview"
          className="w-60 sm:w-72 md:w-80 lg:w-[300px] h-auto object-contain rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}
