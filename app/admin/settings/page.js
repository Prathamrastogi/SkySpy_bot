"use client";
import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKey, setNewKey] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/apikeys`)
      .then((res) => res.json())
      .then((data) => {
        setApiKeys(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching API keys:", error);
        setLoading(false);
      });
  }, []);

  const addApiKey = async () => {
    if (!newKey.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/apikeys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newKey }),
      });

      const data = await res.json();
      if (res.ok) {
        setApiKeys([...apiKeys, { key: newKey, isActive: false }]);
        setNewKey("");
      } else {
        alert(data.error || "Failed to add API key.");
      }
    } catch (error) {
      console.error("Error adding API key:", error);
      alert("Something went wrong.");
    }
  };

  const toggleApiKey = async (key, isActive) => {
    try {
      await fetch(`${API_BASE_URL}/apikeys`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, isActive: !isActive }),
      });

      setApiKeys(
        apiKeys.map((apiKey) =>
          apiKey.key === key ? { ...apiKey, isActive: !isActive } : apiKey
        )
      );
      location.reload();
    } catch (error) {
      console.error("Error toggling API key:", error);
    }
  };

  const deleteApiKey = async (key) => {
    try {
      await fetch(`${API_BASE_URL}/apikeys`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      location.reload();
      setApiKeys(apiKeys.filter((apiKey) => apiKey.key !== key));
    } catch (error) {
      console.error("Error deleting API key:", error);
    }
  };

  return (
    <div className="container p-6 mt-20 bg-white">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-black">Manage API Keys</h1>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center">
        <input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Enter API Key"
          className="border border-gray-300 px-4 py-2 mr-2 text-black w-full sm:w-3/4 mb-2 sm:mb-0 text-sm sm:text-base"
        />
        <button
          onClick={addApiKey}
          className="bg-blue-500 text-black px-4 py-2 rounded w-full sm:w-auto text-sm sm:text-base"
        >
          Add API Key
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm sm:text-base">⏳ Loading API keys...</p>
      ) : apiKeys.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">API Key</th>
              <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((apiKey) => (
              <tr key={apiKey.key} className="text-center text-gray-600">
                <td className="border border-gray-300 px-4 py-2 text-sm sm:text-base">
                  {apiKey.key}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm sm:text-base">
                  {apiKey.isActive ? "Active" : "Inactive"}
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    onClick={() => toggleApiKey(apiKey.key, apiKey.isActive)}
                    className={`px-4 py-1 rounded ${
                      apiKey.isActive ? "bg-red-500" : "bg-green-500"
                    } text-white text-sm sm:text-base`}
                  >
                    {apiKey.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteApiKey(apiKey.key)}
                    className="px-4 py-1 bg-gray-500 text-white rounded text-sm sm:text-base"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-sm sm:text-base">No API keys found.</p>
      )}
    </div>
  );
}
