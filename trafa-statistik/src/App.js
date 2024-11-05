import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const App = () => {
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState({ gtrparb: '', ptrparb: '' });
  const [statNames, setStatNames] = useState({ gtrparb: '', ptrparb: '' });
  const [selectedYears, setSelectedYears] = useState(new Set());
  const [chartType, setChartType] = useState('line'); // State for selected chart type

  useEffect(() => {
    // Fetch data from the API
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.trafa.se/api/data?query=T04022%7Cgtrparb%7Cptrparb%7Car');
      const data = await response.json(); // Parse the JSON response

      // Log the raw data to check its structure
      console.log("Raw JSON Data:", data);

      // Parse the JSON data
      parseJSONData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const parseJSONData = (data) => {
    try {
      // Extract statistics names and units from the Header
      const columns = data.Header.Column;
      const gtrparbColumn = columns.find((col) => col.Name === 'gtrparb');
      const ptrparbColumn = columns.find((col) => col.Name === 'ptrparb');

      // Set the units and statistics names
      setUnits({
        gtrparb: 'miljoner tonkilometer', // Set specific unit for gtrparb
        ptrparb: 'miljoner personkilometer', // Set specific unit for ptrparb
      });
      setStatNames({
        gtrparb: gtrparbColumn?.Value || 'Godstransportarbete',
        ptrparb: ptrparbColumn?.Value || 'Persontransportarbete',
      });

      const rows = data.Rows;
      const parsedData = [];
      const years = [];

      rows.forEach((row) => {
        const cells = row.Cell;
        const year = cells[0]?.Value;
        const gtrparb = cells[1]?.Value;
        const ptrparb = cells[2]?.Value;

        // Log each row's values to see if they are being extracted
        console.log("Year:", year, "gtrparb:", gtrparb, "ptrparb:", ptrparb);

        if (year && gtrparb && ptrparb) {
          years.push(year);
          parsedData.push({
            year,
            gtrparb: parseInt(gtrparb, 10),
            ptrparb: parseInt(ptrparb, 10),
          });
        }
      });

      // Set the extracted data to state
      setCategories(years);
      setChartData(parsedData);

      // Log the final parsed data
      console.log("Parsed Chart Data:", parsedData);
    } catch (error) {
      console.error('Error parsing JSON data:', error);
    }
  };

  const handleYearSelection = (year) => {
    const updatedSelectedYears = new Set(selectedYears);
    if (updatedSelectedYears.has(year)) {
      updatedSelectedYears.delete(year);
    } else {
      updatedSelectedYears.add(year);
    }
    setSelectedYears(updatedSelectedYears);
  };

  const toggleSelectAll = (selectAll) => {
    if (selectAll) {
      const allYears = new Set(categories);
      setSelectedYears(allYears);
    } else {
      setSelectedYears(new Set());
    }
  };

  const getFilteredData = () => {
    if (selectedYears.size === 0) {
      return chartData; // If no years are selected, return all data
    }
    return chartData.filter((item) => selectedYears.has(item.year));
  };

  const filteredData = getFilteredData();
  
  // Highcharts options with dynamic chart type
  const options = {
    chart: {
      type: chartType, // Set the chart type dynamically
    },
    title: {
      text: 'Dynamic Diagram using Highcharts',
    },
    xAxis: {
      categories: [...selectedYears].sort(), // Use selected years for the x-axis
    },
    yAxis: {
      title: {
        text: `Values`, // Keep y-axis title generic
      },
    },
    series: [
      {
        name: `${statNames.gtrparb} (${units.gtrparb})`, // Include stat name and unit in series name
        data: filteredData.map((item) => item.gtrparb),
      },
      {
        name: `${statNames.ptrparb} (${units.ptrparb})`, // Include stat name and unit in series name
        data: filteredData.map((item) => item.ptrparb),
      },
    ],
  };

  return (
    <div>
      <h1>Trafa Statistik Chart</h1>
      <h2>Statistics Displayed:</h2>
      <p>{statNames.gtrparb}: {units.gtrparb}</p>
      <p>{statNames.ptrparb}: {units.ptrparb}</p>

      <h3>Select Years to Display:</h3>
      <button onClick={() => toggleSelectAll(true)}>Select All</button>
      <button onClick={() => toggleSelectAll(false)}>Deselect All</button>
      <div>
        {categories.map((year) => (
          <div key={year}>
            <label>
              <input
                type="checkbox"
                checked={selectedYears.has(year)}
                onChange={() => handleYearSelection(year)}
              />
              {year}
            </label>
          </div>
        ))}
      </div>

      <h3>Select Chart Type:</h3>
      <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
        <option value="line">Line Chart</option>
        <option value="column">Column Chart</option>
        <option value="bar">Bar Chart</option>
        <option value="area">Area Chart</option>
        <option value="spline">Spline Chart</option>
      </select>

      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default App;
