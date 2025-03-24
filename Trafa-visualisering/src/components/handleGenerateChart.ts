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

  const validateFilteredRows = (rows: any[]): boolean => {
    if (rows.length === 0) {
      alert("Ingen data matchar det valda filtret.");
      return false;
    }
    return true;
  };

  const getLegendOptions = (position: string): Highcharts.LegendOptions => {
    switch (position) {
      case "top":
        return {
          align: "center",
          verticalAlign: "top",
          layout: "horizontal",
          floating: false,
        } as Highcharts.LegendOptions;
      case "bottom":
        return {
          align: "center",
          verticalAlign: "bottom",
          layout: "horizontal",
          floating: false,
        } as Highcharts.LegendOptions;
      case "left":
        return {
          align: "left",
          verticalAlign: "middle",
          layout: "vertical",
          floating: false,
        } as Highcharts.LegendOptions;
      case "inside":
        return {
          align: "right",
          verticalAlign: "top",
          layout: "vertical",
          floating: true,
          x: -50,
          y: 15,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderWidth: 0,
        } as Highcharts.LegendOptions;
      case "right":
      default:
        return {
          align: "right",
          verticalAlign: "middle",
          layout: "vertical",
          floating: false,
        } as Highcharts.LegendOptions;
    }
  };

  const customDefaultColors = [
    "#4C5CC5",
    "#52AF32",
    "#EC6608",
    "#0083AB",
    "#66B5CD",
    "#98CF84",
    "#437A2F",
    "#266174",
    "#004155",
    "#763304",
    "#295719",
    "#212A67",
    "#F9A164",
    "#A3D2E1",
    "#C1E2B5",
  ];

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
    if (!validateFilteredRows(filteredRows)) return;

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
          customDefaultColors[index % customDefaultColors.length],
      })),
    });
    currentChart.redraw();
    return;
  }

  // Variwide
  if (config.chartType === "variwide") {
    if (config.xAxisDimensions.length !== 1) {
      alert("Välj exakt en dimension för x-axeln.");
      return;
    }

    const selectedMeasures = config.measures.filter((m) => m.isSelected);
    if (selectedMeasures.length !== 2) {
      alert("Välj exakt två mått: ett för höjd och ett för bredd.");
      return;
    }

    if (!config.variwideWidthMeasure) {
      alert("Välj vilket mått som ska användas för bredden.");
      return;
    }
    if (!config.variwideHeightMeasure) {
      alert("Välj vilket mått som ska användas för höjden.");
      return;
    }

    const widthMeasureIndex =
      config.measures.findIndex((m) => m.name === config.variwideWidthMeasure) +
      config.dimensions.length;
    const heightMeasureIndex =
      config.measures.findIndex(
        (m) => m.name === config.variwideHeightMeasure
      ) + config.dimensions.length;

    const filteredRows = config.jsonData.filter((row) =>
      config.dimensions.every((dimension) => {
        const dimIndex = config.dimensions.findIndex(
          (d) => d.name === dimension.name
        );
        return (
          dimIndex === -1 ||
          dimension.selectedValues.includes(row[dimIndex]?.toString())
        );
      })
    );

    const categoryDim = config.dimensions.find(
      (d) => d.name === config.xAxisDimensions[0]
    );
    if (!categoryDim) {
      alert("Ingen kategori vald för x-axeln.");
      return;
    }

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
      alert("Ingen data matchar det valda filtret.");
      return;
    }

    const seriesData = categoryDim.selectedValues.map((category, index) => {
      const categoryRows = filteredRows.filter(
        (row) =>
          row[
            config.dimensions.findIndex((d) => d.name === categoryDim.name)
          ] === category
      );

      return {
        name: category,
        y: categoryRows.reduce(
          (sum: number, row) =>
            sum + (parseFloat(row[heightMeasureIndex]) || 0),
          0
        ),
        z: categoryRows.reduce(
          (sum: number, row) => sum + (parseFloat(row[widthMeasureIndex]) || 0),
          0
        ),
        color:
          config.seriesColors[category] ||
          customDefaultColors[index % customDefaultColors.length],
      };
    });

    while (currentChart.series.length > 0) {
      currentChart.series[0].remove(false);
    }

    currentChart.update(
      {
        chart: {
          type: "variwide",
          options3d: { enabled: false },
        },
        title: { text: title || "Variwide Diagram" },
        xAxis: {
          type: "category",
          categories: categoryDim.selectedValues,
        },
        yAxis: {
          title: { text: config.variwideHeightMeasure || "Värde" },
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          variwide: {
            tooltip: {
              pointFormat:
              `Höjd: <b><u>{point.y}</u></b>  (${config.variwideHeightMeasure})<br>` +
              `Bredd: <b><u>{point.z}</u></b>  (${config.variwideWidthMeasure})`
            },
          },
        },
      },
      false
    );

    currentChart.yAxis[0].update({
      title: {
        text: config.yAxisPrimaryTitle || "",
        style: { color: "" },
      },
      min: config.yAxisPrimaryMin,
      max: config.yAxisPrimaryMax,
      tickInterval: config.yAxisPrimaryTick,
    });

    currentChart.addSeries(
      {
        type: "variwide",
        name: "Variwide Series",
        data: seriesData,
        colorByPoint: true,
        // dataLabels: {
        //   enabled: true,
        //   format: "{point.y:.1f}",
        // },
      },
      false
    );

    currentChart.redraw();
    return;
  }

  // Stacked Area
  if (chartType === "stackedArea") {
    if (xAxisDimensions.length !== 1) {
      alert("För staplat områdesdiagram, välj exakt en dimension för x-axeln.");
      return;
    }
    if (!seriesDimension) {
      alert("För staplat områdesdiagram, välj en dimension för serier.");
      return;
    }
    const selectedMeasuresForStacked = measures.filter((m) => m.isSelected);
    if (selectedMeasuresForStacked.length !== 1) {
      alert("För staplat områdesdiagram, välj exakt ett mått.");
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
    if (!validateFilteredRows(filteredRows)) return;

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
      alert("Ingen serie vald.");
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
        type: "area",
        stacking: "normal",
        color:
          config.seriesColors[seriesValue] ||
          customDefaultColors[index % customDefaultColors.length],
      });
    });

    currentChart.update({
      chart: {
        type: "area",
        ...threeDOptions,
      },
      title: { text: title || "Diagram" },
      yAxis: {
        title: { text: measure.name || "Värde" },
      },
      plotOptions: {
        area: {
          stacking: "normal",
        },
      },
    });

    currentChart.yAxis[0].update({
      title: {
        text: config.yAxisPrimaryTitle || "",
        style: { color: "" },
      },
      min: config.yAxisPrimaryMin,
      max: config.yAxisPrimaryMax,
      tickInterval: config.yAxisPrimaryTick,
    });

    currentChart.xAxis[0].update({ categories });
    while (currentChart.series.length > 0) {
      currentChart.series[0].remove(false);
    }
    stackedSeriesData.forEach((serie) => currentChart.addSeries(serie, false));
    const legendOptions = getLegendOptions(config.legendPosition);
    currentChart.update({ legend: legendOptions }, false, false);
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
    if (!validateFilteredRows(filteredRows)) return;

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
          customDefaultColors[index % customDefaultColors.length],
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

    currentChart.yAxis[0].update({
      title: {
        text: config.yAxisPrimaryTitle || "",
        style: { color: "" },
      },
      min: config.yAxisPrimaryMin,
      max: config.yAxisPrimaryMax,
      tickInterval: config.yAxisPrimaryTick,
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

    const legendOptions = getLegendOptions(config.legendPosition);
    currentChart.update({ legend: legendOptions }, false, false);

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
    alert("Ingen data matchar det valda filtret.");
    return;
  }

  if (config.chartType === "line") {
    currentChart.yAxis[0].update({
      title: {
        text: config.yAxisPrimaryTitle || "",
        style: { color: "" },
      },
      min: config.yAxisPrimaryMin,
      max: config.yAxisPrimaryMax,
      tickInterval: config.yAxisPrimaryTick,
    });
  } else {
    currentChart.yAxis[0].update({
      title: {
        text: config.yAxisPrimaryTitle || (barMeasure ? barMeasure : ""),
        style: { color: "" },
      },
      min: config.yAxisPrimaryMin,
      max: config.yAxisPrimaryMax,
      tickInterval: config.yAxisPrimaryTick,
    });
    if (config.chartType === "combo" && currentChart.yAxis[1]) {
      currentChart.yAxis[1].update({
        title: {
          text: config.yAxisSecondaryTitle || (lineMeasure ? lineMeasure : ""),
          style: { color: "" },
        },
        min: config.yAxisSecondaryMin,
        max: config.yAxisSecondaryMax,
        tickInterval: config.yAxisSecondaryTick,
        opposite: true,
      });
    }
  }

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
            customDefaultColors[seriesIndex % customDefaultColors.length],
          yAxis:
            chartType === "combo" ? (measure.name === lineMeasure ? 1 : 0) : 0,
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
          config.seriesColors[measure.name] ||
          customDefaultColors[index % customDefaultColors.length],

        yAxis:
          chartType === "combo" ? (measure.name === lineMeasure ? 1 : 0) : 0,
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
  const legendOptions = getLegendOptions(config.legendPosition);
  currentChart.update({ legend: legendOptions }, false, false);

  currentChart.redraw();
};
