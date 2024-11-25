import React from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DataVisualization from "./components/PunktlighetAr";
import InputDiagram from "./components/ImportPunktlighetAr";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/PunktlighetÅr" element={<DataVisualization />} />
        <Route path="/ImportPunktlighetÅr" element={<InputDiagram />} />
      </Routes>
    </Router>
  );
};

export default App;
