import React from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ImportPunktlighetPerAr from "./tidigare arbete/ImportPunktlighetAr";
import PunktlighetTagtyper from "./tidigare arbete/PunktlighetTagtyper";
import Järnvägstransport from "./tidigare arbete/JärnvägstransportAPI";
import StatisticsInterface from "./tidigare arbete/Struktur";
import StatistikGränssnitt from "./components/Gränssnitt";
import EmbedPage from "./components/EmbedPage";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/järnvägstransport" element={<Järnvägstransport />} />
        <Route path="/punktlighetår" element={<ImportPunktlighetPerAr />} />
        <Route path="/tågtyper" element={<PunktlighetTagtyper />} />
        <Route path="/struktur" element={<StatisticsInterface />} />
        <Route path="/" element={<StatistikGränssnitt />} />
        <Route path="/route" element={<EmbedPage />} />

      </Routes>
    </Router>
  );
};

export default App;
