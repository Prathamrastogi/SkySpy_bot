"use client";
import { useState, useEffect } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false); // Stop loading when data is fetched
      })
      .catch(() => setLoading(false)); // Handle errors gracefully
  }, []);

  const toggleBlock = async (telegramId, isBlocked) => {
    await fetch("/api/users", {
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
  };

  const deleteUser = async (telegramId) => {
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId }),
    });
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.telegramId !== telegramId)
    );
  };

  return (
    <>
      <h1 className="text-6xl mt-24 flex flex-col items-center justify-center h-auto text-white font-bold mb-4">
        Admin Panel
      </h1>
      <div className="container mt p-6 mt-20 bg-white ">
        {loading ? ( // Show loading message before data is fetched
          <p className="text-center text-gray-500">
            ⏳ Please wait, loading users...
          </p>
        ) : users.length === 0 ? ( // Show "No users found" only after loading
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="border border-gray-300 px-4 py-2">
                  Telegram ID
                </th>
                <th className="border border-gray-300 px-4 py-2">First Name</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.telegramId} className="text-center text-gray-600">
                  <td className="border border-gray-300 px-4 py-2">
                    {user.telegramId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.firstName || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.isBlocked ? "Blocked" : "Active"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <button
                      onClick={() =>
                        toggleBlock(user.telegramId, user.isBlocked)
                      }
                      className={`px-4 py-1 rounded ${
                        user.isBlocked ? "bg-green-500" : "bg-red-500"
                      } text-white`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => deleteUser(user.telegramId)}
                      className="px-4 py-1 bg-gray-500 text-white rounded"
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
