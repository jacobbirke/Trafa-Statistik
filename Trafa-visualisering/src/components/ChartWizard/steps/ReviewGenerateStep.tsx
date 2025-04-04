import React, { useEffect, useState } from "react";
import { Button } from "../../UI/Button";
import {
  Dimension,
  Measure,
  ChartType,
  WizardStep,
} from "../../../types/chartTypes";
import { Card } from "../../UI/Card";

interface Props {
  dimensions: Dimension[];
  setDimensions: React.Dispatch<React.SetStateAction<Dimension[]>>;
  measures: Measure[];
  setMeasures: React.Dispatch<React.SetStateAction<Measure[]>>;
  xAxisDimensions: string[];
  setXAxisDimensions: React.Dispatch<React.SetStateAction<string[]>>;
  seriesDimension: string | null;
  setSeriesDimension: React.Dispatch<React.SetStateAction<string | null>>;
  chartType: ChartType;
  barMeasure: string | null;
  setBarMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  lineMeasure: string | null;
  setLineMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  is3D: boolean;
  setIs3D: React.Dispatch<React.SetStateAction<boolean>>;
  containerRef: React.RefObject<HTMLDivElement>;
  handleGenerateChart: (config: any) => void;
  handleGoBack: () => void;
  setStep: (step: WizardStep) => void;
  jsonData: any[];
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  seriesColors: Record<string, string>;
  setSeriesColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  measureColors: Record<string, string>;
  setMeasureColors: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  legendPosition: string;
  setLegendPosition: React.Dispatch<React.SetStateAction<string>>;
  variwideWidthMeasure: string | null;
  setVariwideWidthMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  variwideHeightMeasure: string | null;
  setVariwideHeightMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  yAxisPrimaryTitle: string;
  setYAxisPrimaryTitle: React.Dispatch<React.SetStateAction<string>>;
  yAxisSecondaryTitle: string;
  setYAxisSecondaryTitle: React.Dispatch<React.SetStateAction<string>>;
  yAxisPrimaryMin?: number;
  setYAxisPrimaryMin: React.Dispatch<React.SetStateAction<number | undefined>>;
  yAxisPrimaryMax?: number;
  setYAxisPrimaryMax: React.Dispatch<React.SetStateAction<number | undefined>>;
  yAxisPrimaryTick?: number;
  setYAxisPrimaryTick: React.Dispatch<React.SetStateAction<number | undefined>>;
  yAxisSecondaryMin?: number;
  setYAxisSecondaryMin: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  yAxisSecondaryMax?: number;
  setYAxisSecondaryMax: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  yAxisSecondaryTick?: number;
  setYAxisSecondaryTick: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  seriesIcons: Record<string, string>;
  setSeriesIcons: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  yAxisTitlePosition: string;
  setYAxisTitlePosition: React.Dispatch<React.SetStateAction<string>>;
  yAxisSecondaryTitlePosition: string;
  setYAxisSecondaryTitlePosition: React.Dispatch<React.SetStateAction<string>>;
}

