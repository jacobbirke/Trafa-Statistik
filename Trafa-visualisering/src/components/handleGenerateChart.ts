import Highcharts from "highcharts";
import { Dimension, Measure, ChartType } from "../types/chartTypes";

export type Config = {
  dimensions: Dimension[];
  measures: Measure[];
  xAxisDimensions: string[];
  seriesDimension: string | null;
  chartType: ChartType;
  barMeasure: string | null;
  lineMeasure: string | null;
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
  seriesIcons: Record<string, string>;
  yAxisTitlePosition: string;
  yAxisSecondaryTitlePosition: string;
  confidenceMeasure: string | null;
};

export const handleGenerateChart = (
  chart: Highcharts.Chart,
  config: Config,
  container: HTMLElement
) => {
  Highcharts.setOptions({
    lang: {
      decimalPoint: ",",
      thousandsSep: " ",
      numericSymbols: [],
    },
  });
  const {
    dimensions,
    measures,
    xAxisDimensions,
    jsonData,
    seriesDimension,
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

  //Stapeldiagram med felmarginal
  if (config.chartType === "errorbar-column") {
    if (config.xAxisDimensions.length === 0) {
      alert("Välj minst en dimension för x-axeln.");
      return;
    }

    const selectedMeasures = config.measures.filter((m) => m.isSelected);
    if (selectedMeasures.length !== 1) {
      alert("För ett kolumndiagram med felstaplar, välj exakt ett mått.");
      return;
    }

    const measureName = selectedMeasures[0].name;
    if (!config.confidenceMeasure) {
      alert("Välj ett konfidensintervall för det valda måttet.");
      return;
    }

    const baseHeader = measureName + "_M";
    const errorHeader = config.confidenceMeasure + "_KI";
    const headers = config.jsonData[0];
    const baseIdx = headers.indexOf(baseHeader);
    const errorIdx = headers.indexOf(errorHeader);

    if (baseIdx === -1 || errorIdx === -1) {
      alert("Hittade inte mått- eller felstapelkolumner för valt mått.");
      return;
    }

    const filteredRows = config.jsonData.slice(1).filter((row) =>
      dimensions.every((dimension) => {
        const dimIndex = dimensions.findIndex((d) => d.name === dimension.name);
        return dimension.selectedValues.includes(row[dimIndex]?.toString());
      })
    );

    if (filteredRows.length === 0) {
      alert("Ingen data matchar det valda filtret.");
      return;
    }

    const selectedXAxisValues = config.xAxisDimensions.map((dimName) => {
      const dim = dimensions.find((d) => d.name === dimName);
      return dim ? dim.selectedValues : [];
    });

    const xAxisDimIndices = config.xAxisDimensions.map((dimName) =>
      dimensions.findIndex((d) => d.name === dimName)
    );
    if (xAxisDimIndices.includes(-1)) {
      alert("Ogiltiga x-axel dimensioner.");
      return;
    }

    const xAxisCombinations: string[][] = [];
    if (config.xAxisDimensions.length === 1) {
      xAxisCombinations.push(...selectedXAxisValues[0].map((cat) => [cat]));
    } else if (config.xAxisDimensions.length === 2) {
      for (const mainCat of selectedXAxisValues[0]) {
        for (const subCat of selectedXAxisValues[1]) {
          xAxisCombinations.push([mainCat, subCat]);
        }
      }
    }

    const seriesDim = config.seriesDimension
      ? dimensions.find((d) => d.name === config.seriesDimension)
      : null;
    const seriesValues = seriesDim ? seriesDim.selectedValues : [measureName];
    const measureUnit = selectedMeasures[0].unit || "";

    while (chart.series.length > 0) {
      chart.series[0].remove(false);
    }

    chart.update(
      {
        chart: { type: "column", marginLeft: 95, marginTop: title ? 80 : 50 },
        title: { text: config.title || "" },
        xAxis:
          config.xAxisDimensions.length === 2
            ? {
                type: "category",
                categories: selectedXAxisValues[0],
                labels: {
                  formatter: function () {
                    return this.value as string;
                  },
                },
              }
            : { categories: selectedXAxisValues[0] as string[] },
      },
      false
    );

    seriesValues.forEach((seriesValue, seriesIndex) => {
      const seriesRows = seriesDim
        ? filteredRows.filter((row) => {
            const dimIndex = dimensions.findIndex(
              (d) => d.name === seriesDim.name
            );
            return row[dimIndex]?.toString() === seriesValue;
          })
        : filteredRows;

      const columnData: number[] = xAxisCombinations.map((combination) => {
        const row = seriesRows.find((row) =>
          xAxisDimIndices.every(
            (dimIdx, i) => row[dimIdx]?.toString() === combination[i]
          )
        );
        return row ? parseFloat(row[baseIdx]) || 0 : 0;
      });

      const errorData: [number, number][] = xAxisCombinations.map(
        (combination) => {
          const row = seriesRows.find((row) =>
            xAxisDimIndices.every(
              (dimIdx, i) => row[dimIdx]?.toString() === combination[i]
            )
          );
          const baseVal = row ? parseFloat(row[baseIdx]) || 0 : 0;
          const errorVal = row ? parseFloat(row[errorIdx]) || 0 : 0;
          return [baseVal - errorVal, baseVal + errorVal] as [number, number];
        }
      );

      const seriesName = seriesDim ? (seriesValue as string) : measureName;
      const color = seriesDim
        ? config.seriesColors[seriesValue as string] ||
          customDefaultColors[seriesIndex % customDefaultColors.length]
        : config.measureColors[measureName] || customDefaultColors[0];

      chart.addSeries(
        {
          type: "column",
          name: seriesName,
          data: columnData,
          color: color,
          tooltip: {
            pointFormatter: function (this: Highcharts.Point) {
              const value = this.y ?? 0;
              const formattedValue =
                value % 1 === 0
                  ? Highcharts.numberFormat(value, 0, ",", " ")
                  : Highcharts.numberFormat(value, 2, ",", " ");
              return `<span style="color:${this.color}">●</span> ${seriesName}: 
                  <b>${formattedValue}${
                measureUnit ? " " + measureUnit : ""
              }</b><br>`;
            },
          },
        } as Highcharts.SeriesColumnOptions,
        false
      );

      chart.addSeries(
        {
          type: "errorbar",
          linkedTo: ":previous",
          data: errorData,
          color:
            config.confidenceMeasure &&
            config.measureColors[config.confidenceMeasure]
              ? config.measureColors[config.confidenceMeasure]
              : "#000000",
          tooltip: {
            pointFormatter: function (this: Highcharts.Point) {
              const low = this.low ?? 0;
              const high = this.high ?? 0;
              const formattedLow =
                low % 1 === 0
                  ? Highcharts.numberFormat(low, 0, ",", " ")
                  : Highcharts.numberFormat(low, 2, ",", " ");
              const formattedHigh =
                high % 1 === 0
                  ? Highcharts.numberFormat(high, 0, ",", " ")
                  : Highcharts.numberFormat(high, 2, ",", " ");
              return `Felmarginal: ${formattedLow} - ${formattedHigh}${
                measureUnit ? " " + measureUnit : ""
              }<br>`;
            },
          },
        } as Highcharts.SeriesErrorbarOptions,
        false
      );
    });

    currentChart.yAxis[0].update({
      title: {
        text: config.yAxisPrimaryTitle || "",
        style: {
          color: "",
          whiteSpace: "nowrap",
        },
        rotation:
          config.yAxisTitlePosition === "rotated"
            ? 90
            : config.yAxisTitlePosition === "top"
            ? 0
            : 270,
        align: config.yAxisTitlePosition === "top" ? "high" : "middle",
        textAlign: "center",
        x:
          config.yAxisTitlePosition === "rotated"
            ? -17
            : config.yAxisTitlePosition === "top"
            ? 50
            : -8,
        y: config.yAxisTitlePosition === "top" ? (title ? -20 : -12) : 0,
        reserveSpace: false,
        margin: config.yAxisTitlePosition === "top" ? 10 : 5,
        offset: 0,
      },

      min: config.yAxisPrimaryMin,
      max: config.yAxisPrimaryMax,
      tickInterval: config.yAxisPrimaryTick,
    });

    // Final chart updates
    const legendOptions = getLegendOptions(config.legendPosition);
    chart.update({ legend: legendOptions }, false, false);
    chart.redraw();
    return;
  }

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

    currentChart.update({
      chart: {
        type: "pie",
      },
      title: { text: title || "" },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            formatter: function (this: Highcharts.PointLabelObject) {
              const value = this.y ?? 0;
              const formattedValue =
                value % 1 === 0
                  ? Highcharts.numberFormat(value, 0, ",", " ")
                  : Highcharts.numberFormat(value, 2, ",", " ");
              return `${this.point.name}: ${formattedValue}`;
            },
          },
        },
      },
      series: [
        {
          type: "pie",
          name: measure.name,
          data: pieSeriesData.map((point, index) => ({
            name: point.name,
            y: point.y,
            color:
              config.seriesColors[point.name] ||
              customDefaultColors[index % customDefaultColors.length],
          })),
          unit: measure.unit,
        },
      ],
    });
    currentChart.xAxis[0].update({ visible: false });
    currentChart.yAxis[0].update({ visible: false });
    if (currentChart.yAxis[1]) {
      currentChart.yAxis[1].update({ visible: false });
    }
    currentChart.redraw();
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
      unit: measure.unit,
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
          marginLeft: 80,
          marginTop: title ? 80 : 50,
        },
        title: { text: title || "" },
        xAxis: {
          type: "category",
          categories: categoryDim.selectedValues,
        },
        yAxis: {
          title: { text: config.variwideHeightMeasure || "" },
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          variwide: {
            tooltip: {
              pointFormatter: function (this: any) {
                const heightMeasure = config.measures.find(
                  (m) => m.name === config.variwideHeightMeasure
                );
                const widthMeasure = config.measures.find(
                  (m) => m.name === config.variwideWidthMeasure
                );

                const yVal =
                  (this.y ?? 0) % 1 === 0
                    ? Highcharts.numberFormat(this.y ?? 0, 0, ",", " ")
                    : Highcharts.numberFormat(this.y ?? 0, 2, ",", " ");
                const zVal =
                  (this.z ?? 0) % 1 === 0
                    ? Highcharts.numberFormat(this.z ?? 0, 0, ",", " ")
                    : Highcharts.numberFormat(this.z ?? 0, 2, ",", " ");

                return (
                  `Höjd: <b><u>${yVal}${
                    heightMeasure?.unit ? " " + heightMeasure.unit : ""
                  }</u></b> (${config.variwideHeightMeasure})<br>` +
                  `Bredd: <b><u>${zVal}${
                    widthMeasure?.unit ? " " + widthMeasure.unit : ""
                  }</u></b> (${config.variwideWidthMeasure})`
                );
              },
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
        rotation:
          config.yAxisTitlePosition === "rotated"
            ? 90
            : config.yAxisTitlePosition === "top"
            ? 0
            : 270,
        align: config.yAxisTitlePosition === "top" ? "high" : "middle",
        x:
          config.yAxisTitlePosition === "rotated"
            ? -10
            : config.yAxisTitlePosition === "top"
            ? 0
            : -5,
        y: config.yAxisTitlePosition === "top" ? (title ? -20 : -10) : 0,
        margin: config.yAxisTitlePosition === "top" ? -50 : 5,
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
      alert("För staplad yta, välj exakt en dimension för x-axeln.");
      return;
    }
    if (!seriesDimension) {
      alert("För staplad yta, välj en dimension för serier.");
      return;
    }
    const selectedMeasuresForStacked = measures.filter((m) => m.isSelected);
    if (selectedMeasuresForStacked.length !== 1) {
      alert("För staplad yta, välj exakt ett mått.");
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
        unit: measure.unit,
      });
    });

    currentChart.update({
      chart: {
        marginLeft: 90,
        marginTop: title ? 80 : 50,
        type: "area",
      },
      title: { text: title || "" },
      yAxis: {
        title: { text: measure.name || "" },
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
        style: {
          color: "",
          whiteSpace: "nowrap",
        },
        rotation:
          config.yAxisTitlePosition === "rotated"
            ? 90
            : config.yAxisTitlePosition === "top"
            ? 0
            : 270,
        align: config.yAxisTitlePosition === "top" ? "high" : "middle",
        textAlign: "center",
        x:
          config.yAxisTitlePosition === "rotated"
            ? -17
            : config.yAxisTitlePosition === "top"
            ? 40
            : -5,
        y: config.yAxisTitlePosition === "top" ? (title ? -20 : -10) : 0,
        reserveSpace: false,
        margin: config.yAxisTitlePosition === "top" ? 10 : 5,
        offset: 0,
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
      alert("För staplad kolumn, välj exakt en dimension för x-axeln.");
      return;
    }
    if (!seriesDimension) {
      alert("För staplad kolumn, välj exakt en dimension för serier.");
      return;
    }
    const selectedMeasuresForStacked = measures.filter((m) => m.isSelected);
    if (selectedMeasuresForStacked.length !== 1) {
      alert("För staplad kolumn, välj exakt ett mått.");
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
        unit: measure.unit,
      });
    });

    currentChart.update({
      chart: {
        marginLeft: 90,
        marginTop: title ? 80 : 50,
        type: "column",
      },
      title: { text: title || "" },
      plotOptions: {
        column: {
          stacking: "normal",
          grouping: true,
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
    });

    currentChart.yAxis[0].update({
      title: {
        text: config.yAxisPrimaryTitle || "",
        style: {
          color: "",
          whiteSpace: "nowrap",
        },
        rotation:
          config.yAxisTitlePosition === "rotated"
            ? 90
            : config.yAxisTitlePosition === "top"
            ? 0
            : 270,
        align: config.yAxisTitlePosition === "top" ? "high" : "middle",
        textAlign: "center",
        x:
          config.yAxisTitlePosition === "rotated"
            ? -17
            : config.yAxisTitlePosition === "top"
            ? 40
            : -5,
        y: config.yAxisTitlePosition === "top" ? (title ? -20 : -10) : 0,
        reserveSpace: false,
        margin: config.yAxisTitlePosition === "top" ? 10 : 5,
        offset: 0,
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
        style: {
          color: "",
          whiteSpace: "nowrap",
        },
        rotation:
          config.yAxisTitlePosition === "rotated"
            ? 90
            : config.yAxisTitlePosition === "top"
            ? 0
            : 270,
        align: config.yAxisTitlePosition === "top" ? "high" : "middle",
        textAlign: "center",
        x:
          config.yAxisTitlePosition === "rotated"
            ? -17
            : config.yAxisTitlePosition === "top"
            ? 40
            : -5,
        y: config.yAxisTitlePosition === "top" ? (title ? -20 : -10) : 0,
        reserveSpace: false,
        margin: config.yAxisTitlePosition === "top" ? 10 : 5,
        offset: 0,
      },
      min: config.yAxisPrimaryMin,
      max: config.yAxisPrimaryMax,
      tickInterval: config.yAxisPrimaryTick,
    });
  } else {
    currentChart.yAxis[0].update({
      title: {
        text: config.yAxisPrimaryTitle || "",
        style: {
          color: "",
          whiteSpace: "nowrap",
        },
        rotation:
          config.yAxisTitlePosition === "rotated"
            ? 90
            : config.yAxisTitlePosition === "top"
            ? 0
            : 270,
        align: config.yAxisTitlePosition === "top" ? "high" : "middle",
        textAlign: "center",
        x:
          config.yAxisTitlePosition === "rotated"
            ? -17
            : config.yAxisTitlePosition === "top"
            ? 40
            : -5,
        y: config.yAxisTitlePosition === "top" ? (title ? -20 : -10) : 0,
        reserveSpace: false,
        margin: config.yAxisTitlePosition === "top" ? 10 : 5,
        offset: 0,
      },

      min: config.yAxisPrimaryMin,
      max: config.yAxisPrimaryMax,
      tickInterval: config.yAxisPrimaryTick,
    });
    if (config.chartType === "combo") {
      currentChart.yAxis[1].update({
        title: {
          text: config.yAxisSecondaryTitle || "",
          style: { color: "" },
          rotation:
            config.yAxisSecondaryTitlePosition === "rotated"
              ? 90
              : config.yAxisSecondaryTitlePosition === "top"
              ? 0
              : 270,
          align:
            config.yAxisSecondaryTitlePosition === "top" ? "high" : "middle",
          x:
            config.yAxisSecondaryTitlePosition === "rotated"
              ? 10
              : config.yAxisSecondaryTitlePosition === "top"
              ? -80
              : 20,
          y:
            config.yAxisSecondaryTitlePosition === "top"
              ? title
                ? -25
                : -10
              : 0,
          margin: config.yAxisSecondaryTitlePosition === "top" ? 20 : 0,
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
  let selectedMeasuresForOther: Measure[] = [];
  if (chartType === "combo") {
    if (config.barMeasure) {
      const bar = measures.find((m) => m.name === config.barMeasure);
      if (bar) selectedMeasuresForOther.push(bar);
    }
    if (config.lineMeasure) {
      const line = measures.find((m) => m.name === config.lineMeasure);
      if (line) selectedMeasuresForOther.push(line);
    }
  } else {
    selectedMeasuresForOther = measures.filter((measure) => measure.isSelected);
  }

  const getSeriesType = (measure: Measure) => {
    if (chartType === "combo") {
      return measure.name === config.lineMeasure ? "spline" : "column";
    }
    return chartType === "line" ? "spline" : "column";
  };

  if (seriesDimension) {
    seriesCategories.forEach((seriesValue) => {
      selectedMeasuresForOther.forEach((measure) => {
        const applyMarker =
          chartType === "line" ||
          (chartType === "combo" && measure.name === lineMeasure);
        const defaultMarkerSymbols = [
          "circle",
          "square",
          "diamond",
          "triangle",
          "triangle-down",
        ];
        const seriesIndex = seriesCategories.indexOf(seriesValue);
        const defaultIcon =
          defaultMarkerSymbols[seriesIndex % defaultMarkerSymbols.length];
        const chosenIcon =
          config.seriesIcons[seriesValue] === undefined
            ? defaultIcon
            : config.seriesIcons[seriesValue];
        const seriesData: any = {
          name: `${seriesValue} - ${measure.name}`,
          type: getSeriesType(measure),
          data: aggregateMeasureData(measure.name, seriesValue),
          color:
            config.seriesColors[seriesValue] ||
            customDefaultColors[seriesIndex % customDefaultColors.length],
          yAxis:
            chartType === "combo" ? (measure.name === lineMeasure ? 1 : 0) : 0,
          unit: measure.unit,
        };
        if (applyMarker) {
          seriesData.marker =
            chosenIcon === ""
              ? { enabled: false }
              : {
                  enabled: true,
                  symbol: chosenIcon,
                  radius: 6,
                  lineWidth: 1,
                  lineColor: "#ffffff",
                };
        }
        generalSeriesData.push(seriesData);
      });
    });
  } else {
    selectedMeasuresForOther.forEach((measure, index) => {
      const includeMarker =
        chartType === "line" ||
        (chartType === "combo" && measure.name === lineMeasure);
      const defaultMarkerSymbols = [
        "circle",
        "square",
        "diamond",
        "triangle",
        "triangle-down",
      ];
      const defaultIcon =
        defaultMarkerSymbols[index % defaultMarkerSymbols.length];
      const chosenIcon =
        config.seriesIcons[measure.name] === undefined
          ? defaultIcon
          : config.seriesIcons[measure.name];
      const seriesData: any = {
        name: measure.name,
        type: getSeriesType(measure),
        data: aggregateMeasureData(measure.name, null),
        color:
          config.measureColors[measure.name] ||
          customDefaultColors[index % customDefaultColors.length],
        yAxis:
          chartType === "combo" ? (measure.name === lineMeasure ? 1 : 0) : 0,
        unit: measure.unit,
      };
      if (includeMarker) {
        seriesData.marker =
          chosenIcon === ""
            ? { enabled: false }
            : {
                enabled: true,
                symbol: chosenIcon,
                radius: 6,
                lineWidth: 1,
                lineColor: "#ffffff",
              };
      }
      generalSeriesData.push(seriesData);
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
  currentChart.setTitle({ text: title || "" });

  currentChart.update({
    chart: {
      marginLeft: 80,
      marginRight:
        config.chartType === "column" || config.chartType === "line" ? 0 : 80,
      type:
        xAxisDimensions.length === 2
          ? "column"
          : chartType === "line"
          ? "spline"
          : "column",
    },

    tooltip: {
      valuePrefix: "",
      valueSuffix: "",
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        const getUnit = (series: Highcharts.Series) => {
          return (
            (series.userOptions as any)?.unit ||
            (series.options as any)?.unit ||
            ""
          );
        };

        if (!this.points) {
          const point = this.point || this;
          const value = point.y ?? 0;
          const formattedValue =
            value % 1 === 0
              ? Highcharts.numberFormat(value, 0, ",", " ")
              : Highcharts.numberFormat(value, 2, ",", " ");
          const color = point.color || this.series.color;
          const unit = getUnit(this.series);

          return `<span style="color:${color}">●</span> ${
            this.series.name
          }: <b>${formattedValue}${unit ? " " + unit : ""}</b>`;
        }

        return (this.points || []).reduce((s, point) => {
          const value = point.y ?? 0;
          const formattedValue =
            value % 1 === 0
              ? Highcharts.numberFormat(value, 0, ",", " ")
              : Highcharts.numberFormat(value, 2, ",", " ");
          const unit = getUnit(point.series);

          return (
            s +
            `<br/><span style="color:${
              point.color || point.series.color
            }">●</span> ` +
            `${point.series.name}: <b>${formattedValue}${
              unit ? " " + unit : ""
            }</b>`
          );
        }, `<span style="font-size: 10px">${this.x}</span>`);
      },
    },

    plotOptions: {
      column: {
        grouping: true,
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
          formatter: function (this: Highcharts.PointLabelObject) {
            const value = this.y ?? 0;
            return value % 1 === 0
              ? Highcharts.numberFormat(value, 0, ",", " ")
              : Highcharts.numberFormat(value, 2, ",", " ");
          },
        },
      },
      pie: {},
      series: {
        marker: {
          enabled: true,
          radius: 6,
          lineWidth: 1,
          lineColor: "#ffffff",
        },
      },
      spline: {
        dataLabels: {
          formatter: function (this: Highcharts.PointLabelObject) {
            const value = this.y ?? 0;
            return value % 1 === 0
              ? Highcharts.numberFormat(value, 0, ",", " ")
              : Highcharts.numberFormat(value, 2, ",", " ");
          },
        },
      },
    },
  });
  const legendOptions = getLegendOptions(config.legendPosition);
  currentChart.update({ legend: legendOptions }, false, false);

  currentChart.redraw();
};
