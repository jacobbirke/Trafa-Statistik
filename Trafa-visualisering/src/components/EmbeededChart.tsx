import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import { createChart } from "../utils/chartUtils";
import { handleGenerateChart } from "./handleGenerateChart";
import { ChartType, Dimension } from "../types/chartTypes";

interface EmbeddedChartProps {
  config: {
    dimensions: Dimension[];
    measures: any[];
    xAxisDimensions: string[];
    seriesDimension: string | null;
    chartType: ChartType;
    barMeasure: string | null;
    lineMeasure: string | null;
    is3D: boolean;
    title: string;
    jsonData: any[];
    seriesColors?: Record<string, string>;
    measureColors?: Record<string, string>;
    legendPosition: string;
    variwideWidthMeasure: string | null;
    variwideHeightMeasure: string | null;
    yAxisPrimaryTitle: string;
    yAxisSecondaryTitle: string;
    yAxisPrimaryMin?: number;
    yAxisPrimaryMax?: number;
    yAxisPrimaryTick?: number;
    yAxisSecondaryMin?: number;
    yAxisSecondaryMax?: number;
    yAxisSecondaryTick?: number;
    seriesIcons: Record<string, string>;
  };
}

const EmbeddedChart: React.FC<EmbeddedChartProps> = ({ config }) => {
  const [localDimensions, setLocalDimensions] = useState(config.dimensions);
  const [localIs3D, setLocalIs3D] = useState(config.is3D);
  const seriesColors = config.seriesColors || {};
  const measureColors = config.measureColors || {};
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<Highcharts.Chart | null>(
    null
  );

  useEffect(() => {
    if (containerRef.current) {
      const chart = createChart(containerRef.current);
      setChartInstance(chart);
      return () => chart.destroy();
    }
  }, []);

  useEffect(() => {
    if (chartInstance) {
      handleGenerateChart(
        chartInstance,
        {
          ...config,
          dimensions: localDimensions,
          is3D: localIs3D,
          seriesColors,
          measureColors,
          legendPosition: config.legendPosition || "bottom",
          variwideWidthMeasure: config.variwideWidthMeasure,
          variwideHeightMeasure: config.variwideHeightMeasure,
          yAxisPrimaryTitle: config.yAxisPrimaryTitle,
          yAxisPrimaryMin: config.yAxisPrimaryMin,
          yAxisPrimaryMax: config.yAxisPrimaryMax,
          yAxisPrimaryTick: config.yAxisPrimaryTick,
          yAxisSecondaryTitle: config.yAxisSecondaryTitle,
          yAxisSecondaryMin: config.yAxisSecondaryMin,
          yAxisSecondaryMax: config.yAxisSecondaryMax,
          yAxisSecondaryTick: config.yAxisSecondaryTick,
          seriesIcons: config.seriesIcons,
        },
        containerRef.current!
      );
    }
  }, [
    localDimensions,
    localIs3D,
    chartInstance,
    config,
    seriesColors,
    measureColors,
  ]);

  const handleFilterChange = (dimName: string, value: string) => {
    setLocalDimensions((prev) =>
      prev.map((d) =>
        d.name === dimName ? { ...d, selectedValues: [value] } : d
      )
    );
  };

  return (
    <div className="p-4">
      {localDimensions
        .filter(
          (dim) =>
            !config.xAxisDimensions.includes(dim.name) &&
            dim.name !== config.seriesDimension
        )
        .map((dim) => (
          <div
            key={dim.name}
            className="mb-5 flex justify-center items-center gap-4 flex-wrap"
          >
            <label className="block font-semibold mb-1">{dim.name}</label>
            <select
              value={dim.selectedValues[0] || ""}
              onChange={(e) => handleFilterChange(dim.name, e.target.value)}
              className="border rounded px-2 py-1"
            >
              {dim.allValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}

      <div
        ref={containerRef}
        className="w-full h-[600px] bg-gray-100 rounded"
      />

      {config.chartType !== "variwide" && (
        <label className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            checked={localIs3D}
            onChange={(e) => setLocalIs3D(e.target.checked)}
            className="mr-2"
          />
          Visa i 3D
        </label>
      )}
    </div>
  );
};

export default EmbeddedChart;
