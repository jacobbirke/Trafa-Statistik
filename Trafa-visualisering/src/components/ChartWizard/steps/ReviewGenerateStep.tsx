import React, { useEffect, useState } from "react";
import { Button } from "../../UI/Button";
import {
  Dimension,
  Measure,
  ChartType,
  WizardStep,
} from "../../../types/chartTypes";
import { Card } from "../../UI/Card";
import Highcharts from "highcharts";

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
  handleGenerateChart: () => void;
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
  const defaultColors = Highcharts.getOptions().colors as string[];

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
                defaultColors[idx % defaultColors.length] || "#ff0000";
            }
          });
          return newColors;
        });
      }
    }
  }, [tempSeriesDimension, tempDimensions, setSeriesColors, defaultColors]);

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
    handleGenerateChart();
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
    };
    try {
      const backendUrl =
        import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_DEV;
        console.log("Backend URL:", backendUrl); 


      if (!backendUrl) {
        throw new Error("Backend URL is not defined");
      }

      const response = await fetch(`${backendUrl}/api/configs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chartConfig),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save config");
      }

      const { id } = await response.json();
      const embedUrl = `${window.location.origin}/embed?configId=${id}`;

      setEmbedCode(
        `<iframe 
            src="${embedUrl}"
            width="100%" 
            height="700" 
            style="border:1px solid #ddd;border-radius:8px"
          ></iframe>`
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
          <div className="mb-3 p-2">
            <h4 className="text-xl font-semibold mb-2">Färgval för mått</h4>
            <div className="flex gap-4">
              {measures
                .filter((m) => m.isSelected)
                .map((measure, idx) => (
                  <div key={measure.name} className="flex items-center gap-2">
                    <label className="text-sm">{measure.name}</label>
                    <input
                      type="color"
                      value={
                        measureColors[measure.name] ||
                        defaultColors[idx % defaultColors.length] ||
                        "#b90066"
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
                  </div>
                ))}
            </div>
          </div>
        )}

        {chartType === "combo" && !tempSeriesDimension && (
          <div className="mb-3 p-2">
            <h4 className="text-xl font-semibold mb-2">
              Färgval för line och kolumn
            </h4>
            <div className="flex gap-4">
              {tempBarMeasure && (
                <div className="flex items-center gap-2">
                  <label className="text-sm">{tempBarMeasure} (Kolumn)</label>
                  <input
                    type="color"
                    value={
                      measureColors[tempBarMeasure] ||
                      defaultColors[0] ||
                      "#b90066"
                    }
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
                    value={
                      measureColors[tempLineMeasure] ||
                      defaultColors[1] ||
                      "#b90066"
                    }
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
          <div className="mb-4 p-1">
            <h4 className="text-xl font-semibold mb-2">Variwide Färger</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 pl-2">
              {dimensions
                .filter((dim) => dim.name === xAxisDimensions[0])
                .flatMap((dim) =>
                  dim.selectedValues.map((value, index) => {
                    const colorValue =
                      typeof seriesColors[value] === "string"
                        ? seriesColors[value]
                        : Highcharts.getOptions().colors?.[index % 10] ||
                          "#ff0000";
                    const validColorValue =
                      typeof colorValue === "string" ? colorValue : "#ff0000";
                    return (
                      <div key={value} className="flex items-center gap-2 mb-2">
                        <label className="text-sm">{value}</label>
                        <input
                          type="color"
                          value={validColorValue}
                          onChange={(e) =>
                            setSeriesColors((prev) => ({
                              ...prev,
                              [value]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    );
                  })
                )}
            </div>
          </div>
        )}

        {chartType !== "variwide" && (
          <div className="mb-2 p-1">
            <h4 className="text-xl font-semibold mb-2">Legend Position</h4>
            <div className="grid grid-cols-5 gap-4 pl-2">
              <button
                className={`py-2 px-4 rounded-lg text-base ${
                  legendPosition === "top"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setLegendPosition("top")}
              >
                Uppe
              </button>
              <button
                className={`py-2 px-4 rounded-lg text-base ${
                  legendPosition === "right"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setLegendPosition("right")}
              >
                Höger
              </button>
              <button
                className={`py-2 px-4 rounded-lg text-base ${
                  legendPosition === "bottom"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setLegendPosition("bottom")}
              >
                Nere
              </button>
              <button
                className={`py-2 px-4 rounded-lg text-base ${
                  legendPosition === "left"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setLegendPosition("left")}
              >
                Vänster
              </button>
              <button
                className={`py-2 px-4 rounded-lg text-base ${
                  legendPosition === "inside"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setLegendPosition("inside")}
              >
                Inuti
              </button>
            </div>
          </div>
        )}

        <div className="mb-2 p-1">
          <h4 className="text-xl font-semibold mb-4">Dimensioner & Roller</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {tempDimensions.map((dim) => {
              const currentRole = getDimensionRole(dim.name);
              return (
                <div
                  key={dim.name}
                  className="p-4 border rounded-lg shadow-sm flex flex-col space-y-4"
                >
                  <div className="text-lg font-medium">{dim.name}</div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "main"}
                        onChange={() =>
                          handleTempDimensionRoleChange(dim.name, "main")
                        }
                        className="hidden"
                        id={`main-${dim.name}`}
                      />
                      <label
                        htmlFor={`main-${dim.name}`}
                        className={`flex-1 py-3 px-5 rounded-lg text-center cursor-pointer text-base ${
                          currentRole === "main"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black hover:bg-blue-100"
                        }`}
                      >
                        Huvudkategori
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "sub"}
                        onChange={() =>
                          handleTempDimensionRoleChange(dim.name, "sub")
                        }
                        className="hidden"
                        id={`sub-${dim.name}`}
                      />
                      <label
                        htmlFor={`sub-${dim.name}`}
                        className={`flex-1 py-3 px-5 rounded-lg text-center cursor-pointer text-base ${
                          currentRole === "sub"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black hover:bg-blue-100"
                        }`}
                      >
                        Underkategori
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "series"}
                        onChange={() =>
                          handleTempDimensionRoleChange(dim.name, "series")
                        }
                        className="hidden"
                        id={`series-${dim.name}`}
                      />
                      <label
                        htmlFor={`series-${dim.name}`}
                        className={`flex-1 py-3 px-5 rounded-lg text-center cursor-pointer text-base ${
                          currentRole === "series"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black hover:bg-blue-100"
                        }`}
                      >
                        Serie
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "filter"}
                        onChange={() =>
                          handleTempDimensionRoleChange(dim.name, "filter")
                        }
                        className="hidden"
                        id={`filter-${dim.name}`}
                      />
                      <label
                        htmlFor={`filter-${dim.name}`}
                        className={`flex-1 py-3 px-5 rounded-lg text-center cursor-pointer text-base ${
                          currentRole === "filter"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black hover:bg-blue-100"
                        }`}
                      >
                        Filter
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-2 p-1">
          <h4 className="text-xl font-semibold mb-2 ">Filtrera Värden</h4>
          {tempDimensions.map((dim) => (
            <div key={dim.name} className="p-2 mb-4 border rounded shadow-sm">
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
                        ? "border-blue-500 bg-blue-50"
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

        <div className="p-1 mb-2">
          <h4 className="text-xl font-semibold mb-2 ">Mått</h4>
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
              {tempMeasures.map((measure) => (
                <label
                  key={measure.name}
                  className={`flex items-center p-2 rounded-md border ${
                    measure.isSelected
                      ? "border-blue-500 bg-blue-50"
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

        {chartType === "combo" && (
          <div className="mb-2 p-1">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-2">
                  Välj Mått för Stapeldiagram
                </h4>
                {tempMeasures
                  .filter((m) => m.isSelected)
                  .map((measure) => (
                    <div key={measure.name} className="flex items-center mb-2">
                      <label className="flex items-center space-x-2">
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
                <h4 className="text-xl font-semibold mb-2">
                  Välj Mått för Linjediagram
                </h4>
                {tempMeasures
                  .filter((m) => m.isSelected)
                  .map((measure) => (
                    <div key={measure.name} className="flex items-center mb-2">
                      <label className="flex items-center space-x-2">
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
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={is3D}
            onChange={(e) => setIs3D(e.target.checked)}
            className="mr-2"
          />
          Visa i 3D
        </label>
        <div className="mt-4">
          <Button onClick={generateEmbedCode} variant="success">
            Generera inbädnningskod
          </Button>
          {embedCode && (
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Inäddningskod</h3>
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
