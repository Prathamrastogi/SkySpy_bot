"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!session) return;

    const checkAdminStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/check`, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });

        const data = await res.json();
        setIsAdmin(res.ok && data.isAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [session]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("#mobile-menu")) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    <nav className="font-darumadrop fixed top-4 left-4 right-4 bg-white z-20 border border-black rounded-lg shadow-lg">
      <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="h-8" />
          <span className="text-2xl font-semibold text-gray-900 hidden md:inline">
            SkySpy
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-900 hover:text-blue-700">
            Home
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-gray-900 hover:text-blue-700">
              Admin Panel
            </Link>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {session ? (
            <button
              onClick={() => signOut()}
              className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
            >
              Login
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden">
          <Link
            href="/"
            className="block py-2 px-4 text-gray-900 hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="block py-2 px-4 text-gray-900 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Admin Panel
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
