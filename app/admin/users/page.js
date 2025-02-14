"use client";
import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Dynamically get backend URL

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const toggleBlock = async (telegramId, isBlocked) => {
    try {
      await fetch(`${API_BASE_URL}/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, isBlocked: !isBlocked }),
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.telegramId === telegramId
            ? { ...user, isBlocked: !isBlocked }
            : user
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (telegramId) => {
    try {
      await fetch(`${API_BASE_URL}/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId }),
      });
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.telegramId !== telegramId)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <h1 className="text-4xl sm:text-5xl md:text-6xl mt-24 flex flex-col items-center justify-center h-auto text-white font-bold mb-4">
        Admin Panel
      </h1>
      <div className="container mt p-6 mt-20 bg-white">
        {loading ? (
          <p className="text-center text-sm sm:text-base text-gray-500">
            ⏳ Please wait, loading users...
          </p>
        ) : users.length === 0 ? (
          <p className="text-center text-sm sm:text-base text-gray-500">No users found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Telegram ID</th>
                <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">First Name</th>
                <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.telegramId} className="text-center text-sm sm:text-base text-gray-600">
                  <td className="border border-gray-300 px-4 py-2">{user.telegramId}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.firstName || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.isBlocked ? "Blocked" : "Active"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <button
                      onClick={() =>
                        toggleBlock(user.telegramId, user.isBlocked)
                      }
                      className={`px-4 py-1 rounded text-sm sm:text-base ${
                        user.isBlocked ? "bg-green-500" : "bg-red-500"
                      } text-white`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => deleteUser(user.telegramId)}
                      className="px-4 py-1 bg-gray-500 text-white rounded text-sm sm:text-base"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
