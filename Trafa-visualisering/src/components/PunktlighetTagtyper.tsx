import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import * as XLSX from "xlsx";

interface GroupedData {
  years: string[];
  trainCounts: number[];
  punctualities: number[];
}

const PunktlighetTagtyper: React.FC = () => {
  const [chart, setChart] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const newChart = Highcharts.chart(
        containerRef.current,
        {
          chart: {
            zooming: {
              type: "xy",
            },
          },
          title: {
            text: "",
            align: "left",
          },
          credits: {
            text: 'Source: <a href="https://www.trafa.se/bantrafik/punktlighet-pa-jarnvag/" target="_blank">Trafikanalys</a>',
          },
          xAxis: [
            {
              categories: [],
              crosshair: true,
            },
          ],
          yAxis: [
            {
              // Primary y-axis (Punctuality)
              title: {
                text: "",
                style: {
                  color: Highcharts.getOptions().colors?.[1] as string ?? "black",
                },
              },
              labels: {
                format: "{value} ",
                style: {
                  color: Highcharts.getOptions().colors?.[1] as string  ?? "blue",
                },
              },
            },
            {
              // Secondary y-axis (Train Count)
              title: {
                text: "",
                style: {
                  color: Highcharts.getOptions().colors?.[0] as string  ?? "green",
                },
              },
              labels: {
                format: "{value} ",
                style: {
                  color: Highcharts.getOptions().colors?.[0] as string  ?? "red",
                },
              },
              opposite: true,
            },
          ],
          tooltip: {
            shared: true,
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            backgroundColor:
              Highcharts.defaultOptions.legend?.backgroundColor ??
              "rgba(255,255,255,0.25)",
          },
          series: [],
        },
        () => {}
      );

      setChart(newChart);

      return () => {
        newChart.destroy();
      };
    }
  }, []);

  // Handle file upload and CSV parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const data = event.target?.result;
      if (!(data instanceof ArrayBuffer)) return;

      try {
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
        const title = jsonData[0][1];
        const headers = jsonData[1];
        const units = jsonData[2];

        const groupedData: Record<string, GroupedData> = {};
        const years: string[] = [];

        jsonData.forEach((row: any[], index: number) => {
          if (index <= 2) return; // Skip title, header, and unit rows

          const year = row[0];
          const trainType = row[1];
          const trainCount = row[2];
          let punctuality = row[3];

          if (punctuality === undefined || punctuality === null) {
            punctuality = 0; 
          } else {
            punctuality = parseFloat(punctuality).toFixed(2);
            punctuality = parseFloat(punctuality);
          }

          if (!years.includes(year)) {
            years.push(year);
          }

          if (!groupedData[trainType]) {
            groupedData[trainType] = {
              years: [],
              trainCounts: [],
              punctualities: [],
            };
          }

          groupedData[trainType].years.push(year);
          groupedData[trainType].trainCounts.push(trainCount);
          groupedData[trainType].punctualities.push(punctuality);
        });

        if (chart) {
          chart.xAxis[0].update({
            categories: years,
          });

          chart.series = [];

          Object.keys(groupedData).forEach((trainType) => {
            const data = groupedData[trainType];

            chart.addSeries({
              name: `${trainType} - ${headers[2]}`,
              type: "column",
              yAxis: 1,
              data: data.trainCounts,
              tooltip: {
      
                valueSuffix: " " + units[2], // Train unit
              },
            });

            chart.addSeries({
              name: `${trainType} - ${headers[3]}`,
              type: "spline",
              data: data.punctualities,
              tooltip: {
      
                valueSuffix: " " + units[3], // Punctuality unit
              },
            });
          });

          chart.yAxis[0].update({
            title: {
    
              text: headers[3], // Punctuality title
              style: {
      
                color: Highcharts.getOptions().colors?.[1],
              },
            },
            labels: {
    
              format: "{value} " + units[3], // Punctuality unit
              style: {
      
                color: Highcharts.getOptions().colors?.[1],
              },
            },
            min: 0,
            max: 100,
            tickInterval: 20,
            endOnTick: false,
            startOnTick: false,
          });

          chart.yAxis[1].update({
            title: {
    
              text: headers[2], // Train title
              style: {
      
                color: Highcharts.getOptions().colors?.[0],
              },
            },
            labels: {
    
              format: "{value:,.0f} " + units[2], // Train unit
              style: {
      
                color: Highcharts.getOptions().colors?.[0],
              },
            },
          });

          chart.setTitle({
            text: title,
          });
        }
      } catch (error) {
        console.error("Error parsing the Excel file:", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input
        type="file"
        id="upload"
        accept=".csv"
        onChange={handleFileUpload}
      />
      <div
        id="container"
        ref={containerRef}
        style={{ width: "100%", height: "600px" }}
      />
    </div>
  );
};

export default PunktlighetTagtyper;
