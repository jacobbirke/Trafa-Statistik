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
    yAxisTitlePosition: string;
    yAxisSecondaryTitlePosition: string;
    confidenceMeasure: string | null;

  };
}

const EmbeddedChart: React.FC<EmbeddedChartProps> = ({ config }) => {
  const [localDimensions, setLocalDimensions] = useState(config.dimensions);
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
    const handleResize = () => {
      if (chartInstance) {
        chartInstance.reflow();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [chartInstance]);

  useEffect(() => {
    if (chartInstance) {
      handleGenerateChart(
        chartInstance,
        {
          ...config,
          dimensions: localDimensions,
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
          seriesIcons: config.seriesIcons || {},
          yAxisTitlePosition: config.yAxisTitlePosition,
          yAxisSecondaryTitlePosition: config.yAxisSecondaryTitlePosition,
          confidenceMeasure: config.confidenceMeasure

        },
        containerRef.current!
      );
    }
  }, [
    localDimensions,
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
    <div className="">
      <div className="flex justify-center items-center gap-4 flex-wrap mt-10">
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
      </div>

      <div ref={containerRef} className="w-full h-[90vh] min-h-[400px]" />
    </div>
  );
};

export default EmbeddedChart;
