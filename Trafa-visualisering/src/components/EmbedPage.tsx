import React, { useEffect, useState } from "react";
import EmbeddedChart from "./EmbeededChart";

const backendUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL_PROD
  : import.meta.env.VITE_API_URL_DEV;

const EmbedPage: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const configId = params.get("configId");

        if (!configId) {
          throw new Error("Missing config ID");
        }

        const response = await fetch(`${backendUrl}/api/configs/${configId}`);
        if (!response.ok) {
          throw new Error("Config not found");
        }

        const config = await response.json();
        setConfig(config);
      } catch (err) {
        setError("Invalid or expired embed configuration");
        console.error("Embed error:", err);
      }
    };

    fetchConfig();
  }, []);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!config) return <div className="p-4">Laddar...</div>;

  return (
    <div className="bg-white p-1">
      <EmbeddedChart config={config} />
    </div>
  );
};

export default EmbedPage;
