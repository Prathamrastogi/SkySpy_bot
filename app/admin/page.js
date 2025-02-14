"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  // Remove isAdmin state, as we want all logged-in users to have admin access
  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    setLoading(false); // No need to check admin status, automatically treat as admin
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-sm sm:text-base text-white">⏳ Checking authentication...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-sm sm:text-base">You must sign in to access the admin panel.</p>
        <button
          onClick={() => signIn("google")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded text-sm sm:text-base"
        >
          Login with Google
        </button>
      </div>
    );
  }

  // No check needed for isAdmin; all users are treated as admins
  return (
    <div className="pt-20 px-6">
      <div className="flex flex-col items-center justify-center h-auto text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl m-5 font-bold mb-4">Admin Panel</h1>

        {/* Admin Options Table */}
        <div className="container p-6 bg-white text-black rounded-lg shadow-lg">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="border border-gray-300 px-6 py-3 text-left text-sm sm:text-base">
                  Option
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left text-sm sm:text-base">
                  Description
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center text-sm sm:text-base">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center text-gray-700">
                <td className="border border-gray-300 px-6 py-3 text-sm sm:text-base">
                  Manage Users
                </td>
                <td className="border border-gray-300 px-6 py-3 text-left text-sm sm:text-base">
                  View and manage user accounts.
                </td>
                <td className="border border-gray-300 px-6 py-3">
                  <a
                    href="/admin/users"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
                  >
                    Go
                  </a>
                </td>
              </tr>
              <tr className="text-center text-gray-700">
                <td className="border border-gray-300 px-6 py-3 text-sm sm:text-base">
                  Manage API Keys
                </td>
                <td className="border border-gray-300 px-6 py-3 text-left text-sm sm:text-base">
                  Generate and control API access keys.
                </td>
                <td className="border border-gray-300 px-6 py-3">
                  <a
                    href="/admin/settings"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
                  >
                    Go
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
