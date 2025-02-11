"use client";
import { useState, useEffect } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const toggleBlock = async (telegramId, isBlocked) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, isBlocked: !isBlocked }),
    });
    setUsers(
      users.map((user) =>
        user.telegramId === telegramId
          ? { ...user, isBlocked: !isBlocked }
          : user
      )
    );
  };

  const deleteUser = async (telegramId) => {
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId }),
    });
    setUsers(users.filter((user) => user.telegramId !== telegramId));
  };

  return (
    <div>
      <h1>User Management</h1>
      <ul>
        {users.map((user) => (
          <li key={user.telegramId}>
            {user.telegramId} - {user.isBlocked ? "Blocked" : "Active"}
            <button
              onClick={() => toggleBlock(user.telegramId, user.isBlocked)}
            >
              {user.isBlocked ? "Unblock" : "Block"}
            </button>
            <button onClick={() => deleteUser(user.telegramId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
