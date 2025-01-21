import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import * as XLSX from "xlsx";

interface Dimension {
  name: string;
  allValues: string[];
  selectedValues: string[];
}

const StatistikGränssnitt: React.FC = () => {
  const [step, setStep] = useState<
    "input-cvs" | "input-dimensions" | "review-generate"
  >("input-cvs");
  const [chart, setChart] = useState<any>(null);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [title, setTitle] = useState<string>("");
  const [jsonData, setJsonData] = useState<any[]>([]); // Store the parsed data from the file
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const newChart = Highcharts.chart(containerRef.current, {
      chart: { zooming: { type: "xy" } },
      title: { text: "", align: "left" },
      xAxis: [{ categories: [], crosshair: true }],
      yAxis: [
        {
          title: { text: "Values", style: { color: "#007bff" } },
        },
      ],
      tooltip: { shared: true },
      series: [],
    });

    setChart(newChart);

    return () => {
      newChart.destroy();
    };
  }, []);

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
        const parsedData = XLSX.utils.sheet_to_json<any[]>(sheet, {
          header: 1,
        });

        const title = parsedData[0][1];
        const headers = parsedData[2];
        // const units = parsedData[2];

        const dimensionsData: Dimension[] = headers.map((header, index) => {
          const uniqueValues = new Set<string>();
          parsedData.forEach((row, rowIndex) => {
            if (rowIndex > 2) uniqueValues.add(row[index]?.toString() || "");
          });
          return {
            name: header,
            allValues: Array.from(uniqueValues),
            selectedValues: [],
          };
        });

        setTitle(title);
        setDimensions(dimensionsData);
        setJsonData(parsedData);
      } catch (error) {
        console.error("Error parsing the file:", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDimensionSelection = (
    dimensionName: string,
    value: string,
    isSelected: boolean
  ) => {
    setDimensions((prevDimensions) =>
      prevDimensions.map((dimension) =>
        dimension.name === dimensionName
          ? {
              ...dimension,
              selectedValues: isSelected
                ? [...dimension.selectedValues, value]
                : dimension.selectedValues.filter((v) => v !== value),
            }
          : dimension
      )
    );
  };

  const handleGenerateChart = () => {
    if (!chart || !jsonData) return;

    const selectedDimensions = dimensions.filter(
      (dim) => dim.selectedValues.length > 0
    );

    if (selectedDimensions.length === 0) {
      console.log("No dimensions selected!");
      return;
    }

    const selectedCategories =
      selectedDimensions.find((dim) => dim.name === "Year")?.selectedValues ||
      [];

    const seriesData = selectedDimensions
      .filter((dim) => dim.name !== "Year")
      .map((dim) => {
        const seriesValues = selectedCategories.map((category) => {
          return jsonData
            .filter((row) => row[dim.name] === category)
            .reduce(
              (acc, row) => acc + (parseFloat(row[dim.name] as string) || 0),
              0
            );
        });

        return {
          name: dim.name,
          data: seriesValues,
        };
      });

    chart.xAxis[0].update({ categories: selectedCategories });
    chart.series = seriesData;
    chart.setTitle({ text: title });
  };

  return (
    <div>
      {step === "input-cvs" && (
        <div>
          <h3>Ladda upp CSV-fil</h3>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
          <button onClick={() => setStep("input-dimensions")}>Nästa</button>
        </div>
      )}

      {step === "input-dimensions" && (
        <div>
          <h3>Dimensioner</h3>
          {dimensions.map((dim) => (
            <div key={dim.name}>
              <h4>{dim.name}</h4>
              {dim.allValues.map((value) => (
                <div key={value}>
                  <label>
                    <input
                      type="checkbox"
                      value={value}
                      checked={dim.selectedValues.includes(value)}
                      onChange={(e) =>
                        handleDimensionSelection(
                          dim.name,
                          value,
                          e.target.checked
                        )
                      }
                    />
                    {value}
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button onClick={() => setStep("input-cvs")}>Tillbaka</button>
          <button onClick={() => setStep("review-generate")}>Nästa</button>
        </div>
      )}

      {step === "review-generate" && (
        <div>
          <button onClick={handleGenerateChart}>Generera diagram</button>
        </div>
      )}

      <div
        id="container"
        ref={containerRef}
        style={{ width: "100%", height: "600px" }}
      />
    </div>
  );
};

export default StatistikGränssnitt;
