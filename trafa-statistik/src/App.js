import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataVisualization from '../src/components/DataVisualization';

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/statistik" element={<DataVisualization/>} />
        </Routes>
    </Router>
  );
};

export default App;
