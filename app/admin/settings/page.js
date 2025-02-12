"use client";
import { useState, useEffect } from "react";

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKey, setNewKey] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setApiKeys(data);
        setLoading(false);
      });
  }, []);

  const addApiKey = async () => {
    if (!newKey.trim()) return;

    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: newKey }),
    });

    const data = await res.json();
    if (res.ok) {
      setApiKeys([...apiKeys, { key: newKey, isActive: false }]);
      setNewKey("");
    } else {
      alert(data.error);
    }
  };

  const toggleApiKey = async (key, isActive) => {
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, isActive: !isActive }),
    });

    setApiKeys(
      apiKeys.map((apiKey) =>
        apiKey.key === key ? { ...apiKey, isActive: !isActive } : apiKey
      )
    );
    window.location.reload();
  };

  const deleteApiKey = async (key) => {
    await fetch("/api/settings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    setApiKeys(apiKeys.filter((apiKey) => apiKey.key !== key));
  };

  return (
    <div className="container p-6 mt-20 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-black">Manage API Keys</h1>

      <div className="mb-4">
        <input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Enter API Key"
          className="border border-gray-300 px-4 py-2 mr-2 text-black"
        />
        <button
          onClick={addApiKey}
          className="bg-blue-500 text-black px-4 py-2 rounded"
        >
          Add API Key
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">⏳ Loading API keys...</p>
      ) : apiKeys.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border border-gray-300 px-4 py-2">API Key</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((apiKey) => (
              <tr key={apiKey.key} className="text-center text-gray-600">
                <td className="border border-gray-300 px-4 py-2">
                  {apiKey.key}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {apiKey.isActive ? "Active" : "Inactive"}
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    onClick={() => toggleApiKey(apiKey.key, apiKey.isActive)}
                    className={`px-4 py-1 rounded ${
                      apiKey.isActive ? "bg-red-500" : "bg-green-500"
                    } text-white`}
                  >
                    {apiKey.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteApiKey(apiKey.key)}
                    className="px-4 py-1 bg-gray-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No API keys found.</p>
      )}
    </div>
  );
}
