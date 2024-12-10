import React from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ImportPunktlighetPerAr from "./components/ImportPunktlighetAr";
import PunktlighetTagtyper from "./components/PunktlighetTagtyper";
import Järnvägstransport from "./components/JärnvägstransportAPI";
import { StatisticsInterface } from "./components/Gränssnitt";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/järnvägstransport" element={<Järnvägstransport />} />
        <Route path="/punktlighetår" element={<ImportPunktlighetPerAr />} />
        <Route path="/tågtyper" element={<PunktlighetTagtyper />} />
        <Route path="/gränssnitt" element={<StatisticsInterface/>} />
      </Routes>
    </Router>
  );
};

export default App;
