import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataVisualization from './components/DataVisualization';
import InputDiagram from './components/InputDiagram';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/statistik" element={<DataVisualization />} />
        <Route path="/diagram" element={<InputDiagram />} />
      </Routes>
    </Router>
  );
};

export default App;
