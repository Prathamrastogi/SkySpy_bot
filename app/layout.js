"use client";
import { SessionProvider } from "next-auth/react";
import Navbar from "./components/header";
import Footer from "./components/footer";
import "./globals.css"; // Ensure styles are imported
import { Darumadrop_One } from "next/font/google";

const darumadrop = Darumadrop_One({
  weight: "400", // Ensure it's the correct weight
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <body
          className={`${darumadrop.className} flex flex-col min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 text-white`}
        >
          <Navbar />
          <main className="flex-grow container mx-auto p-6">{children}</main>
          <Footer />
        </body>
      </html>
    </SessionProvider>
  );
}
