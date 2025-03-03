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
  handleGenerateChart: () => void;
  handleGoBack: () => void;
  setStep: (step: WizardStep) => void;
  jsonData: any[];
  title: string;
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
}) => {
  const [tempDimensions, setTempDimensions] = useState([...dimensions]);
  const [tempMeasures, setTempMeasures] = useState([...measures]);
  const [tempXAxisDimensions, setTempXAxisDimensions] = useState([
    ...xAxisDimensions,
  ]);
  const [tempSeriesDimension, setTempSeriesDimension] =
    useState(seriesDimension);
  const [tempBarMeasure, setTempBarMeasure] = useState(barMeasure);
  const [tempLineMeasure, setTempLineMeasure] = useState(lineMeasure);
  const [embedCode, setEmbedCode] = useState<string>("");

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
        <h4 className="text-xl font-semibold mb-2">Dimensioner & Roller</h4>
        {tempDimensions.map((dim) => {
          const currentRole = getDimensionRole(dim.name);
          return (
            <div key={dim.name} className="mb-4">
              <strong className="block mb-1">{dim.name}</strong>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
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
        })}
        <h4 className="text-xl font-semibold mb-2">Filtrera Värden</h4>
        {tempDimensions.map((dim) => (
          <div key={dim.name} className="mb-4">
            <strong className="block mb-1">{dim.name}</strong>
            <div className="space-y-1">
              {dim.allValues.map((value) => (
                <label key={value} className="flex items-center space-x-2">
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
                    className="mr-2"
                  />
                  {value}
                </label>
              ))}
            </div>
          </div>
        ))}

        <h4 className="text-xl font-semibold mb-2">Mått</h4>
        {tempMeasures.map((measure) => (
          <div key={measure.name} className="mb-2">
            <label className="flex items-center space-x-2">
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
                className="mr-2"
              />
              {measure.name} {measure.unit && `(${measure.unit})`}
            </label>
          </div>
        ))}

        {chartType === "combo" && (
          <div className="mb-4">
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
                      className="mr-2"
                    />
                    {measure.name}
                  </label>
                </div>
              ))}
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
                      className="mr-2"
                    />
                    {measure.name}
                  </label>
                </div>
              ))}
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
              <div key={dim.name} className="mb-4 flex flex-col items-start">
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
        <div
          id="container"
          ref={containerRef}
          className="w-full h-[600px] bg-red rounded"
        />{" "}
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