export const ReviewGenerateStep: React.FC<Props> = ({
  dimensions,
  setDimensions,
  measures,
  setMeasures,
  xAxisDimensions,
  setXAxisDimensions,
  seriesDimension,
  setSeriesDimension,
  chartType,
  barMeasure,
  setBarMeasure,
  lineMeasure,
  setLineMeasure,
  is3D,
  setIs3D,
  containerRef,
  handleGenerateChart,
  handleGoBack,
  setStep,
  title,
  jsonData,
  setTitle,
  seriesColors,
  setSeriesColors,
  measureColors,
  setMeasureColors,
  legendPosition,
  setLegendPosition,
  variwideWidthMeasure,
  setVariwideWidthMeasure,
  variwideHeightMeasure,
  setVariwideHeightMeasure,
  yAxisPrimaryTitle,
  setYAxisPrimaryTitle,
  yAxisSecondaryTitle,
  setYAxisSecondaryTitle,
  yAxisPrimaryMin,
  setYAxisPrimaryMin,
  yAxisPrimaryMax,
  setYAxisPrimaryMax,
  yAxisPrimaryTick,
  setYAxisPrimaryTick,
  yAxisSecondaryMin,
  setYAxisSecondaryMin,
  yAxisSecondaryMax,
  setYAxisSecondaryMax,
  yAxisSecondaryTick,
  setYAxisSecondaryTick,
  seriesIcons,
  setSeriesIcons,
  yAxisTitlePosition,
  setYAxisTitlePosition,
  yAxisSecondaryTitlePosition,
  setYAxisSecondaryTitlePosition,
}) => {
  const [tempDimensions, setTempDimensions] = useState([...dimensions]);
  const [tempMeasures, setTempMeasures] = useState([...measures]);
  const [tempXAxisDimensions, setTempXAxisDimensions] = useState([
    ...xAxisDimensions,
  ]);
  const [tempSeriesDimension, setTempSeriesDimension] = useState<string | null>(
    seriesDimension
  );
  const [tempBarMeasure, setTempBarMeasure] = useState(barMeasure);
  const [tempLineMeasure, setTempLineMeasure] = useState(lineMeasure);
  const [embedCode, setEmbedCode] = useState<string>("");
  const [isYAxisTitleEdited, setIsYAxisTitleEdited] = useState(false);
  const [isYAxisSecondaryTitleEdited, setIsYAxisSecondaryTitleEdited] =
    useState(false);
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
  const defaultColors = customDefaultColors;

  useEffect(() => {
    setTempDimensions([...dimensions]);
    setTempMeasures([...measures]);
    setTempXAxisDimensions([...xAxisDimensions]);
    setTempSeriesDimension(seriesDimension);
    setTempBarMeasure(barMeasure);
    setTempLineMeasure(lineMeasure);
  }, [
    dimensions,
    measures,
    xAxisDimensions,
    seriesDimension,
    barMeasure,
    lineMeasure,
  ]);

  useEffect(() => {
    if (!isYAxisTitleEdited) {
      let defaultTitle = "";
      const selectedMeasures = measures.filter((m) => m.isSelected);

      switch (chartType) {
        case "line":
          defaultTitle = lineMeasure || selectedMeasures[0]?.name || "";
          break;
        case "column":
        case "stacked":
        case "stackedArea":
          defaultTitle = barMeasure || selectedMeasures[0]?.name || "";
          break;
        case "variwide":
          defaultTitle = variwideHeightMeasure || "";
          break;
        case "combo":
          defaultTitle = barMeasure || selectedMeasures[0]?.name || "";
          break;
        default:
          defaultTitle = selectedMeasures[0]?.name || "";
      }

      if (defaultTitle) {
        setYAxisPrimaryTitle(defaultTitle);
      }
    }
  }, [
    chartType,
    barMeasure,
    lineMeasure,
    measures,
    variwideHeightMeasure,
    yAxisPrimaryTitle,
    isYAxisTitleEdited,
  ]);

  useEffect(() => {
    setIsYAxisTitleEdited(false);
  }, [barMeasure, lineMeasure, variwideHeightMeasure]);

  useEffect(() => {
    if (chartType === "combo" && !isYAxisSecondaryTitleEdited && lineMeasure) {
      setYAxisSecondaryTitle(lineMeasure);
    }
  }, [
    chartType,
    lineMeasure,
    yAxisSecondaryTitle,
    setYAxisSecondaryTitle,
    isYAxisSecondaryTitleEdited,
  ]);

  useEffect(() => {
    if (tempSeriesDimension) {
      const seriesDim = tempDimensions.find(
        (d) => d.name === tempSeriesDimension
      );
      if (seriesDim) {
        setSeriesColors((prev) => {
          const newColors = { ...prev };
          seriesDim.selectedValues.forEach((val, idx) => {
            if (!newColors[val] || newColors[val] === "") {
              newColors[val] =
                customDefaultColors[idx % customDefaultColors.length];
            }
          });
          return newColors;
        });
      }
    }
  }, [tempSeriesDimension, tempDimensions, setSeriesColors]);

  useEffect(() => {
    setTempDimensions((prevDims) =>
      prevDims.map((dim) => {
        const role = getDimensionRole(dim.name);
        if (role === "filter") {
          if (dim.selectedValues.length === 1) return dim;
          const firstValue =
            dim.selectedValues.length > 0
              ? [dim.selectedValues[0]]
              : dim.allValues.length > 0
              ? [dim.allValues[0]]
              : [];
          return {
            ...dim,
            selectedValues: firstValue,
          };
        }
        return dim;
      })
    );
  }, []);

  const handleSelectAll = (dimName: string) => {
    setTempDimensions((prev) =>
      prev.map((d) =>
        d.name === dimName ? { ...d, selectedValues: [...d.allValues] } : d
      )
    );
  };

  const handleDeselectAll = (dimName: string) => {
    setTempDimensions((prev) =>
      prev.map((d) => (d.name === dimName ? { ...d, selectedValues: [] } : d))
    );
  };

  const getDimensionRole = (
    dimName: string
  ): "main" | "sub" | "series" | "filter" => {
    if (tempXAxisDimensions[0] === dimName) return "main";
    if (tempXAxisDimensions[1] === dimName) return "sub";
    if (tempSeriesDimension === dimName) return "series";
    return "filter";
  };

  const handleTempDimensionRoleChange = (
    dimName: string,
    newRole: "main" | "sub" | "series" | "filter"
  ) => {
    let newXAxis = [...tempXAxisDimensions];
    let newSeries = tempSeriesDimension;

    if (newRole === "main") {
      newXAxis = [dimName, ...newXAxis.filter((n) => n !== dimName)];
      if (newSeries === dimName) newSeries = null;
    } else if (newRole === "sub") {
      newXAxis = [...newXAxis.slice(0, 1), dimName];
      if (newSeries === dimName) newSeries = null;
    } else if (newRole === "series") {
      newSeries = dimName;
      newXAxis = newXAxis.filter((n) => n !== dimName);
    } else {
      newXAxis = newXAxis.filter((n) => n !== dimName);
      if (newSeries === dimName) newSeries = null;
    }

    setTempXAxisDimensions(newXAxis.filter(Boolean));
    setTempSeriesDimension(newSeries);

    if (newRole === "filter") {
      setTempDimensions((prevDims) =>
        prevDims.map((dim) => {
          if (dim.name === dimName) {
            const firstValue =
              dim.selectedValues.length > 0
                ? [dim.selectedValues[0]]
                : dim.allValues.length > 0
                ? [dim.allValues[0]]
                : [];
            return {
              ...dim,
              selectedValues: firstValue,
            };
          }
          return dim;
        })
      );
    }
  };

  const handleApplyChanges = () => {
    setDimensions(tempDimensions);
    setXAxisDimensions(tempXAxisDimensions);
    setSeriesDimension(tempSeriesDimension);
    setMeasures(tempMeasures);
    setBarMeasure(tempBarMeasure);
    setLineMeasure(tempLineMeasure);
    setVariwideHeightMeasure(variwideHeightMeasure);
    setVariwideWidthMeasure(variwideWidthMeasure);

    const updatedConfig = {
      dimensions: tempDimensions,
      measures: tempMeasures,
      xAxisDimensions: tempXAxisDimensions,
      seriesDimension: tempSeriesDimension,
      chartType,
      barMeasure: tempBarMeasure,
      lineMeasure: tempLineMeasure,
      is3D,
      title,
      jsonData,
      seriesColors,
      measureColors,
      legendPosition,
      variwideWidthMeasure,
      variwideHeightMeasure,
      yAxisPrimaryTitle,
      yAxisPrimaryMin,
      yAxisPrimaryMax,
      yAxisPrimaryTick,
      yAxisSecondaryMin,
      yAxisSecondaryMax,
      yAxisSecondaryTick,
      seriesIcons: seriesIcons,
      yAxisTitlePosition,
      yAxisSecondaryTitlePosition,
    };

    if (chartType === "combo" && (!tempBarMeasure || !tempLineMeasure)) {
      alert("Vänligen välj både stapel- och linjemått");
      return;
    }

    if (
      chartType === "variwide" &&
      (!variwideWidthMeasure || !variwideHeightMeasure)
    ) {
      alert("Vänligen välj både bredd- och höjdmått");
      return;
    }

    handleGenerateChart(updatedConfig);
  };

  const generateEmbedCode = async () => {
    const chartConfig = {
      dimensions,
      measures,
      xAxisDimensions,
      seriesDimension,
      chartType,
      barMeasure,
      lineMeasure,
      is3D,
      title,
      jsonData,
      seriesColors,
      measureColors,
      legendPosition,
      variwideWidthMeasure,
      variwideHeightMeasure,
      yAxisPrimaryTitle,
      yAxisSecondaryTitle,
      seriesIcons,
      yAxisTitlePosition,
      yAxisSecondaryTitlePosition,
    };

    try {
      const backendUrl =
        import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_DEV;

      const response = await fetch(`${backendUrl}/api/configs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chartConfig),
        credentials: "include",
      });

      const { id } = await response.json();
      const embedUrl = `${window.location.origin}/embed?configId=${id}`;

      setEmbedCode(
        `<div style="width: 100%; height: 600px; overflow: hidden;">
          <iframe 
            src="${embedUrl}"
            style="width: 100%; height: 100%; border: none;"
          ></iframe>
        </div>`
      );
    } catch (error) {
      console.error("Embed generation failed:", error);
      alert("Failed to generate embed code. Please try again.");
    }
  };

  return (
    <Card>
      <div className="border-2 border-gray-300 p-4 rounded mb-5">
        <h3 className="text-2xl font-bold mb-4">Snabbkonfiguration</h3>
        <div className="mb-1 p-1">
          <label className="block text-xl font-semibold mb-2">
            Diagramtitel
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            placeholder="Fyll i diagram titel här..."
          />
        </div>

        {tempSeriesDimension && (
          <div className="mb-2 p-1">
            <h4 className="text-xl font-semibold mb-2">Färgval för serier</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 pl-2">
              {tempDimensions
                .find((d) => d.name === tempSeriesDimension)
                ?.selectedValues.map((value, idx) => (
                  <div key={value} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={
                        seriesColors[value] ||
                        defaultColors[idx % defaultColors.length] ||
                        "#b90066"
                      }
                      onChange={(e) =>
                        setSeriesColors((prev) => ({
                          ...prev,
                          [value]: e.target.value,
                        }))
                      }
                      className="cursor-pointer"
                      title={`Klicka för att välja färg för ${value}`}
                    />{" "}
                    <label className="p-1">{value}</label>
                  </div>
                ))}
            </div>
          </div>
        )}

        {!tempSeriesDimension && ["column", "line"].includes(chartType) && (
          <div className="mb-2 p-1">
            <h4 className="text-xl font-semibold mb-2">Färgval för mått</h4>
            <div className="flex gap-4 pl-2">
              {measures
                .filter((m) => m.isSelected)
                .map((measure, idx) => (
                  <div key={measure.name} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={
                        measureColors[measure.name] ||
                        customDefaultColors[idx % customDefaultColors.length]
                      }
                      onChange={(e) =>
                        setMeasureColors((prev: Record<string, string>) => ({
                          ...prev,
                          [measure.name]: e.target.value,
                        }))
                      }
                      className="cursor-pointer"
                      title={`Klicka för att välja färg för ${measure.name}`}
                    />
                    <label className="p-1">{measure.name}</label>
                  </div>
                ))}
            </div>
          </div>
        )}

        {chartType === "combo" && !tempSeriesDimension && (
          <div className="mb-2 p-1">
            <h4 className="text-xl font-semibold mb-2">
              Färgval för linje och kolumn
            </h4>
            <div className="flex gap-4 pl-2">
              {tempBarMeasure && (
                <div className="flex items-center gap-2">
                  <label className="text-sm">{tempBarMeasure} (Kolumn)</label>
                  <input
                    type="color"
                    value={measureColors[tempBarMeasure] || defaultColors[0]}
                    onChange={(e) =>
                      setMeasureColors((prev: Record<string, string>) => ({
                        ...prev,
                        [tempBarMeasure]: e.target.value,
                      }))
                    }
                    className="cursor-pointer"
                    title={`Klicka för att välja färg för ${tempBarMeasure} (Kolumn)`}
                  />
                </div>
              )}
              {tempLineMeasure && (
                <div className="flex items-center gap-2">
                  <label className="text-sm">{tempLineMeasure} (Linje)</label>
                  <input
                    type="color"
                    value={measureColors[tempLineMeasure] || defaultColors[1]}
                    onChange={(e) =>
                      setMeasureColors((prev: Record<string, string>) => ({
                        ...prev,
                        [tempLineMeasure]: e.target.value,
                      }))
                    }
                    className="cursor-pointer"
                    title={`Klicka för att välja färg för ${tempLineMeasure} (Linje)`}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {chartType === "variwide" && (
          <div className="mb-2 p-1">
            <h4 className="text-xl font-semibold mb-2">Variwide Färger</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 pl-2">
              {dimensions
                .filter((dim) => dim.name === xAxisDimensions[0])
                .flatMap((dim) =>
                  dim.selectedValues.map((value, index) => {
                    const colorValue =
                      typeof seriesColors[value] === "string"
                        ? seriesColors[value]
                        : customDefaultColors[
                            index % customDefaultColors.length
                          ];
                    const validColorValue =
                      typeof colorValue === "string" ? colorValue : "";
                    return (
                      <div key={value} className="flex items-center gap-2 mb-2">
                        <input
                          type="color"
                          value={validColorValue}
                          onChange={(e) =>
                            setSeriesColors((prev) => ({
                              ...prev,
                              [value]: e.target.value,
                            }))
                          }
                        />{" "}
                        <label className="text-sm">{value}</label>
                      </div>
                    );
                  })
                )}
            </div>
          </div>
        )}

        {(chartType === "line" || chartType === "combo") && (
          <div className="mb-2 p-1">
            <h4 className="text-xl font-semibold mb-2">Linje ikoner</h4>
            {tempSeriesDimension ? (
              (() => {
                const seriesValues =
                  tempDimensions.find((d) => d.name === tempSeriesDimension)
                    ?.selectedValues || [];
                const defaultMarkerSymbols = [
                  "circle",
                  "square",
                  "diamond",
                  "triangle",
                  "triangle-down",
                ];
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 pl-2">
                    {seriesValues.map((value, index) => {
                      const defaultIcon =
                        defaultMarkerSymbols[
                          index % defaultMarkerSymbols.length
                        ];
                      return (
                        <div
                          key={value}
                          className="flex flex-col items-center gap-2"
                        >
                          <select
                            value={
                              seriesIcons[value] === undefined
                                ? defaultIcon
                                : seriesIcons[value]
                            }
                            onChange={(e) =>
                              setSeriesIcons(
                                (prev: Record<string, string>) => ({
                                  ...prev,
                                  [value]: e.target.value,
                                })
                              )
                            }
                            className="border rounded px-2 py-1"
                          >
                            <option value="circle">● Cirkel</option>
                            <option value="square">■ Fyrkant</option>
                            <option value="diamond">◆ Diamant</option>
                            <option value="triangle">▲ Triangel</option>
                            <option value="triangle-down">
                              ▼ Triangel Ner
                            </option>
                            <option value="">Ingen ikon</option>
                          </select>
                          <span className="text-sm">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 pl-2">
                {(chartType === "combo"
                  ? measures.filter((m) => m.name === lineMeasure)
                  : measures.filter((m) => m.isSelected)
                ).map((measure, index) => {
                  const defaultMarkerSymbols = [
                    "circle",
                    "square",
                    "diamond",
                    "triangle",
                    "triangle-down",
                  ];
                  const defaultIcon =
                    defaultMarkerSymbols[index % defaultMarkerSymbols.length];
                  return (
                    <div
                      key={measure.name}
                      className="flex flex-col items-center gap-2"
                    >
                      <select
                        value={
                          seriesIcons[measure.name] === undefined
                            ? defaultIcon
                            : seriesIcons[measure.name]
                        }
                        onChange={(e) =>
                          setSeriesIcons((prev: Record<string, string>) => ({
                            ...prev,
                            [measure.name]: e.target.value,
                          }))
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="circle">● Cirkel</option>
                        <option value="square">■ Fyrkant</option>
                        <option value="diamond">◆ Diamant</option>
                        <option value="triangle">▲ Triangel</option>
                        <option value="triangle-down">▼ Triangel Ner</option>
                        <option value="">Ingen ikon</option>
                      </select>
                      <span className="text-sm">{measure.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {chartType !== "variwide" && (
          <div className="mb-2 p-1">
            <h4 className="text-xl font-semibold mb-2">Legend position</h4>
            <div className="flex flex-row space-x-4">
              <label className="mb-1 pl-2">
                <input
                  type="radio"
                  name="legendPosition"
                  value="top"
                  checked={legendPosition === "top"}
                  onChange={(e) => setLegendPosition(e.target.value)}
                  className="mr-2"
                />
                Uppe
              </label>
              <label className="mb-1">
                <input
                  type="radio"
                  name="legendPosition"
                  value="right"
                  checked={legendPosition === "right"}
                  onChange={(e) => setLegendPosition(e.target.value)}
                  className="mr-2"
                />
                Höger
              </label>
              <label className="mb-1">
                <input
                  type="radio"
                  name="legendPosition"
                  value="bottom"
                  checked={legendPosition === "bottom"}
                  onChange={(e) => setLegendPosition(e.target.value)}
                  className="mr-2"
                />
                Nere
              </label>
              <label className="mb-1">
                <input
                  type="radio"
                  name="legendPosition"
                  value="left"
                  checked={legendPosition === "left"}
                  onChange={(e) => setLegendPosition(e.target.value)}
                  className="mr-2"
                />
                Vänster
              </label>
              <label className="mb-1">
                <input
                  type="radio"
                  name="legendPosition"
                  value="inside"
                  checked={legendPosition === "inside"}
                  onChange={(e) => setLegendPosition(e.target.value)}
                  className="mr-2"
                />
                Inuti
              </label>
            </div>
          </div>
        )}

        <div className="mb-2 p-1">
          <h4 className="text-xl font-semibold mb-2">Dimensioner & roller</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {tempDimensions.map((dim) => {
              const currentRole = getDimensionRole(dim.name);
              return (
                <div
                  key={dim.name}
                  className="p-4 border rounded-lg shadow-sm flex flex-col space-y-3"
                >
                  <div className="text-lg font-medium">{dim.name}</div>
                  <div className="flex flex-col space-y-2 space pl-">
                    <label className="flex items-center text-gray-900">
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "main"}
                        onChange={() =>
                          handleTempDimensionRoleChange(dim.name, "main")
                        }
                        className="mr-1"
                      />
                      Huvudkategori
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "sub"}
                        onChange={() =>
                          handleTempDimensionRoleChange(dim.name, "sub")
                        }
                        className="mr-1"
                      />
                      Underkategori
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "series"}
                        onChange={() =>
                          handleTempDimensionRoleChange(dim.name, "series")
                        }
                        className="mr-1"
                      />
                      Serie
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "filter"}
                        onChange={() =>
                          handleTempDimensionRoleChange(dim.name, "filter")
                        }
                        className="mr-1"
                      />
                      Filter
                    </label>
                  </div>
                </div>
              );
            })}{" "}
          </div>
        </div>

        <div className="p-1">
          <h4 className="text-xl font-semibold mb-2">Filtrera värden</h4>
          {tempDimensions.map((dim) => (
            <div key={dim.name} className="p-2 mb-2 border rounded shadow-sm">
              <div className="flex gap-2 mb-3 pt-1">
                {" "}
                <h4 className="text-lg font-semibold mr-4 p-1">{dim.name}</h4>
                <Button
                  onClick={() => handleSelectAll(dim.name)}
                  variant="success"
                  className="text-sm"
                >
                  Markera alla
                </Button>
                <Button
                  onClick={() => handleDeselectAll(dim.name)}
                  variant="danger"
                  className="text-sm"
                >
                  Ta bort alla
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {dim.allValues.map((value) => (
                  <label
                    key={value}
                    className={`flex items-center p-2 rounded-md border ${
                      dim.selectedValues.includes(value)
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={dim.selectedValues.includes(value)}
                      onChange={(e) => {
                        setTempDimensions((prev) =>
                          prev.map((d) => {
                            if (d.name !== dim.name) return d;
                            return e.target.checked
                              ? {
                                  ...d,
                                  selectedValues: [...d.selectedValues, value],
                                }
                              : {
                                  ...d,
                                  selectedValues: d.selectedValues.filter(
                                    (v) => v !== value
                                  ),
                                };
                          })
                        );
                      }}
                      className="mr-2 h-4 w-4 text-blue-600 hidde"
                    />
                    <span className="text-base">{value}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!["combo", "variwide"].includes(chartType) && (
          <>
            <div className="p-1 mb-2">
              <h4 className="text-xl font-semibold mb-2 ">Mått</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
                  {tempMeasures.map((measure) => (
                    <label
                      key={measure.name}
                      className={`flex items-center p-2 rounded-md border ${
                        measure.isSelected
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={measure.isSelected}
                        onChange={(e) => {
                          setTempMeasures((prev) =>
                            prev.map((m) =>
                              m.name === measure.name
                                ? { ...m, isSelected: e.target.checked }
                                : m
                            )
                          );
                        }}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <span className="text-base">
                        {measure.name} {measure.unit && `(${measure.unit})`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {chartType === "combo" && (
          <div className="mb-2 p-1">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">
                  Välj mått för stapel
                </h4>
                {tempMeasures.map((measure) => (
                  <div key={measure.name} className="flex items-center mb-2">
                    <label className="flex items-center space-x-2 pl-2">
                      <input
                        type="radio"
                        name="barMeasure"
                        value={measure.name}
                        checked={tempBarMeasure === measure.name}
                        onChange={() => setTempBarMeasure(measure.name)}
                        className="mr-2 h-4 w-4 text-blue-600"
                      />
                      {measure.name}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">
                  Välj mått för linje
                </h4>
                {tempMeasures.map((measure) => (
                  <div key={measure.name} className="flex items-center mb-2">
                    <label className="flex items-center space-x-2 pl-2">
                      <input
                        type="radio"
                        name="lineMeasure"
                        value={measure.name}
                        checked={tempLineMeasure === measure.name}
                        onChange={() => setTempLineMeasure(measure.name)}
                        className="mr-2 h-4 w-4 text-blue-600"
                      />
                      {measure.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {chartType === "variwide" && (
          <>
            <div className="mb-2 p-1">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold mb-2">
                    Välj mått för bredd
                  </h4>
                  {measures.map((measure) => (
                    <div key={measure.name} className="flex items-center mb-2">
                      <label className="flex items-center space-x-2 pl-2">
                        <input
                          type="radio"
                          name="variwideWidthMeasure"
                          value={measure.name}
                          checked={variwideWidthMeasure === measure.name}
                          onChange={() => setVariwideWidthMeasure(measure.name)}
                          className="mr-2"
                        />
                        {measure.name}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold mb-2">
                    Välj mått för höjd
                  </h4>
                  {measures.map((measure) => (
                    <div key={measure.name} className="flex items-center mb-2">
                      <label className="flex items-center space-x-2 pl-2">
                        <input
                          type="radio"
                          name="variwideHeightMeasure"
                          value={measure.name}
                          checked={variwideHeightMeasure === measure.name}
                          onChange={() =>
                            setVariwideHeightMeasure(measure.name)
                          }
                          className="mr-2"
                        />
                        {measure.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mb-4 p-1 ">
          <h5 className="text-xl font-semibold mb-2">Y-axel inställningar</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-1">
            <div>
              <label className="block mb-1 font-medium">Y-axel titel</label>
              <input
                type="text"
                value={yAxisPrimaryTitle}
                onChange={(e) => {
                  setYAxisPrimaryTitle(e.target.value);
                  setIsYAxisTitleEdited(true);
                }}
                className="border rounded px-2 py-1 w-full"
                placeholder="Titel för y-axel"
              />
            </div>{" "}
            <div>
              <label className="block mb-1 font-medium">
                Y-axel titel placering
              </label>
              <select
                value={yAxisTitlePosition}
                onChange={(e) => setYAxisTitlePosition(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="side">Sida (nedifrån upp)</option>
                <option value="rotated">Sida (uppifrån ned)</option>
                <option value="top">Ovanför axeln</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-1">
            <div>
              <label className="block mb-1 font-medium">
                Y-axel värde minimum
              </label>
              <input
                type="number"
                value={yAxisPrimaryMin}
                onChange={(e) =>
                  setYAxisPrimaryMin(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="border rounded px-2 py-1 w-full"
                placeholder="Minvärde"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Y-axel värde max</label>
              <input
                type="number"
                value={yAxisPrimaryMax}
                onChange={(e) =>
                  setYAxisPrimaryMax(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="border rounded px-2 py-1 w-full"
                placeholder="Maxvärde"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Y-axel intervall</label>
              <input
                type="number"
                value={yAxisPrimaryTick}
                onChange={(e) =>
                  setYAxisPrimaryTick(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="border rounded px-2 py-1 w-full"
                placeholder="Interval"
              />
            </div>
          </div>

          {chartType === "combo" && (
            <div className="mt-4">
              <h5 className="text-lg font-semibold mb-2">
                Sekundär y-axel inställningar
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-1">
                <div>
                  <label className="block mb-1 font-medium">
                    Sekundär y-axel titel
                  </label>
                  <input
                    type="text"
                    value={yAxisSecondaryTitle}
                    onChange={(e) => {
                      setYAxisSecondaryTitle(e.target.value);
                      setIsYAxisSecondaryTitleEdited(true);
                    }}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Titel för sekundär y-axel"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    Sekundär y-axel placering
                  </label>
                  <select
                    value={yAxisSecondaryTitlePosition}
                    onChange={(e) =>
                      setYAxisSecondaryTitlePosition(e.target.value)
                    }
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="side">Sida (vertikal)</option>
                    <option value="rotated">Sida (nedifrån upp)</option>
                    <option value="top">Ovanför axeln</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 space-x-4 p-1">
                <div>
                  <label className="block mb-1 font-medium">
                    Sekundär y-axel minimum
                  </label>
                  <input
                    type="number"
                    value={yAxisSecondaryMin}
                    onChange={(e) =>
                      setYAxisSecondaryMin(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Minvärde"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    Sekundär y-axel max
                  </label>
                  <input
                    type="number"
                    value={yAxisSecondaryMax}
                    onChange={(e) =>
                      setYAxisSecondaryMax(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Maxvärde"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    Sekundär y-axel intervall{" "}
                  </label>
                  <input
                    type="number"
                    value={yAxisSecondaryTick}
                    onChange={(e) =>
                      setYAxisSecondaryTick(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Interval"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-4 mt-4">
          <Button onClick={handleGoBack} variant="secondary">
            Tillbaka
          </Button>
          <Button
            onClick={() => setStep("select-diagram-type")}
            variant="danger"
          >
            Börja om
          </Button>
        </div>
        <div className="mt-4">
          <Button
            onClick={handleApplyChanges}
            variant="primary"
            className="w-full"
          >
            Generera diagram
          </Button>
        </div>
      </div>
      <div>
        <div className="flex justify-center items-center gap-4 flex-wrap mt-10">
          {dimensions
            .filter(
              (dim) =>
                !xAxisDimensions.includes(dim.name) &&
                dim.name !== seriesDimension
            )
            .map((dim) => (
              <div key={dim.name} className="mb-4 flex flex-col items-center">
                <label className="block font-semibold mb-1">{dim.name}</label>
                <select
                  value={dim.selectedValues[0] || ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setDimensions((prev) =>
                      prev.map((d) =>
                        d.name === dim.name
                          ? { ...d, selectedValues: [newValue] }
                          : d
                      )
                    );
                  }}
                  className="border border-trafaBlue rounded px-2 py-1"
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
        <div
          id="container"
          ref={containerRef}
          className="w-full h-[600px] bg-red rounded"
        />
        {chartType !== "variwide" &&
          chartType !== "stackedArea" &&
          chartType !== "line" && (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={is3D}
                onChange={(e) => setIs3D(e.target.checked)}
                className="mr-2"
              />
              Visa i 3D
            </label>
          )}

        <div className="mt-4">
          <Button onClick={generateEmbedCode} variant="success">
            Generera inbäddningskod
          </Button>
          {embedCode && (
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Inbäddningskod</h3>
              <textarea
                value={embedCode}
                readOnly
                className="w-full h-32 p-2 border rounded"
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
