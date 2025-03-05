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
  setMeasureColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
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
}) => {
  const [tempDimensions, setTempDimensions] = useState([...dimensions]);
  const [tempMeasures, setTempMeasures] = useState([...measures]);
  const [tempXAxisDimensions, setTempXAxisDimensions] = useState([...xAxisDimensions]);
  const [tempSeriesDimension, setTempSeriesDimension] = useState<string | null>(seriesDimension);
  const [tempBarMeasure, setTempBarMeasure] = useState(barMeasure);
  const [tempLineMeasure, setTempLineMeasure] = useState(lineMeasure);
  const [embedCode, setEmbedCode] = useState<string>("");

  // Extract default colors from Highcharts and assert they are strings.
  const defaultColors = Highcharts.getOptions().colors as string[];

  useEffect(() => {
    setTempDimensions([...dimensions]);
    setTempMeasures([...measures]);
    setTempXAxisDimensions([...xAxisDimensions]);
    setTempSeriesDimension(seriesDimension);
    setTempBarMeasure(barMeasure);
    setTempLineMeasure(lineMeasure);
  }, [dimensions, measures, xAxisDimensions, seriesDimension, barMeasure, lineMeasure]);

  // Initialize default series colors if not set
  useEffect(() => {
    if (tempSeriesDimension) {
      const seriesDim = tempDimensions.find((d) => d.name === tempSeriesDimension);
      if (seriesDim) {
        setSeriesColors((prev) => {
          const newColors = { ...prev };
          seriesDim.selectedValues.forEach((val, idx) => {
            if (!newColors[val] || newColors[val] === "") {
              newColors[val] = defaultColors[idx % defaultColors.length] || "#ff0000";
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

  const getDimensionRole = (dimName: string): "main" | "sub" | "series" | "filter" => {
    if (tempXAxisDimensions[0] === dimName) return "main";
    if (tempXAxisDimensions[1] === dimName) return "sub";
    if (tempSeriesDimension === dimName) return "series";
    return "filter";
  };

  const handleTempDimensionRoleChange = (dimName: string, newRole: "main" | "sub" | "series" | "filter") => {
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
    handleGenerateChart();
  };

  const generateEmbedCode = () => {
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
    };
    const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
    const embedUrl = `${window.location.origin}/embed?config=${encodedConfig}`;
    setEmbedCode(
      `<iframe 
        src="${embedUrl}"
        width="100%" 
        height="700" 
        style="border:1px solid #ddd;border-radius:8px"
      ></iframe>`
    );
  };

  return (
    <Card>
      <div className="border-2 border-gray-300 p-4 rounded mb-5">
        <h3 className="text-2xl font-bold mb-4">Snabbkonfiguration</h3>
        <div className="mb-4">
          <label className="block text-xl font-semibold mb-2">Diagramtitel</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        {tempSeriesDimension && (
          <div className="mb-4">
            <h4 className="text-xl font-semibold mb-2">Färgval för serier</h4>
            <div className="flex gap-4">
              {tempDimensions
                .find((d) => d.name === tempSeriesDimension)
                ?.selectedValues.map((value, idx) => (
                  <div key={value} className="flex items-center gap-2">
                    <label className="p-1">{value}</label>
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
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {!tempSeriesDimension && ["column", "line"].includes(chartType) && (
          <div className="mb-4">
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
          <div className="mb-4">
            <h4 className="text-xl font-semibold mb-2">Färgval för line och kolumn</h4>
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

        {/* Remaining UI for dimensions, filters, and embed code generation */}
        <h4 className="text-xl font-semibold mb-2">Dimensioner & Roller</h4>
        {tempDimensions.map((dim) => {
          const currentRole = getDimensionRole(dim.name);
          return (
            <div key={dim.name} className="p-1 mb-4">
              <strong className="block mb-1 text-lg font-medium">{dim.name}</strong>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 text-gray-900 pl-2">
                  <input
                    type="radio"
                    name={`role-${dim.name}`}
                    checked={currentRole === "main"}
                    onChange={() => handleTempDimensionRoleChange(dim.name, "main")}
                    className="mr-1"
                  />
                  Huvudkategori
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`role-${dim.name}`}
                    checked={currentRole === "sub"}
                    onChange={() => handleTempDimensionRoleChange(dim.name, "sub")}
                    className="mr-1"
                  />
                  Underkategori
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`role-${dim.name}`}
                    checked={currentRole === "series"}
                    onChange={() => handleTempDimensionRoleChange(dim.name, "series")}
                    className="mr-1"
                  />
                  Serie
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`role-${dim.name}`}
                    checked={currentRole === "filter"}
                    onChange={() => handleTempDimensionRoleChange(dim.name, "filter")}
                    className="mr-1"
                  />
                  Filter
                </label>
              </div>
            </div>
          );
        })}

        <h4 className="text-xl font-semibold mb-2">Filtrera Värden</h4>
        {tempDimensions.map((dim) => (
          <div key={dim.name} className="p-2 mb-4">
            <h4 className="text-lg font-semibold mb-2">{dim.name}</h4>
            <div className="flex gap-2 mb-3">
              <Button onClick={() => handleSelectAll(dim.name)} variant="success" className="text-sm">
                Markera alla
              </Button>
              <Button onClick={() => handleDeselectAll(dim.name)} variant="danger" className="text-sm">
                Ta bort alla
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {dim.allValues.map((value) => (
                <label key={value} className={`flex items-center p-2 rounded-md border ${dim.selectedValues.includes(value) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"}`}>
                  <input
                    type="checkbox"
                    checked={dim.selectedValues.includes(value)}
                    onChange={(e) => {
                      setTempDimensions((prev) =>
                        prev.map((d) => {
                          if (d.name !== dim.name) return d;
                          return e.target.checked
                            ? { ...d, selectedValues: [...d.selectedValues, value] }
                            : { ...d, selectedValues: d.selectedValues.filter((v) => v !== value) };
                        })
                      );
                    }}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-style">{value}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <h4 className="text-xl font-semibold mb-2">Mått</h4>
        <div className="p-4 mb-4">
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
              {tempMeasures.map((measure) => (
                <label key={measure.name} className={`flex items-center p-2 rounded-md border ${measure.isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"}`}>
                  <input
                    type="checkbox"
                    checked={measure.isSelected}
                    onChange={(e) => {
                      setTempMeasures((prev) =>
                        prev.map((m) =>
                          m.name === measure.name ? { ...m, isSelected: e.target.checked } : m
                        )
                      );
                    }}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-style">
                    {measure.name} {measure.unit && `(${measure.unit})`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {chartType === "combo" && (
          <div className="mb-4 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-2">Välj Mått för Stapeldiagram</h4>
                {tempMeasures.filter((m) => m.isSelected).map((measure) => (
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
                <h4 className="text-xl font-semibold mb-2">Välj Mått för Linjediagram</h4>
                {tempMeasures.filter((m) => m.isSelected).map((measure) => (
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
          <Button onClick={() => setStep("select-diagram-type")} variant="danger">
            Börja om
          </Button>
        </div>
        <div className="mt-4">
          <Button onClick={handleApplyChanges} variant="primary" className="w-full">
            Generera diagram
          </Button>
        </div>
      </div>
      <div>
        <div className="flex justify-center items-center gap-4 flex-wrap mt-10">
          {dimensions
            .filter((dim) => !xAxisDimensions.includes(dim.name) && dim.name !== seriesDimension)
            .map((dim) => (
              <div key={dim.name} className="mb-4 flex flex-col items-start">
                <label className="block font-semibold mb-1">{dim.name}</label>
                <select
                  value={dim.selectedValues[0] || ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setDimensions((prev) =>
                      prev.map((d) =>
                        d.name === dim.name ? { ...d, selectedValues: [newValue] } : d
                      )
                    );
                  }}
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
        <div id="container" ref={containerRef} className="w-full h-[600px] bg-red rounded" />
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
