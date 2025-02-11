"use client";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setApiKey(data?.weatherApiKey || ""));
  }, []);

  const updateApiKey = async () => {
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weatherApiKey: apiKey }),
    });
  };

  return (
    <div>
      <h1>Manage API Keys</h1>
      <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      <button onClick={updateApiKey}>Update API Key</button>
    </div>
  );
}
