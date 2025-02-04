import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import * as XLSX from "xlsx";
import HighchartsGroupedCategories from "highcharts-grouped-categories";
import { createChart } from "./createChart";
import { userInterface } from "./userInterface";
import { selectAllOptions } from "./selectAllOptions";
HighchartsGroupedCategories(Highcharts);

export interface Dimension {
  name: string;
  allValues: string[];
  selectedValues: string[];
  unit?: string;
}

export interface Measure {
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

    const newChart = createChart(containerRef.current);

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

  const {
    handleSelectAllDimensions,
    handleDeselectAllDimensions,
    handleSelectAllDimensionValues,
    handleDeselectAllDimensionValues,
    handleSelectAllMeasures,
    handleDeselectAllMeasures,
  } = selectAllOptions(
    setSelectedDimensions,
    dimensions,
    setMeasures,
    measures
  );

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
        color: chartType === "column" ? "blue" : "red",
      });
    } else {
      if (barMeasure) {
        const barData = aggregateMeasureData(barMeasure);
        seriesData.push({
          name: `${barMeasure}`,
          type: "column",
          data: xAxisDimensions.length === 2 ? barData.flat() : barData,
          color: "blue",
          yAxis: 0,
        });
      }

      if (lineMeasure) {
        const lineData = aggregateMeasureData(lineMeasure);
        seriesData.push({
          name: `${lineMeasure}`,
          type: "spline",
          data: xAxisDimensions.length === 2 ? lineData.flat() : lineData,
          color: "red",
          yAxis: 1,
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
            ? `${selectedMeasure?.name}${
                selectedMeasure?.unit ? ` (${selectedMeasure.unit})` : ""
              }`
            : barMeasure || "",
        style: { color: "blue" },
      },
    });

    chart.yAxis[1].update({
      title: {
        text: lineMeasure ? `${lineMeasure}` : "",
        style: { color: "red" },
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

  return userInterface(
    step,
    handleFileUpload,
    setStep,
    handleSelectAllDimensions,
    handleDeselectAllDimensions,
    dimensions,
    selectedDimensions,
    setSelectedDimensions,
    handleSelectAllDimensionValues,
    handleDeselectAllDimensionValues,
    handleSelectAllMeasures,
    handleDeselectAllMeasures,
    measures,
    setMeasures,
    xAxisDimensions,
    setXAxisDimensions,
    chartType,
    setChartType,
    barMeasure,
    setBarMeasure,
    lineMeasure,
    setLineMeasure,
    handleGenerateChart,
    containerRef
  );
};

export default StatistikGränssnitt;
