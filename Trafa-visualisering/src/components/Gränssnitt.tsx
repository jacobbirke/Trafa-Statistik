import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import * as XLSX from "xlsx";
import HighchartsGroupedCategories from "highcharts-grouped-categories";
HighchartsGroupedCategories(Highcharts);

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
  const [xAxisDimensions, setXAxisDimensions] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("Diagram utan titel");
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<"column" | "line">("column");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const newChart = Highcharts.chart(containerRef.current, {
      chart: { type: "column" },
      title: { text: "", align: "left" },
      xAxis: {
        type: "category",
        crosshair: true,
      },
      yAxis: [
        {
          title: { text: "", style: { color: "blue" } },
          opposite: false, 
        },
        {
          title: { text: "", style: { color: "pink" } },
          opposite: true, 
        },
      ],
      tooltip: { shared: true },
      plotOptions: {
        column: {
          grouping: true,
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
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

    if (xAxisDimensions.length === 0) {
      alert("Välj minst en dimension för x-axeln.");
      return;
    }

    const xAxisDimensionIndices = xAxisDimensions.map((dimName) =>
      dimensions.findIndex((dim) => dim.name === dimName)
    );

    if (xAxisDimensionIndices.some((index) => index === -1)) {
      alert("Dimension för x-axeln hittades inte!");
      return;
    }

    const selectedXAxisValues = xAxisDimensions.map(
      (dimName) =>
        selectedDimensions.find((dim) => dim.name === dimName)
          ?.selectedValues ?? []
    );

    if (selectedXAxisValues.some((values) => values.length === 0)) {
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
        return dimension.selectedValues.includes(rowValue);
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

      if (xAxisDimensions.length === 1) {
        return selectedXAxisValues[0].map((category) => {
          const categoryRows = filteredRows.filter(
            (row) => row[xAxisDimensionIndices[0]]?.toString() === category
          );
          return categoryRows.reduce((sum, row) => {
            const value = parseFloat(row[measureIndex]);
            return sum + (isNaN(value) ? 0 : value);
          }, 0);
        });
      } else {
        return selectedXAxisValues[0].map((mainCategory) => {
          return selectedXAxisValues[1].map((subCategory) => {
            const categoryRows = filteredRows.filter(
              (row) =>
                row[xAxisDimensionIndices[0]]?.toString() === mainCategory &&
                row[xAxisDimensionIndices[1]]?.toString() === subCategory
            );
            return categoryRows.reduce((sum, row) => {
              const value = parseFloat(row[measureIndex]);
              return sum + (isNaN(value) ? 0 : value);
            }, 0);
          });
        });
      }
    };

    const seriesData: any[] = [];
    const selectedMeasures = measures.filter((measure) => measure.isSelected);

    if (selectedMeasures.length === 1) {
      const measure = selectedMeasures[0];
      const data = aggregateMeasureData(measure.name);
      seriesData.push({
        name: `${measure.name}${measure.unit ? ` (${measure.unit})` : ""}`,
        type: chartType,
        data: xAxisDimensions.length === 2 ? data.flat() : data,
        color: chartType === "column" ? "blue" : "pink",
      });
    } else {
      if (barMeasure) {
        const barData = aggregateMeasureData(barMeasure);
        seriesData.push({
          name: `${barMeasure}`,
          type: "column",
          data: xAxisDimensions.length === 2 ? barData.flat() : barData,
          color: "blue",
          yAxis: 0, // Use primary y-axis
        });
      }

      if (lineMeasure) {
        const lineData = aggregateMeasureData(lineMeasure);
        seriesData.push({
          name: `${lineMeasure}`,
          type: "spline",
          data: xAxisDimensions.length === 2 ? lineData.flat() : lineData,
          color: "pink",
          yAxis: 1, // Use secondary y-axis
        });
      }
    }

    const categories =
      xAxisDimensions.length === 2
        ? selectedXAxisValues[0].map((mainCategory) => ({
            name: mainCategory,
            categories: selectedXAxisValues[1],
          }))
        : selectedXAxisValues[0];

    chart.xAxis[0].update({
      categories: categories,
      labels: {
        groupedOptions: xAxisDimensions.length === 2 ? {} : undefined,
      },
    });

    const selectedMeasure = measures.find((measure) => measure.isSelected);

    chart.yAxis[0].update({
      title: {
        text:
          selectedMeasures.length === 1
            ? `${selectedMeasure?.name}${selectedMeasure?.unit ? ` (${selectedMeasure.unit})` : ""}`
            : barMeasure || "",
        style: { color: "blue" },
      },
    });
    
    chart.yAxis[1].update({
      title: {
        text: lineMeasure ? `${lineMeasure}` : "",
        style: { color: "pink" },
      },
    });
    

    chart.series.forEach((series: any) => series.remove(false));
    seriesData.forEach((series) => chart.addSeries(series, false));
    chart.redraw();
    chart.setTitle({ text: title || "Diagram" });
    chart.update({
      chart: {
        type: xAxisDimensions.length === 2 ? "column" : chartType,
      },
    });
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
                    type="checkbox"
                    name="xAxis"
                    value={dim.name}
                    checked={xAxisDimensions.includes(dim.name)}
                    onChange={() => {
                      if (xAxisDimensions.includes(dim.name)) {
                        setXAxisDimensions((prev) =>
                          prev.filter((name) => name !== dim.name)
                        );
                      } else {
                        if (xAxisDimensions.length < 2) {
                          setXAxisDimensions((prev) => [...prev, dim.name]);
                        } else {
                          alert(
                            "Du kan bara välja två dimensioner för x-axeln."
                          );
                        }
                      }
                    }}
                  />
                  {dim.name}
                </label>
              </div>
            ))}
          </div>
          {measures.filter((measure) => measure.isSelected).length === 1 && (
            <div>
              <h4>Välj Diagramtyp</h4>
              <label>
                <input
                  type="radio"
                  name="chartType"
                  value="column"
                  checked={chartType === "column"}
                  onChange={() => setChartType("column")}
                />
                Stapeldiagram
              </label>
              <label>
                <input
                  type="radio"
                  name="chartType"
                  value="line"
                  checked={chartType === "line"}
                  onChange={() => setChartType("line")}
                />
                Linjediagram
              </label>
            </div>
          )}
          {measures.filter((measure) => measure.isSelected).length > 1 && (
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
          )}
          <button onClick={() => setStep("select-measures")}>Tillbaka</button>
          <button
            onClick={() => {
              if (xAxisDimensions.length === 0) {
                alert("Välj minst en dimension för x-axeln.");
                return;
              }

              if (
                measures.filter((measure) => measure.isSelected).length > 1 &&
                (!barMeasure || !lineMeasure)
              ) {
                alert(
                  "Välj mått för både stapel- och linjediagram när flera mått är valda."
                );
                return;
              }

              setStep("review-generate");
            }}
          >
            Nästa
          </button>
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