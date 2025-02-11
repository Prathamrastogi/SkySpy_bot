"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session } = useSession();

  if (!session)
    return <button onClick={() => signIn("google")}>Login with Google</button>;

  return (
    <div>
      <h1>Admin Panel</h1>
      <button onClick={() => signOut()}>Logout</button>
      <a href="/admin/users">Manage Users</a>
      <a href="/admin/settings">Manage API Keys</a>
    </div>
  );
}
