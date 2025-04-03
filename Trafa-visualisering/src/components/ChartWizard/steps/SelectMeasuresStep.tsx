import React from "react";
import { Button } from "../../UI/Button";
import { ChartType, Measure, WizardStep } from "../../../types/chartTypes";
import { Card } from "../../UI/Card";

type Props = {
  chartType: ChartType;
  measures: Measure[];
  setMeasures: React.Dispatch<React.SetStateAction<Measure[]>>;
  variwideWidthMeasure: string | null;
  setVariwideWidthMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  variwideHeightMeasure: string | null;
  setVariwideHeightMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  setBarMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  setLineMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  barMeasure: string | null;
  lineMeasure: string | null;

  setStep: (step: WizardStep) => void;
};

export const SelectMeasuresStep: React.FC<Props> = ({
  chartType,
  measures,
  setMeasures,
  setStep,
  variwideWidthMeasure,
  setVariwideWidthMeasure,
  variwideHeightMeasure,
  setVariwideHeightMeasure,
  barMeasure,
  lineMeasure,
  setBarMeasure,
  setLineMeasure,
}) => {
  return (
    <Card>
      <div>
        {chartType === "variwide" ? (
          <h3 className="text-2xl font-bold mb-4">Mått för variwde diagram</h3>
        ) : chartType === "combo" ? (
          <h3 className="text-2xl font-bold mb-4">
            Mått för kombinerat diagram
          </h3>
        ) : (
          <h3 className="text-2xl font-bold mb-4">Välj mått</h3>
        )}
      </div>

      {!["combo", "variwide"].includes(chartType) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {measures.map((measure) => (
              <label
                key={measure.name}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  measure.isSelected
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={measure.isSelected}
                  onChange={(e) =>
                    setMeasures((prev) =>
                      prev.map((m) =>
                        m.name === measure.name
                          ? { ...m, isSelected: e.target.checked }
                          : m
                      )
                    )
                  }
                  className="mr-3 h-5 w-5 text-blue-600"
                />
                <div>
                  <span className="text-style">
                    {measure.name} {measure.unit && `(${measure.unit})`}
                  </span>
                </div>
              </label>
            ))}
          </div>{" "}
        </>
      )}

      {chartType === "combo" && (
        <div className="mb-4 p-3">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <h4 className="text-xl font-semibold mb-2">
                Välj mått för stapel
              </h4>
              {measures.map((measure) => (
                <div key={measure.name} className="flex items-center mb-2">
                  <label className="flex items-center space-x-2 pl-2">
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
                Välj mått för linje
              </h4>
              {measures.map((measure) => (
                <div key={measure.name} className="flex items-center mb-2">
                  <label className="flex items-center space-x-2 pl-2">
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
          </div>{" "}
        </div>
      )}

      {chartType === "variwide" && (
        <div className="mb-4 p-3">
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
                      disabled={variwideHeightMeasure === measure.name}
                      className="mr-2"
                    />
                    {measure.name}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold mb-2">Välj mått för höjd</h4>
              {measures.map((measure) => (
                <div key={measure.name} className="flex items-center mb-2">
                  <label className="flex items-center space-x-2 pl-2">
                    <input
                      type="radio"
                      name="variwideHeightMeasure"
                      value={measure.name}
                      checked={variwideHeightMeasure === measure.name}
                      onChange={() => setVariwideHeightMeasure(measure.name)}
                      disabled={variwideWidthMeasure === measure.name}
                      className="mr-2"
                    />
                    {measure.name}
                  </label>
                </div>
              ))}
            </div>
          </div>{" "}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button
          onClick={() => setStep("filter-dimensions")}
          variant="secondary"
        >
          Tillbaka
        </Button>
        <Button
          onClick={() => {
            if (chartType === "variwide") {
              if (!variwideWidthMeasure || !variwideHeightMeasure) {
                alert(
                  "För variwide diagram, välj ett mått för bredd och ett mått för höjd."
                );
                return;
              }
            } else if (chartType === "combo") {
              if (!barMeasure || !lineMeasure) {
                alert(
                  "För kombinerat diagram, välj ett mått för stapel och ett mått för linje."
                );
                return;
              }
            } else {
              const selected = measures.filter((m) => m.isSelected);
              if (selected.length !== 1) {
                alert("För detta diagram, välj ett mått.");
                return;
              }
            }

            setStep("chart-configuration");
          }}
          variant="primary"
        >
          Nästa
        </Button>
      </div>
    </Card>
  );
};
