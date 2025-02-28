import React, { useEffect, useState } from "react";
import EmbeddedChart from "./EmbeededChart";

const EmbedPage: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const configParam = params.get("config");

  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    if (configParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(configParam));
        setConfig(decoded);
      } catch (error) {
        console.error("Error parsing config:", error);
      }
    }
  }, [configParam]);

  if (!config) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-4">
      <EmbeddedChart config={config} />
    </div>
  );
};

export default EmbedPage;