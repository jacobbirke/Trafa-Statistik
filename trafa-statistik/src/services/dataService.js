// src/services/dataService.js
import { API_BASE_URL } from '../config';

// Function to fetch data for the first dataset
export const fetchData1 = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}T04022%7Cgtrparb%7Cptrparb%7Car`);
    const data = await response.json();
    const seriesNames = {
      gtrparb: data.seriesNameGtrparb || "Guds Transportarbete",  // Default name if not available
      ptrparb: data.seriesNamePtrparb || "Persontransportarbete",  // Default name if not available
    };
    return parseData1(data);
  } catch (error) {
    console.error('Error fetching data 1:', error);
    throw error;
  }
};

// Function to fetch data for the second dataset
export const fetchData2 = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}T04022|gtrparb|ar|riktningh|lasttyp`);
    const data = await response.json();
    return parseData2(data);
  } catch (error) {
    console.error('Error fetching data 2:', error);
    throw error;
  }
};

// Function to parse the first dataset
const parseData1 = (data) => {
  const columns = data.Header.Column;
  const gtrparbColumn = columns.find((col) => col.Name === 'gtrparb');
  const ptrparbColumn = columns.find((col) => col.Name === 'ptrparb');

  const rows = data.Rows;
  const parsedData = [];
  const years = [];

  rows.forEach((row) => {
    const cells = row.Cell;
    const year = cells[0]?.Value;
    const gtrparb = cells[1]?.Value;
    const ptrparb = cells[2]?.Value;

    if (year && gtrparb && ptrparb) {
      years.push(year);
      parsedData.push({
        year,
        gtrparb: parseInt(gtrparb, 10),
        ptrparb: parseInt(ptrparb, 10),
      });
    }
  });

  return { parsedData, years };
};

// Function to parse the second dataset
const parseData2 = (data) => {
  const columns = data.Header.Column;
  const gtrparbColumn = columns.find((col) => col.Name === 'gtrparb');
  const riktninghColumn = columns.find((col) => col.Name === 'riktningh');
  const lasttypColumn = columns.find((col) => col.Name === 'lasttyp');

  const rows = data.Rows;
  const parsedData = {};
  const years = new Set();

  rows.forEach((row) => {
    const cells = row.Cell;
    const year = cells[0]?.Value;
    const riktningh = cells[1]?.Value;
    const lasttyp = cells[2]?.Value;
    const gtrparb = parseInt(cells[3]?.Value, 10);

    if (year && riktningh && lasttyp && gtrparb) {
      years.add(year);

      const key = `${riktningh} - ${lasttyp}`;
      if (!parsedData[key]) {
        parsedData[key] = [];
      }
      parsedData[key].push({ year, gtrparb });
    }
  });

  return { parsedData, years: [...years].sort() };
};
