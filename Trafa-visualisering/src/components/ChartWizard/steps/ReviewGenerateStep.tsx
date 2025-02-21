import React from "react";
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
}) => {
  const getDimensionRole = (
    dimName: string
  ): "main" | "sub" | "series" | "filter" => {
    if (xAxisDimensions[0] === dimName) return "main";
    if (xAxisDimensions[1] === dimName) return "sub";
    if (seriesDimension === dimName) return "series";
    return "filter";
  };

  const handleDimensionRoleChange = (
    dimName: string,
    newRole: "main" | "sub" | "series" | "filter"
  ) => {
    if (newRole === "main") {
      setXAxisDimensions((prev) => {
        const newArr = [...prev];
        newArr[0] = dimName;
        if (newArr[1] === dimName) newArr.splice(1, 1);
        return newArr;
      });
      if (seriesDimension === dimName) setSeriesDimension(null);
    } else if (newRole === "sub") {
      setXAxisDimensions((prev) => {
        let newArr = [...prev];
        if (newArr.length === 0) {
          newArr = [dimName];
        } else if (newArr.length === 1) {
          newArr.push(dimName);
        } else {
          newArr[1] = dimName;
        }
        return newArr;
      });
      if (seriesDimension === dimName) setSeriesDimension(null);
    } else if (newRole === "series") {
      setSeriesDimension(dimName);
      setXAxisDimensions((prev) => prev.filter((n) => n !== dimName));
    } else if (newRole === "filter") {
      setXAxisDimensions((prev) => prev.filter((n) => n !== dimName));
      if (seriesDimension === dimName) setSeriesDimension(null);
    }
  };

  return (
    <Card>
      <div className="border-2 border-gray-300 p-4 rounded mb-5">
        <h3 className="text-2xl font-bold mb-4">Snabbkonfiguration</h3>
        <h4 className="text-xl font-semibold mb-2">Dimensioner & Roller</h4>
        {dimensions.map((dim) => {
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
                    onChange={() => handleDimensionRoleChange(dim.name, "main")}
                    className="mr-1"
                  />
                  Huvudkategori
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`role-${dim.name}`}
                    checked={currentRole === "sub"}
                    onChange={() => handleDimensionRoleChange(dim.name, "sub")}
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
                      handleDimensionRoleChange(dim.name, "series")
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
                      handleDimensionRoleChange(dim.name, "filter")
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
        {dimensions.map((dim) => (
          <div key={dim.name} className="mb-4">
            <strong className="block mb-1">{dim.name}</strong>
            <div className="space-y-1">
              {dim.allValues.map((value) => (
                <label key={value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={dim.selectedValues.includes(value)}
                    onChange={(e) => {
                      setDimensions((prev) =>
                        prev.map((d) => {
                          if (d.name !== dim.name) return d;
                          if (e.target.checked) {
                            return {
                              ...d,
                              selectedValues: [...d.selectedValues, value],
                            };
                          } else {
                            return {
                              ...d,
                              selectedValues: d.selectedValues.filter(
                                (v) => v !== value
                              ),
                            };
                          }
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
        {measures.map((measure) => (
          <div key={measure.name} className="mb-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={measure.isSelected}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setMeasures((prevMeasures) => {
                    const newMeasures = prevMeasures.map((m) =>
                      m.name === measure.name
                        ? { ...m, isSelected: isChecked }
                        : m
                    );
                    const selected = newMeasures.filter((m) => m.isSelected);
                    if (chartType === "combo") {
                      if (selected.length > 2) {
                        alert("För kombinerat diagram, välj exakt två mått.");
                        return prevMeasures;
                      }
                    } else if (chartType === "pie") {
                      if (selected.length > 1) {
                        alert("För pajdiagram, välj exakt ett mått.");
                        return prevMeasures;
                      }
                    } else {
                      if (selected.length > 1) {
                        alert(
                          "För stapel-, linje- eller staplat diagram, välj exakt ett mått."
                        );
                        return prevMeasures;
                      }
                    }
                    return newMeasures;
                  });
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
            {measures
              .filter((m) => m.isSelected)
              .map((measure) => (
                <div key={measure.name} className="flex items-center mb-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="barMeasure"
                      value={measure.name}
                      checked={barMeasure === measure.name}
                      onChange={() => setBarMeasure(measure.name)}
                      className="mr-2"
                    />
                    {measure.name}
                  </label>
                </div>
              ))}
            <h4 className="text-xl font-semibold mb-2">
              Välj Mått för Linjediagram
            </h4>
            {measures
              .filter((m) => m.isSelected)
              .map((measure) => (
                <div key={measure.name} className="flex items-center mb-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="lineMeasure"
                      value={measure.name}
                      checked={lineMeasure === measure.name}
                      onChange={() => setLineMeasure(measure.name)}
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
            className="bg-trafaOrange"
          >
            Börja om
          </Button>
        </div>
        <div className="mt-4">
          <Button
            onClick={handleGenerateChart}
            variant="primary"
            className="w-full"
          >
            Generera diagram
          </Button>
        </div>
      </div>
      <div>
        {dimensions
          .filter(
            (dim) =>
              !xAxisDimensions.includes(dim.name) &&
              dim.name !== seriesDimension
          )
          .map((dim) => (
            <div key={dim.name} className="mb-4">
              <h3 className="text-2xl font-bold mb-4">Filter</h3>
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
                  handleGenerateChart();
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
        {(chartType === "column" ||
          chartType === "pie" ||
          chartType === "combo" ||
          chartType === "stacked") && <div className="mb-4"></div>}
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
      </div>
    </Card>
  );
};
