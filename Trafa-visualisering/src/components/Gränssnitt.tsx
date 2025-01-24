import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import * as XLSX from "xlsx";

interface Dimension {
  name: string;
  allValues: string[];
  selectedValues: string[];
  unit?: string;
}

interface Measure {
  name: string;
  unit?: string;
  isSelected: boolean;
}

const StatistikGränssnitt: React.FC = () => {
  const [step, setStep] = useState<
    | "input-file"
    | "select-dimensions"
    | "filter-dimensions"
    | "select-measures"
    | "chart-configuration"
    | "review-generate"
  >("input-file");
  const [chart, setChart] = useState<any>(null);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<Dimension[]>([]);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [barMeasure, setBarMeasure] = useState<string | null>(null);
  const [lineMeasure, setLineMeasure] = useState<string | null>(null);
  const [xAxisDimension, setXAxisDimension] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("Diagram utan titel");
  const [jsonData, setJsonData] = useState<any[]>([]);
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

        const title = parsedData[0][0];
        const headers = parsedData[1];
        const units = parsedData[2];

        const dimensionHeaders: string[] = [];
        const measureHeaders: string[] = [];

        headers.forEach((header) => {
          if (header.endsWith("_M")) {
            measureHeaders.push(header);
          } else {
            dimensionHeaders.push(header);
          }
        });

        const dimensionsData: Dimension[] = dimensionHeaders.map(
          (header, index) => {
            const uniqueValues = new Set<string>();
            parsedData.forEach((row, rowIndex) => {
              if (rowIndex > 2) uniqueValues.add(row[index]?.toString() || "");
            });
            return {
              name: header,
              allValues: Array.from(uniqueValues),
              selectedValues: [],
              unit: units[index] || "",
            };
          }
        );

        const measuresData: Measure[] = measureHeaders.map((header, index) => ({
          name: header.replace("_M", ""),
          unit: units[index] || "",
          isSelected: false,
        }));

        setTitle(title);
        setDimensions(dimensionsData);
        setMeasures(measuresData);
        setJsonData(parsedData.slice(3));
      } catch (error) {
        console.error("Error", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDimensionSelection = (
    dimensionName: string,
    isSelected: boolean
  ) => {
    if (isSelected) {
      const dimension = dimensions.find((dim) => dim.name === dimensionName);
      if (dimension) {
        setSelectedDimensions((prev) => [
          ...prev,
          { ...dimension, selectedValues: [] },
        ]);
      }
    } else {
      setSelectedDimensions((prev) =>
        prev.filter((dim) => dim.name !== dimensionName)
      );
    }
  };

  const handleDimensionValueSelection = (
    dimensionName: string,
    value: string,
    isSelected: boolean
  ) => {
    setSelectedDimensions((prev) =>
      prev.map((dim) =>
        dim.name === dimensionName
          ? {
              ...dim,
              selectedValues: isSelected
                ? [...dim.selectedValues, value]
                : dim.selectedValues.filter((v) => v !== value),
            }
          : dim
      )
    );
  };

  const handleMeasureSelection = (measureName: string, isSelected: boolean) => {
    setMeasures((prev) =>
      prev.map((measure) =>
        measure.name === measureName ? { ...measure, isSelected } : measure
      )
    );
  };

  const handleGenerateChart = () => {
    if (!chart || !jsonData) return;

    const xAxisDimensionIndex = dimensions.findIndex(
      (dim) => dim.name === xAxisDimension
    );

    if (xAxisDimensionIndex === -1) {
      alert("Dimension för x-axeln hittades inte!");
      return;
    }

    const selectedXAxisValues = selectedDimensions.find(
      (dim) => dim.name === xAxisDimension
    )?.selectedValues;

    if (!selectedXAxisValues || selectedXAxisValues.length === 0) {
      alert("Inga valda värden för X-axeln.");
      return;
    }

    const filteredRows = jsonData.filter((row) => {
      return selectedDimensions.every((dimension) => {
        const dimensionIndex = dimensions.findIndex(
          (dim) => dim.name === dimension.name
        );
        if (dimensionIndex === -1) return true;

        const rowValue = row[dimensionIndex]?.toString();
        return (
          dimension.selectedValues.length === 0 ||
          dimension.selectedValues.includes(rowValue)
        );
      });
    });

    if (filteredRows.length === 0) {
      alert("Inga rader matchar de valda filtren.");
      return;
    }

    const aggregateMeasureData = (measureName: string) => {
      const measureIndex =
        measures.findIndex((measure) => measure.name === measureName) +
        dimensions.length;

      return selectedXAxisValues.map((category) => {
        const categoryRows = filteredRows.filter(
          (row) => row[xAxisDimensionIndex]?.toString() === category
        );

        return categoryRows.reduce((sum, row) => {
          const value = parseFloat(row[measureIndex]);
          return sum + (isNaN(value) ? 0 : value);
        }, 0);
      });
    };

    const seriesData: any[] = [];

    if (barMeasure) {
      const barData = aggregateMeasureData(barMeasure);
      seriesData.push({
        name: `${barMeasure}`,
        type: "column",
        data: barData,
        color: "blue",
      });
    }

    if (lineMeasure) {
      const lineData = aggregateMeasureData(lineMeasure);
      seriesData.push({
        name: `${lineMeasure}`,
        type: "spline",
        data: lineData,
        color: "orange",
      });
    }

    chart.xAxis[0].update({ categories: selectedXAxisValues });
    chart.series.forEach((series: any) => series.remove(false));
    seriesData.forEach((series) => chart.addSeries(series, false));
    chart.redraw();
    chart.setTitle({ text: title || "Diagram" });

    console.log(seriesData);
  };

  return (
    <div>
      {step === "input-file" && (
        <div>
          <h3>Ladda upp fil</h3>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
          />
          <button onClick={() => setStep("select-dimensions")}>Nästa</button>
        </div>
      )}

      {step === "select-dimensions" && (
        <div>
          <h3>Välj Dimensioner</h3>
          {dimensions.map((dim) => (
            <div key={dim.name}>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleDimensionSelection(dim.name, e.target.checked)
                  }
                />
                {dim.name} {dim.unit && `(${dim.unit})`}
              </label>
            </div>
          ))}
          <button onClick={() => setStep("input-file")}>Tillbaka</button>
          <button onClick={() => setStep("filter-dimensions")}>Nästa</button>
        </div>
      )}

      {step === "filter-dimensions" && (
        <div>
          <h3>Filtrera Dimensioner</h3>
          {selectedDimensions.map((dim) => (
            <div key={dim.name}>
              <h4>{dim.name}</h4>
              {dim.allValues.map((value) => (
                <div key={value}>
                  <label>
                    <input
                      type="checkbox"
                      checked={dim.selectedValues.includes(value)}
                      onChange={(e) =>
                        handleDimensionValueSelection(
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
          <button onClick={() => setStep("select-dimensions")}>Tillbaka</button>
          <button
            onClick={() => {
              const allDimensionsValid = selectedDimensions.every(
                (dim) => dim.selectedValues.length > 0
              );

              if (!allDimensionsValid) {
                alert("Välj minst ett värde för varje vald dimension");
                return;
              }

              setStep("select-measures");
            }}
          >
            Nästa
          </button>
        </div>
      )}

      {step === "select-measures" && (
        <div>
          <h3>Välj Mått</h3>
          {measures.map((measure) => (
            <div key={measure.name}>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleMeasureSelection(measure.name, e.target.checked)
                  }
                />
                {measure.name} {measure.unit && `(${measure.unit})`}
              </label>
            </div>
          ))}
          <button onClick={() => setStep("filter-dimensions")}>Tillbaka</button>
          <button onClick={() => setStep("chart-configuration")}>Nästa</button>
        </div>
      )}

      {step === "chart-configuration" && (
        <div>
          <h3>Diagramkonfiguration</h3>
          <div>
            <h4>Välj X-Axel (Dimension)</h4>
            {selectedDimensions.map((dim) => (
              <div key={dim.name}>
                <label>
                  <input
                    type="radio"
                    name="xAxis"
                    value={dim.name}
                    checked={xAxisDimension === dim.name}
                    onChange={() => setXAxisDimension(dim.name)}
                  />
                  {dim.name}
                </label>
              </div>
            ))}
          </div>
          <div>
            <h4>Välj Mått för Stapeldiagram</h4>
            {measures
              .filter((measure) => measure.isSelected)
              .map((measure) => (
                <div key={measure.name}>
                  <label>
                    <input
                      type="radio"
                      name="barMeasure"
                      value={measure.name}
                      checked={barMeasure === measure.name}
                      onChange={() => setBarMeasure(measure.name)}
                    />
                    {measure.name}
                  </label>
                </div>
              ))}
          </div>
          <div>
            <h4>Välj Mått för Linjediagram</h4>
            {measures
              .filter((measure) => measure.isSelected)
              .map((measure) => (
                <div key={measure.name}>
                  <label>
                    <input
                      type="radio"
                      name="lineMeasure"
                      value={measure.name}
                      checked={lineMeasure === measure.name}
                      onChange={() => setLineMeasure(measure.name)}
                    />
                    {measure.name}
                  </label>
                </div>
              ))}
          </div>
          <button onClick={() => setStep("select-measures")}>Tillbaka</button>
          <button
            onClick={() => {
              if (!xAxisDimension || (!barMeasure && !lineMeasure)) {
                alert(
                  "Välj x-axel och minst ett mått för stapel eller linjediagram."
                );
                return;
              }
              setStep("review-generate");
            }}
          >
            Nästa
          </button>{" "}
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
