"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">
          Bot Admin
        </Link>
        <div className="space-x-4">
          <Link href="/">Home</Link>
          <Link href="/admin">Admin Panel</Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
