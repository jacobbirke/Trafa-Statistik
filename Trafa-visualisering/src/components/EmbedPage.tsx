import React, { useEffect, useState } from "react";
import EmbeddedChart from "./EmbeededChart";

const EmbedPage: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const configParam = params.get('config');
      
      if (!configParam) {
        throw new Error('Missing config parameter');
      }

      const decoded = JSON.parse(decodeURIComponent(configParam));
      setConfig(decoded);
    } catch (err) {
      setError('Invalid embed configuration');
      console.error('Embed error:', err);
    }
  }, []);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!config) return <div className="p-4">Laddar...</div>;

  return (
    <div className="min-h-screen bg-white p-4">
      <EmbeddedChart config={config} />
    </div>
  );
};

export default EmbedPage;