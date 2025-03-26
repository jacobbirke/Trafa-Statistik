import React, { useEffect } from "react";
import { Button } from "../../UI/Button";
import {
  ChartType,
  Dimension,
  Measure,
  WizardStep,
} from "../../../types/chartTypes";
import { Card } from "../../UI/Card";

type Props = {
  chartType: ChartType;
  dimensions: Dimension[];
  measures: Measure[];
  xAxisDimensions: string[];
  seriesDimension: string | null;
  barMeasure: string | null;
  lineMeasure: string | null;
  setXAxisDimensions: React.Dispatch<React.SetStateAction<string[]>>;
  setSeriesDimension: React.Dispatch<React.SetStateAction<string | null>>;
  setBarMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  setLineMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  setStep: (step: WizardStep) => void;
  variwideWidthMeasure: string | null;
  setVariwideWidthMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  variwideHeightMeasure: string | null;
  setVariwideHeightMeasure: React.Dispatch<React.SetStateAction<string | null>>;
};

export const ChartConfigurationStep: React.FC<Props> = ({
  chartType,
  dimensions,
  measures,
  xAxisDimensions,
  seriesDimension,
  barMeasure,
  lineMeasure,
  setXAxisDimensions,
  setSeriesDimension,
  setBarMeasure,
  setLineMeasure,
  setStep,
  variwideWidthMeasure,
  setVariwideWidthMeasure,
  variwideHeightMeasure,
  setVariwideHeightMeasure,
}) => {
  const maxXAxisAllowed =
    chartType === "variwide" ||
    chartType === "stacked" ||
    chartType === "stackedArea"
      ? 1
      : 2;

  useEffect(() => {
    if (xAxisDimensions.length > maxXAxisAllowed) {
      setXAxisDimensions([]);
    }
  }, [chartType, xAxisDimensions.length, maxXAxisAllowed, setXAxisDimensions]);

  const handleXAxisChange = (dimName: string) => {
    if (xAxisDimensions.includes(dimName)) {
      setXAxisDimensions((prev) => prev.filter((name) => name !== dimName));
    } else {
      if (xAxisDimensions.length < maxXAxisAllowed) {
        setXAxisDimensions((prev) => [...prev, dimName]);
      } else {
        alert(
          `Du kan bara välja ${maxXAxisAllowed} dimension${
            maxXAxisAllowed === 1 ? "" : "er"
          } för x-axeln.`
        );
      }
    }
  };

  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4">Diagramkonfiguration</h3>

      {chartType === "variwide" && (
        <>
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-2">
              Välj kategori för x-axeln
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dimensions.map((dim) => (
                <label
                  key={dim.name}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    xAxisDimensions.includes(dim.name)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={xAxisDimensions.includes(dim.name)}
                    onChange={() => handleXAxisChange(dim.name)}
                    className="mr-3 h-5 w-5 text-blue-600"
                  />
                  <div>
                    <span className="text-style">{dim.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-2 p-1">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-2">
                  Välj mått för bredd
                </h4>
                {measures
                  .filter((m) => m.isSelected)
                  .map((measure) => (
                    <div key={measure.name} className="flex items-center mb-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="variwideWidthMeasure"
                          value={measure.name}
                          checked={variwideWidthMeasure === measure.name}
                          onChange={() => setVariwideWidthMeasure(measure.name)}
                          disabled={variwideHeightMeasure === measure.name}
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
                {measures
                  .filter((m) => m.isSelected)
                  .map((measure) => (
                    <div key={measure.name} className="flex items-center mb-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="variwideHeightMeasure"
                          value={measure.name}
                          checked={variwideHeightMeasure === measure.name}
                          onChange={() =>
                            setVariwideHeightMeasure(measure.name)
                          }
                          disabled={variwideWidthMeasure === measure.name}
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

      {chartType === "pie" ? (
        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-2">
            Välj dimension för serie
          </h4>
          <select
            value={seriesDimension || ""}
            onChange={(e) => setSeriesDimension(e.target.value || null)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Ingen</option>
            {dimensions.map((dim) => (
              <option key={dim.name} value={dim.name}>
                {dim.name}
              </option>
            ))}
          </select>
        </div>
      ) : chartType !== "variwide" ? (
        <>
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-2">
              Välj kategori{chartType === "stacked" ? "" : "er"} för x-axeln
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dimensions.map((dim) => (
                <label
                  key={dim.name}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    xAxisDimensions.includes(dim.name)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={xAxisDimensions.includes(dim.name)}
                    onChange={() => handleXAxisChange(dim.name)}
                    className="mr-3 h-5 w-5 text-blue-600"
                  />
                  <div>
                    <span className="text-style">
                      {dim.name}
                      {xAxisDimensions[0] === dim.name &&
                        chartType !== "stacked" && (
                          <span className="ml-2 text-blue-500">
                            - Huvudkategori
                          </span>
                        )}
                      {xAxisDimensions[1] === dim.name && (
                        <span className="ml-2 text-blue-500">
                          - Underkategori
                        </span>
                      )}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-2">
              Välj dimension för serie
            </h4>
            <select
              value={seriesDimension || ""}
              onChange={(e) => setSeriesDimension(e.target.value || null)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Ingen</option>
              {dimensions.map((dim) => (
                <option key={dim.name} value={dim.name}>
                  {dim.name}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : null}

      {chartType === "combo" && (
        <div className="mb-4 p-1">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <h4 className="text-xl font-semibold mb-2">
                Välj Mått för Stapel
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
            </div>

            <div className="flex-1">
              <h4 className="text-xl font-semibold mb-2">
                Välj Mått för Linje
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
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button onClick={() => setStep("select-measures")} variant="secondary">
          Tillbaka
        </Button>
        <Button onClick={() => setStep("review-generate")} variant="primary">
          Nästa
        </Button>
      </div>
    </Card>
  );
};
