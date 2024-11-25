import React from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ImportPunktlighetPerAr from "./components/ImportPunktlighetAr";
import PunktlighetPerAr from "./components/PunktlighetAr";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/PunktlighetÅr" element={<PunktlighetPerAr />} />
        <Route path="/ImportPunktlighetÅr" element={<ImportPunktlighetPerAr />} />
      </Routes>
    </Router>
  );
};

export default App;
