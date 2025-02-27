import React from 'react';
import EmbeddedChart from './EmbeededChart';

const EmbedPage: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const config = JSON.parse(decodeURIComponent(params.get('config') || '{}'));

  return (
    <div className="min-h-screen bg-white p-4">
      <EmbeddedChart config={config} />
    </div>
  );
};

export default EmbedPage;