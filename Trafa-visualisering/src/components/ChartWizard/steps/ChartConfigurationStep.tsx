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
  setXAxisDimensions: React.Dispatch<React.SetStateAction<string[]>>;
  setSeriesDimension: React.Dispatch<React.SetStateAction<string | null>>;
  setStep: (step: WizardStep) => void;
};

export const ChartConfigurationStep: React.FC<Props> = ({
  chartType,
  dimensions,
  xAxisDimensions,
  seriesDimension,
  setXAxisDimensions,
  setSeriesDimension,
  setStep,
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
                      ? "border-blue-500 bg-blue-100"
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
                      ? "border-blue-500 bg-blue-100"
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
