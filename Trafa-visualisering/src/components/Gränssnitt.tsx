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
    | "select-diagram-type"
    | "filter-dimensions"
    | "select-measures"
    | "chart-configuration"
    | "review-generate"
  >("input-file");

  const [seriesDimension, setSeriesDimension] = useState<string | null>(null);
  const [chart, setChart] = useState<any>(null);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [barMeasure, setBarMeasure] = useState<string | null>(null);
  const [lineMeasure, setLineMeasure] = useState<string | null>(null);
  const [xAxisDimensions, setXAxisDimensions] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("Diagram utan titel");
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<
    "column" | "line" | "combo" | "pie"
  >("column");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const newChart = createChart(containerRef.current);
    setChart(newChart);
    return () => {
      newChart.destroy();
    };
  }, []);

  useEffect(() => {
    if (step === "review-generate" && chart) {
      chart.reflow();
    }
  }, [step, chart]);

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

  const { handleSelectAllMeasures, handleDeselectAllMeasures } =
    selectAllOptions(setMeasures, measures);

  const handleGoBack = () => {
    if (chart) {
      chart.series.forEach((series: any) => series.remove(false));
      chart.setTitle({ text: "" });
      chart.yAxis[0].update({ title: { text: "" } });
      chart.yAxis[1].update({ title: { text: "" } });
      chart.redraw();
    }
    setStep("chart-configuration");
  };

  const handleGenerateChart = () => {
    if (!chart || !jsonData) {
      alert("Chart or data is missing.");
      return;
    }

    if (chartType === "pie") {
      if (!seriesDimension) {
        alert("Välj en dimension för serien för pajdiagram.");
        return;
      }
      const seriesDim = dimensions.find((dim) => dim.name === seriesDimension);
      if (!seriesDim) {
        alert("Ogiltig dimension för serien.");
        return;
      }
      const selectedMeasuresForPie = measures.filter((m) => m.isSelected);
      if (selectedMeasuresForPie.length !== 1) {
        alert("Välj exakt ett mått för pajdiagram.");
        return;
      }
      const measure = selectedMeasuresForPie[0];
      const measureIndex =
        dimensions.length + measures.findIndex((m) => m.name === measure.name);
      const seriesDimIndex = dimensions.findIndex(
        (dim) => dim.name === seriesDimension
      );

      const filteredRows = jsonData.filter((row) =>
        dimensions.every((dimension) => {
          const dimensionIndex = dimensions.findIndex(
            (dim) => dim.name === dimension.name
          );
          if (dimensionIndex === -1) return true;
          const rowValue = row[dimensionIndex]?.toString();
          return dimension.selectedValues.includes(rowValue);
        })
      );
      if (filteredRows.length === 0) {
        alert("Inga rader matchar de valda filtren.");
        return;
      }

      const categorySums: { [key: string]: number } = {};
      filteredRows.forEach((row) => {
        const category = row[seriesDimIndex]?.toString();
        if (seriesDim.selectedValues.includes(category)) {
          const value = parseFloat(row[measureIndex]) || 0;
          categorySums[category] = (categorySums[category] || 0) + value;
        }
      });

      const seriesData = seriesDim.selectedValues.map((category) => ({
        name: category,
        y: categorySums[category] || 0,
      }));

      chart.update({
        chart: {
          type: "pie",
        },
        title: {
          text: title || "Diagram",
        },
      });

      chart.xAxis[0].update({ visible: false });
      chart.yAxis[0].update({ visible: false });
      if (chart.yAxis[1]) chart.yAxis[1].update({ visible: false });

      chart.series.forEach((series: any) => series.remove(false));
      chart.addSeries({
        type: "pie",
        name: measure.name,
        data: seriesData,
      });
      chart.redraw();
      return;
    }

    if (xAxisDimensions.length === 0) {
      alert("Välj minst en dimension för x-axeln.");
      return;
    }

    const xAxisDimensionIndices = xAxisDimensions.map((dimName) =>
      dimensions.findIndex((dim) => dim.name === dimName)
    );

    const seriesDimensionIndex = seriesDimension
      ? dimensions.findIndex((dim) => dim.name === seriesDimension)
      : -1;

    const seriesCategories =
      seriesDimensionIndex !== -1
        ? dimensions.find((dim) => dim.name === seriesDimension)
            ?.selectedValues ?? []
        : [];

    const selectedXAxisValues = xAxisDimensions.map(
      (dimName) =>
        dimensions.find((dim) => dim.name === dimName)?.selectedValues ?? []
    );

    const filteredRows = jsonData.filter((row) =>
      dimensions.every((dimension) => {
        const dimensionIndex = dimensions.findIndex(
          (dim) => dim.name === dimension.name
        );
        if (dimensionIndex === -1) return true;
        const rowValue = row[dimensionIndex]?.toString();
        return dimension.selectedValues.includes(rowValue);
      })
    );

    if (filteredRows.length === 0) {
      alert("Inga rader matchar de valda filtren.");
      return;
    }

    chart.yAxis[0].update({
      title: {
        text: barMeasure ? barMeasure : "",
        style: { color: "blue" },
      },
    });

    chart.yAxis[1].update({
      title: {
        text: lineMeasure ? lineMeasure : "",
        style: { color: "red" },
      },
      opposite: true,
    });

    const aggregateMeasureData = (
      measureName: string,
      seriesValue: string | null
    ) => {
      const measureIndex =
        measures.findIndex((measure) => measure.name === measureName) +
        dimensions.length;

      if (xAxisDimensions.length === 2) {
        const mainCategories = selectedXAxisValues[0];
        const subCategories = selectedXAxisValues[1];

        return mainCategories.flatMap((mainCat) =>
          subCategories.map((subCat) => {
            const categoryRows = filteredRows.filter(
              (row) =>
                row[xAxisDimensionIndices[0]]?.toString() === mainCat &&
                row[xAxisDimensionIndices[1]]?.toString() === subCat &&
                (!seriesValue ||
                  row[seriesDimensionIndex]?.toString() === seriesValue)
            );
            return categoryRows.reduce((sum, row) => {
              const value = parseFloat(row[measureIndex]);
              return sum + (isNaN(value) ? 0 : value);
            }, 0);
          })
        );
      }

      return selectedXAxisValues[0].map((category) => {
        const categoryRows = filteredRows.filter(
          (row) =>
            row[xAxisDimensionIndices[0]]?.toString() === category &&
            (!seriesValue ||
              row[seriesDimensionIndex]?.toString() === seriesValue)
        );
        return categoryRows.reduce((sum, row) => {
          const value = parseFloat(row[measureIndex]);
          return sum + (isNaN(value) ? 0 : value);
        }, 0);
      });
    };

    const seriesData: any[] = [];
    const selectedMeasuresForOther = measures.filter(
      (measure) => measure.isSelected
    );

    const getSeriesType = (measure: Measure) => {
      if (chartType === "combo") {
        return measure.name === lineMeasure ? "spline" : "column";
      }
      return chartType === "line" ? "spline" : "column";
    };

    if (seriesDimension) {
      seriesCategories.forEach((seriesValue, index) => {
        selectedMeasuresForOther.forEach((measure) => {
          seriesData.push({
            name: `${seriesValue} - ${measure.name}`,
            type: getSeriesType(measure),
            data: aggregateMeasureData(measure.name, seriesValue),
            color: Highcharts.getOptions().colors?.[index % 10] || undefined,
            yAxis:
              chartType === "combo"
                ? measure.name === lineMeasure
                  ? 1
                  : 0
                : chartType === "line"
                ? 1
                : 0,
          });
        });
      });
    } else {
      selectedMeasuresForOther.forEach((measure, index) => {
        seriesData.push({
          name: measure.name,
          type: getSeriesType(measure),
          data: aggregateMeasureData(measure.name, null),
          color: Highcharts.getOptions().colors?.[index % 10] || undefined,
          yAxis:
            chartType === "combo"
              ? measure.name === lineMeasure
                ? 1
                : 0
              : chartType === "line"
              ? 1
              : 0,
        });
      });
    }

    const categories =
      xAxisDimensions.length === 2
        ? selectedXAxisValues[0].map((mainCategory) => ({
            name: mainCategory,
            categories: selectedXAxisValues[1].map(
              (subCategory) => subCategory
            ),
          }))
        : selectedXAxisValues[0];

    chart.xAxis[0].update({
      categories: categories,
    });

    chart.series.forEach((series: any) => series.remove(false));
    seriesData.forEach((series) => chart.addSeries(series, false));
    chart.redraw();
    chart.setTitle({ text: title || "Diagram" });
    chart.update({
      chart: {
        type:
          xAxisDimensions.length === 2
            ? "column"
            : getSeriesType(selectedMeasuresForOther[0]),
      },
    });
  };

  return userInterface(
    step,
    handleFileUpload,
    setStep,
    dimensions,
    setDimensions,
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
    seriesDimension,
    setSeriesDimension,
    handleGenerateChart,
    handleGoBack,
    containerRef
  );
};

export default StatistikGränssnitt;
