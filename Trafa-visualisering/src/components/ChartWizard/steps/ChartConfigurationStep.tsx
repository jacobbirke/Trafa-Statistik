import React from "react";
import { Button } from "../../UI/Button";
import {
  ChartType,
  Dimension,
  Measure,
  WizardStep,
} from "../../../types/chartTypes";

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
}) => {
  const handleXAxisChange = (dimName: string) => {
    const maxAllowed = chartType === "stacked" ? 1 : 2;
    if (xAxisDimensions.includes(dimName)) {
      setXAxisDimensions((prev) => prev.filter((name) => name !== dimName));
    } else {
      if (xAxisDimensions.length < maxAllowed) {
        setXAxisDimensions((prev) => [...prev, dimName]);
      } else {
        alert(
          `Du kan bara välja ${maxAllowed} dimension${
            maxAllowed === 1 ? "" : "er"
          } för x-axeln.`
        );
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">Diagramkonfiguration</h3>

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
      ) : (
        <>
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-2">
              Välj kategori{chartType === "stacked" ? "" : "er"} för x-axeln
            </h4>
            <div className="space-y-2">
              {dimensions.map((dim) => (
                <label
                  key={dim.name}
                  className="flex items-center p-2 rounded-md hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={xAxisDimensions.includes(dim.name)}
                    onChange={() => handleXAxisChange(dim.name)}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-700">
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
      )}

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

      <div className="flex justify-between mt-6">
        <Button onClick={() => setStep("select-measures")} variant="secondary">
          Tillbaka
        </Button>
        <Button onClick={() => setStep("review-generate")} variant="primary">
          Nästa
        </Button>
      </div>
    </div>
  );
};
