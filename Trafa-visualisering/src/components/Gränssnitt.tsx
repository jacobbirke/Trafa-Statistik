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
  const [title, setTitle] = useState<string>("Diagram utan titel");
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
        seriesIcons: seriesIcons
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

  const handleGoBack = () => {
    if (chart) {
      chart.destroy();
      setChart(null);
    }
    setStep("chart-configuration");
  };

  return (
    <div className="min-h-screen bg-trafaPrimary">
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
        setStep={setStep}
        setDimensions={setDimensions}
        setMeasures={setMeasures}
        setChartType={setChartType}
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
      />
    </div>
  );
};

export default StatistikGränssnitt;
