import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import * as XLSX from "xlsx";
import HighchartsGroupedCategories from "highcharts-grouped-categories";
import Highcharts3D from "highcharts/highcharts-3d";
import Variwide from "highcharts/modules/variwide";
import { createChart } from "../utils/chartUtils";

import { ChartWizard } from "./ChartWizard/ChartWizard";
import { ChartType, Dimension, Measure, WizardStep } from "../types/chartTypes";
import { handleGenerateChart } from "./handleGenerateChart";

HighchartsGroupedCategories(Highcharts);
Highcharts3D(Highcharts);
Variwide(Highcharts);

const StatistikGränssnitt: React.FC = () => {
  const [step, setStep] = useState<WizardStep>("input-file");
  const [chartType, setChartType] = useState<ChartType>("column");
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [xAxisDimensions, setXAxisDimensions] = useState<string[]>([]);
  const [seriesDimension, setSeriesDimension] = useState<string | null>(null);
  const [barMeasure, setBarMeasure] = useState<string | null>(null);
  const [lineMeasure, setLineMeasure] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [is3D, setIs3D] = useState<boolean>(false);
  const [chart, setChart] = useState<any>(null);
  const [seriesColors, setSeriesColors] = useState<Record<string, string>>({});
  const [seriesIcons, setSeriesIcons] = useState<Record<string, string>>({});
  const [measureColors, setMeasureColors] = useState<Record<string, string>>(
    {}
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [legendPosition, setLegendPosition] = useState<string>("bottom");
  const [variwideWidthMeasure, setVariwideWidthMeasure] = useState<
    string | null
  >(null);
  const [variwideHeightMeasure, setVariwideHeightMeasure] = useState<
    string | null
  >(null);
  const [yAxisPrimaryTitle, setYAxisPrimaryTitle] = useState("");
  const [yAxisSecondaryTitle, setYAxisSecondaryTitle] = useState("");
  const [yAxisPrimaryMin, setYAxisPrimaryMin] = useState<number | undefined>(
    undefined
  );
  const [yAxisPrimaryMax, setYAxisPrimaryMax] = useState<number | undefined>(
    undefined
  );
  const [yAxisPrimaryTick, setYAxisPrimaryTick] = useState<number | undefined>(
    undefined
  );
  const [yAxisSecondaryMin, setYAxisSecondaryMin] = useState<
    number | undefined
  >(undefined);
  const [yAxisSecondaryMax, setYAxisSecondaryMax] = useState<
    number | undefined
  >(undefined);
  const [yAxisSecondaryTick, setYAxisSecondaryTick] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    if (step === "review-generate" && chart) {
      chart.reflow();
    }
  }, [step, chart]);

  function localHandleGenerateChart() {
    if (!containerRef.current) return;
    let currentChart = chart;
    if (!currentChart) {
      currentChart = createChart(containerRef.current);
      setChart(currentChart);
    }
    handleGenerateChart(
      currentChart,
      {
        barMeasure,
        chartType,
        dimensions,
        is3D,
        jsonData,
        lineMeasure,
        measures,
        seriesDimension,
        title,
        xAxisDimensions,
        seriesColors,
        measureColors,
        legendPosition,
        variwideWidthMeasure,
        variwideHeightMeasure,
        yAxisPrimaryTitle,
        yAxisSecondaryTitle,
        yAxisPrimaryMin,
        yAxisPrimaryMax,
        yAxisPrimaryTick,
        yAxisSecondaryMin,
        yAxisSecondaryMax,
        yAxisSecondaryTick,
        seriesIcons: seriesIcons,
      },
      containerRef.current
    );
  }

  useEffect(() => {
    if (step === "review-generate") {
      localHandleGenerateChart();
    }
  }, [dimensions]);

  useEffect(() => {
    if (step !== "review-generate" && chart) {
      chart.destroy();
      setChart(null);
    }
  }, [step]);

  useEffect(() => {
    if (step === "review-generate" && chart) {
      localHandleGenerateChart();
    }
  }, [is3D]);

  useEffect(() => {
    if (seriesDimension) {
      const seriesDim = dimensions.find((d) => d.name === seriesDimension);
      if (seriesDim) {
        setSeriesColors((prevColors) => {
          const newColors = { ...prevColors };
          seriesDim.selectedValues.forEach((val) => {
            if (!newColors[val]) {
              newColors[val] = "";
            }
          });
          return newColors;
        });
      }
    }
  }, [seriesDimension, dimensions, setSeriesColors]);

  const handleChartTypeChange: React.Dispatch<
    React.SetStateAction<ChartType>
  > = (newChartType) => {
    if (typeof newChartType === "function") {
      setChartType(newChartType);
    } else {
      setChartType(newChartType);
      setXAxisDimensions([]);
      setSeriesDimension(null);
      setBarMeasure(null);
      setLineMeasure(null);
      setVariwideWidthMeasure(null);
      setVariwideHeightMeasure(null);
    }
  };

  const handleSetStep: React.Dispatch<React.SetStateAction<WizardStep>> = (
    value
  ) => {
    const newStep = typeof value === "function" ? value(step) : value;

    if (newStep === "select-diagram-type") {
      setXAxisDimensions([]);
      setSeriesDimension(null);
      setBarMeasure(null);
      setLineMeasure(null);
      setVariwideWidthMeasure(null);
      setVariwideHeightMeasure(null);
    }
    setStep(newStep);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      const data = event.target?.result;
      if (!data) return;

      try {
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
        });

        if (jsonData.length < 2) {
          alert("Filen innehåller inte tillräckligt med data");
          return;
        }

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];
        const dimensionHeaders: string[] = [];
        const measureHeaders: string[] = [];

        headers.forEach((header) => {
          if (typeof header === "string") {
            if (header.endsWith("_M")) {
              measureHeaders.push(header);
            } else {
              dimensionHeaders.push(header);
            }
          }
        });

        const dimensionsData: Dimension[] = dimensionHeaders.map((header) => {
          const headerIndex = headers.indexOf(header);
          const uniqueValues = new Set<string>();

          rows.forEach((row) => {
            if (row[headerIndex] !== undefined) {
              uniqueValues.add(String(row[headerIndex]));
            }
          });

          return {
            name: header,
            allValues: Array.from(uniqueValues),
            selectedValues: [],
            unit: "",
          };
        });

        const measuresData: Measure[] = measureHeaders.map((header) => ({
          name: header.replace("_M", ""),
          unit: "",
          isSelected: false,
        }));
        const processedData = rows.map((row) =>
          row.map((cell) => {
            if (typeof cell === "string" && cell.includes(",")) {
              return parseFloat(cell.replace(",", ".")) || cell;
            }
            return cell;
          })
        );

        setTitle("");
        setDimensions(dimensionsData);
        setMeasures(measuresData);
        setJsonData(processedData);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Det uppstod ett fel vid bearbetning av filen");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleGoBack = () => {
    if (chart) {
      chart.destroy();
      setChart(null);
    }
    setStep("chart-configuration");
  };

  return (
    <div className="min-h-screen bg-trafaPrimary pt-6">
      <ChartWizard
        step={step}
        chartType={chartType}
        dimensions={dimensions}
        measures={measures}
        xAxisDimensions={xAxisDimensions}
        seriesDimension={seriesDimension}
        barMeasure={barMeasure}
        lineMeasure={lineMeasure}
        is3D={is3D}
        containerRef={containerRef}
        handleFileUpload={handleFileUpload}
        setDimensions={setDimensions}
        setMeasures={setMeasures}
        setXAxisDimensions={setXAxisDimensions}
        setSeriesDimension={setSeriesDimension}
        setBarMeasure={setBarMeasure}
        setLineMeasure={setLineMeasure}
        handleGenerateChart={localHandleGenerateChart}
        handleGoBack={handleGoBack}
        setIs3D={setIs3D}
        jsonData={jsonData}
        title={title}
        setTitle={setTitle}
        seriesColors={seriesColors}
        measureColors={measureColors}
        setSeriesColors={setSeriesColors}
        setMeasureColors={setMeasureColors}
        legendPosition={legendPosition}
        setLegendPosition={setLegendPosition}
        variwideWidthMeasure={variwideWidthMeasure}
        setVariwideWidthMeasure={setVariwideWidthMeasure}
        variwideHeightMeasure={variwideHeightMeasure}
        setVariwideHeightMeasure={setVariwideHeightMeasure}
        yAxisPrimaryTitle={yAxisPrimaryTitle}
        setYAxisPrimaryTitle={setYAxisPrimaryTitle}
        yAxisSecondaryTitle={yAxisSecondaryTitle}
        setYAxisSecondaryTitle={setYAxisSecondaryTitle}
        yAxisPrimaryMin={yAxisPrimaryMin}
        setYAxisPrimaryMin={setYAxisPrimaryMin}
        yAxisPrimaryMax={yAxisPrimaryMax}
        setYAxisPrimaryMax={setYAxisPrimaryMax}
        yAxisPrimaryTick={yAxisPrimaryTick}
        setYAxisPrimaryTick={setYAxisPrimaryTick}
        yAxisSecondaryMin={yAxisSecondaryMin}
        setYAxisSecondaryMin={setYAxisSecondaryMin}
        yAxisSecondaryMax={yAxisSecondaryMax}
        setYAxisSecondaryMax={setYAxisSecondaryMax}
        yAxisSecondaryTick={yAxisSecondaryTick}
        setYAxisSecondaryTick={setYAxisSecondaryTick}
        seriesIcons={seriesIcons}
        setSeriesIcons={setSeriesIcons}
        setChartType={handleChartTypeChange}
        setStep={handleSetStep}
      />
    </div>
  );
};

export default StatistikGränssnitt;
