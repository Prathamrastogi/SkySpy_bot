"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();

  // Show loading while session is being fetched
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-white">
          ⏳ Please wait, checking authentication...
        </p>
      </div>
    );
  }

  // If user is not logged in, show login button
  if (!session)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg">You must sign in to access the admin panel.</p>
        <button
          onClick={() => signIn("google")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Login with Google
        </button>
      </div>
    );

  return (
    <div className="pt-20 px-6">
      <div className="flex flex-col items-center justify-center h-auto text-white">
        <h1 className="text-6xl m-5 font-bold mb-4">Admin Panel</h1>

        {/* Admin Options Table */}
        <div className="container p-6 bg-white text-black rounded-lg shadow-lg">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="border border-gray-300 px-6 py-3 text-left">
                  Option
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  Description
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center text-gray-700">
                <td className="border border-gray-300 px-6 py-3">
                  Manage Users
                </td>
                <td className="border border-gray-300 px-6 py-3 text-left">
                  View and manage user accounts.
                </td>
                <td className="border border-gray-300 px-6 py-3">
                  <a
                    href="/admin/users"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Go
                  </a>
                </td>
              </tr>
              <tr className="text-center text-gray-700">
                <td className="border border-gray-300 px-6 py-3">
                  Manage API Keys
                </td>
                <td className="border border-gray-300 px-6 py-3 text-left">
                  Generate and control API access keys.
                </td>
                <td className="border border-gray-300 px-6 py-3">
                  <a
                    href="/admin/settings"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
