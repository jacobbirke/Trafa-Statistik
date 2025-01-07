import React from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ImportPunktlighetPerAr from "./components/ImportPunktlighetAr";
import PunktlighetTagtyper from "./components/PunktlighetTagtyper";
import Järnvägstransport from "./components/JärnvägstransportAPI";
import StatisticsInterface from "./components/Gränssnitt";
import Test from "./components/TestView";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/järnvägstransport" element={<Järnvägstransport />} />
        <Route path="/punktlighetår" element={<ImportPunktlighetPerAr />} />
        <Route path="/tågtyper" element={<PunktlighetTagtyper />} />
        <Route path="/gränssnitt" element={<StatisticsInterface />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default App;
