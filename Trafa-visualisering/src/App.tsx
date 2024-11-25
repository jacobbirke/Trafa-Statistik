import React from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ImportPunktlighetPerAr from "./components/ImportPunktlighetAr";
import PunktlighetTagtyper from "./components/PunktlighetTagtyper";
import Järnvägstransport from "./components/JärnvägstransportAPI";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Järnvägstransport" element={<Järnvägstransport />} />
        <Route
          path="/ImportPunktlighetÅr"
          element={<ImportPunktlighetPerAr />}
        />
        <Route path="/PunktlighetTågtyper" element={<PunktlighetTagtyper />} />
      </Routes>
    </Router>
  );
};

export default App;
