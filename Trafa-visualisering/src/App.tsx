import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataVisualization from './components/DataVisualization';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/statistik" element={<DataVisualization />} />
      </Routes>
    </Router>
  );
};

export default App;
