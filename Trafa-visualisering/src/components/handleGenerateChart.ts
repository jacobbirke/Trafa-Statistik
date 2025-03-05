import Highcharts from "highcharts";
import { Dimension, Measure, ChartType } from "../types/chartTypes";

type Config = {
  dimensions: Dimension[];
  measures: Measure[];
  xAxisDimensions: string[];
  seriesDimension: string | null;
  chartType: ChartType;
  barMeasure: string | null;
  lineMeasure: string | null;
  is3D: boolean;
  title: string;
  jsonData: any[];
  seriesColors: Record<string, string>;
  measureColors: Record<string, string>;
};

export const handleGenerateChart = (
  chart: Highcharts.Chart,
  config: Config,
  container: HTMLElement
) => {
  const {
    dimensions,
    measures,
    xAxisDimensions,
    jsonData,
    seriesDimension,
    is3D,
    barMeasure,
    lineMeasure,
    chartType,
    title,
  } = config;

  if (!jsonData) {
    alert("Data is missing.");
    return;
  }
  let currentChart = chart;
  if (!container) {
    alert("Diagramområdet saknas.");
    return;
  }

  const threeDOptions = is3D
    ? {
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          depth: 50,
          viewDistance: 25,
        },
      }
    : { options3d: { enabled: false } };

  // Paj
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

    const pieSeriesData = seriesDim.selectedValues.map((category) => ({
      name: category,
      y: categorySums[category] || 0,
    }));

    const pieThreeDOptions = is3D
      ? {
          options3d: {
            enabled: true,
            alpha: 40,
            beta: 0,
            depth: 50,
            viewDistance: 25,
          },
        }
      : { options3d: { enabled: false } };

    currentChart.update({
      chart: {
        type: "pie",
        ...pieThreeDOptions,
      },
      title: { text: title || "Diagram" },
      plotOptions: {
        pie: {
          depth: is3D ? 45 : 0,
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "{point.name}",
          },
        },
      },
    });
    currentChart.xAxis[0].update({ visible: false });
    currentChart.yAxis[0].update({ visible: false });
    if (currentChart.yAxis[1]) {
      currentChart.yAxis[1].update({ visible: false });
    }
    while (currentChart.series.length > 0) {
      currentChart.series[0].remove(false);
    }
    currentChart.addSeries({
      type: "pie",
      name: measure.name,
      data: pieSeriesData.map((point, index) => ({
        name: point.name,
        y: point.y,
        color:
          config.seriesColors[point.name] ||
          Highcharts.getOptions().colors?.[index % 10],
      })),
    });
    currentChart.redraw();
    return;
  }

  // Staplad kolumn
  if (chartType === "stacked") {
    if (xAxisDimensions.length !== 1) {
      alert("För staplat diagram, välj exakt en dimension för x-axeln.");
      return;
    }
    if (!seriesDimension) {
      alert("För staplat diagram, välj exakt en dimension för serier.");
      return;
    }
    const selectedMeasuresForStacked = measures.filter((m) => m.isSelected);
    if (selectedMeasuresForStacked.length !== 1) {
      alert("För staplat diagram, välj exakt ett mått.");
      return;
    }
    const measure = selectedMeasuresForStacked[0];
    const measureIndex =
      dimensions.length + measures.findIndex((m) => m.name === measure.name);
    const xAxisIndex = dimensions.findIndex(
      (dim) => dim.name === xAxisDimensions[0]
    );
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

    const categories = dimensions.find(
      (dim) => dim.name === xAxisDimensions[0]
    )?.selectedValues;
    if (!categories || categories.length === 0) {
      alert("Ingen kategori vald för x-axeln.");
      return;
    }
    const seriesCategories = dimensions.find(
      (dim) => dim.name === seriesDimension
    )?.selectedValues;
    if (!seriesCategories || seriesCategories.length === 0) {
      alert("Ingen serie vald för serier.");
      return;
    }
    const stackedSeriesData: any[] = [];
    seriesCategories.forEach((seriesValue, index) => {
      const data: number[] = [];
      categories.forEach((category) => {
        const total = filteredRows
          .filter((row) => {
            const cat = row[xAxisIndex]?.toString();
            const seriesVal = row[seriesDimIndex]?.toString();
            return cat === category && seriesVal === seriesValue;
          })
          .reduce((sum, row) => {
            const value = parseFloat(row[measureIndex]);
            return sum + (isNaN(value) ? 0 : value);
          }, 0);
        data.push(total);
      });
      stackedSeriesData.push({
        name: seriesValue,
        data,
        type: "column",
        color:
          config.seriesColors[seriesValue] ||
          Highcharts.getOptions().colors?.[index % 10],
      });
    });

    currentChart.update({
      chart: {
        type: "column",
        ...threeDOptions,
      },
      title: { text: title || "Diagram" },
      plotOptions: {
        column: {
          stacking: "normal",
          depth: is3D ? 25 : 0,
          grouping: true,
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
    });
    currentChart.xAxis[0].update({ categories });
    while (currentChart.series.length > 0) {
      currentChart.series[0].remove(false);
    }
    stackedSeriesData.forEach((serie) => currentChart.addSeries(serie, false));
    stackedSeriesData.forEach((serie) => {
      if (serie.type === "column") {
        serie.color = config.measureColors[barMeasure!] || serie.color;
      } else {
        serie.color = config.measureColors[lineMeasure!] || serie.color;
      }
    });
    currentChart.redraw();
    return;
  }

  // Generellt
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

  const filteredRowsGeneral = jsonData.filter((row) =>
    dimensions.every((dimension) => {
      const dimensionIndex = dimensions.findIndex(
        (dim) => dim.name === dimension.name
      );
      if (dimensionIndex === -1) return true;
      const rowValue = row[dimensionIndex]?.toString();
      return dimension.selectedValues.includes(rowValue);
    })
  );

  if (filteredRowsGeneral.length === 0) {
    alert("Inga rader matchar de valda filtren.");
    return;
  }

  currentChart.yAxis[0].update({
    title: {
      text: barMeasure ? barMeasure : "",
      style: { color: "DodgerBlue" },
    },
  });
  currentChart.yAxis[1].update({
    title: {
      text: lineMeasure ? lineMeasure : "",
      style: { color: "#b90066" },
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
          const categoryRows = filteredRowsGeneral.filter(
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
      const categoryRows = filteredRowsGeneral.filter(
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

  const generalSeriesData: any[] = [];
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
    seriesCategories.forEach((seriesValue, seriesIndex) => {
      selectedMeasuresForOther.forEach((measure) => {
        generalSeriesData.push({
          name: `${seriesValue} - ${measure.name}`,
          type: getSeriesType(measure),
          data: aggregateMeasureData(measure.name, seriesValue),
          color:
            config.seriesColors[seriesValue] ||
            Highcharts.getOptions().colors?.[seriesIndex % 10],
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
      generalSeriesData.push({
        name: measure.name,
        type: getSeriesType(measure),
        data: aggregateMeasureData(measure.name, null),
        color:
          config.measureColors[measure.name] ||
          Highcharts.getOptions().colors?.[index % 10],
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

  const categoriesGeneral =
    xAxisDimensions.length === 2
      ? selectedXAxisValues[0].map((mainCategory) => ({
          name: mainCategory,
          categories: selectedXAxisValues[1].map((subCategory) => subCategory),
        }))
      : selectedXAxisValues[0];

  currentChart.xAxis[0].update({ categories: categoriesGeneral as any });
  while (currentChart.series.length > 0) {
    currentChart.series[0].remove(false);
  }
  generalSeriesData.forEach((series) => currentChart.addSeries(series, false));
  currentChart.redraw();
  currentChart.setTitle({ text: title || "Diagram" });
  currentChart.update({
    chart: {
      type:
        xAxisDimensions.length === 2
          ? "column"
          : chartType === "line"
          ? "spline"
          : "column",
      ...threeDOptions,
    },
    plotOptions: {
      column: {
        depth: is3D ? 45 : undefined,
        grouping: true,
        pointPadding: 0.2,
        borderWidth: 0,
      },
      pie: {
        depth: is3D ? 45 : undefined,
      },
    },
  });
  currentChart.redraw();
};
