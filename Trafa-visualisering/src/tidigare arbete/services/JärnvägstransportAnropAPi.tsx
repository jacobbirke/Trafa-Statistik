import { API_BASE_URL } from '../../config';

// Define types for the parsed data and response data
interface Column {
  Name: string;
}

interface Row {
  Cell: { Value: string }[];
}

interface Data1 {
  Header: { Column: Column[] };
  Rows: Row[];
  seriesNameGtrparb?: string;
  seriesNamePtrparb?: string;
}

interface ParsedDataItem {
  year: string;
  gtrparb: number;
  ptrparb: number;
}

interface Data2 {
  Header: { Column: Column[] };
  Rows: Row[];
}

interface ParsedData2 {
  [key: string]: { year: string; gtrparb: number }[];
}

// Function to fetch data for the first dataset
export const fetchData1 = async (): Promise<{ parsedData: ParsedDataItem[]; years: string[] }> => {
  try { 
    const response = await fetch(`${API_BASE_URL}T04022%7Cgtrparb%7Cptrparb%7Car`);
    const data: Data1 = await response.json();
    
    // const seriesNames = {
    //   gtrparb: data.seriesNameGtrparb || "Gods Transportarbete",  // Default name if not available
    //   ptrparb: data.seriesNamePtrparb || "Persontransportarbete",  // Default name if not available
    // };

    return parseData1(data);
  } catch (error) {
    console.error('Error fetching data 1:', error);
    throw error;
  }
};

// Function to fetch data for the second dataset
export const fetchData2 = async (): Promise<{ parsedData: ParsedData2; years: string[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}T04022|gtrparb|ar|riktningh|lasttyp`);
    const data: Data2 = await response.json();
    return parseData2(data);
  } catch (error) {
    console.error('Error fetching data 2:', error);
    throw error;
  }
};

// Function to parse the first dataset
const parseData1 = (data: Data1): { parsedData: ParsedDataItem[]; years: string[] } => {
  // const columns = data.Header.Column;
  // const gtrparbColumn = columns.find((col) => col.Name === 'gtrparb');
  // const ptrparbColumn = columns.find((col) => col.Name === 'ptrparb');

  const rows = data.Rows;
  const parsedData: ParsedDataItem[] = [];
  const years: string[] = [];

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
const parseData2 = (data: Data2): { parsedData: ParsedData2; years: string[] } => {
  // const columns = data.Header.Column;
  // const gtrparbColumn = columns.find((col) => col.Name === 'gtrparb');
  // const riktninghColumn = columns.find((col) => col.Name === 'riktningh');
  // const lasttypColumn = columns.find((col) => col.Name === 'lasttyp');

  const rows = data.Rows;
  const parsedData: ParsedData2 = {};
  const years = new Set<string>();

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
