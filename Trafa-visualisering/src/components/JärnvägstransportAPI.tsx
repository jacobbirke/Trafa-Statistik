import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fetchData1 } from '../services/JärnvägstransportAnropAPi';

interface DataItem {
  year: string;
  gtrparb: number;
  ptrparb: number;
}

interface StatNames {
  gtrparb: string;
  ptrparb: string;
}

const Järnvägstransport: React.FC = () => {
  const [data1, setData1] = useState<DataItem[]>([]);
  const [categories1, setCategories1] = useState<string[]>([]);
  const [statNames1, setStatNames1] = useState<StatNames>({
    gtrparb: '',
    ptrparb: '',
  });
  const [selectedYears, setSelectedYears] = useState<string[]>([]); // Store selected years

  useEffect(() => {
    const fetchAndParseData = async () => {
      try {
        const { parsedData: data1Parsed, years: years1 } = await fetchData1();

        const statNames: StatNames = {
          gtrparb: 'Gods Transportarbete',
          ptrparb: 'Persontransportarbete',
        };

        setData1(data1Parsed);
        setCategories1(years1);
        setStatNames1(statNames);
        setSelectedYears(years1); // Default to show all years
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchAndParseData();
  }, []);

  // Filter data based on selected years
  const filterDataByYear = (data: DataItem[], years: string[]): DataItem[] => {
    return data.filter((item) => years.includes(item.year.toString()));
  };

  const chartOptions: Highcharts.Options = {
    chart: {
      zoomType: 'xy'
    },
    title: { text: 'Transport Data Visualization (Dual Axes)' },
    xAxis: {
      categories: selectedYears,
    },
    yAxis: [
      {
        // Primary yAxis
        title: {
          text: 'Miljoner Kilometer (Column)',
        },
        opposite: false, // Place the yAxis on the left
      },
      {
        // Secondary yAxis
        title: {
          text: 'Miljoner Kilometer (Line)',
        },
        opposite: true, // Place the yAxis on the right
      },
    ],
    series: [
      {
        name: statNames1.gtrparb, // Column series (Gods Transportarbete)
        type: 'column',
        yAxis: 0, // Use the primary yAxis
        data: filterDataByYear(data1, selectedYears).map((item) => item.gtrparb),
        tooltip: {
          valueSuffix: ' km',
        },
      },
      {
        name: statNames1.ptrparb, // Line series (Persontransportarbete)
        type: 'line',
        yAxis: 1, // Use the secondary yAxis
        data: filterDataByYear(data1, selectedYears).map((item) => item.ptrparb),
        tooltip: {
          valueSuffix: ' km',
        },
      },
    ],
  };

  return (
    <div>
      <h1>Transport Data Visualization </h1>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default Järnvägstransport;
