import React from "react";
import { Button } from "../../UI/Button";
import { ChartType, Measure, WizardStep } from "../../../types/chartTypes";
import { Card } from "../../UI/Card";

type Props = {
  chartType: ChartType;
  measures: Measure[];
  confidenceMeasures: Measure[];
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
  confidenceMeasure: string | null;
  setConfidenceMeasure: (measure: string | null) => void;
};

export const SelectMeasuresStep: React.FC<Props> = ({
  chartType,
  measures,
  confidenceMeasures,
  setMeasures,
  variwideWidthMeasure,
  setVariwideWidthMeasure,
  variwideHeightMeasure,
  setVariwideHeightMeasure,
  barMeasure,
  lineMeasure,
  setBarMeasure,
  setLineMeasure,
  confidenceMeasure,
  setConfidenceMeasure,
  setStep,
}) => {
  const handleMeasureCheckbox = (measureName: string, checked: boolean) => {
    setMeasures((prev) =>
      prev.map((m) =>
        m.name === measureName
          ? { ...m, isSelected: checked }
          : {
              ...m,
              isSelected:
                chartType === "errorbar-column" ||  chartType === "errorbar-line" ? false : m.isSelected,
            }
      )
    );
  };

  const renderTitle = () => {
    switch (chartType) {
      case "variwide":
        return "Mått för variwide diagram";
      case "combo":
        return "Mått för kombinerat diagram";
      case "errorbar-column":
        return "Välj mått för kolumndiagram med felstaplar";
        case "errorbar-line":
          return "Välj mått för linjediagram med felmarginal";
      default:
        return "Välj mått";
    }
  };

  const filteredMeasures =
    chartType === "errorbar-column" ||  chartType === "errorbar-line"
      ? measures.filter((measure) => !measure.isConfidence)
      : measures;

  return (
    <Card>
      <div>
        <h3 className="text-2xl font-bold mb-4">{renderTitle()}</h3>
      </div>

      {chartType !== "combo" && chartType !== "variwide" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeasures.map((measure) => (
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
                  handleMeasureCheckbox(measure.name, e.target.checked)
                }
                className="mr-3 h-5 w-5 text-blue-600"
              />
              <span className="text-style">
                {measure.name} {measure.unit && `(${measure.unit})`}
              </span>
            </label>
          ))}
        </div>
      )}

      {chartType === "combo" && (
        <div className="mb-4 p-3">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <h4 className="text-xl font-semibold mb-2">
                Välj mått för stapel
              </h4>
              {measures.map((measure) => (
                <label
                  key={measure.name}
                  className="flex items-center space-x-2 pl-2 mb-2"
                >
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
              ))}
            </div>

            <div className="flex-1">
              <h4 className="text-xl font-semibold mb-2">
                Välj mått för linje
              </h4>
              {measures.map((measure) => (
                <label
                  key={measure.name}
                  className="flex items-center space-x-2 pl-2 mb-2"
                >
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
              ))}
            </div>
          </div>
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
                <label
                  key={measure.name}
                  className="flex items-center space-x-2 pl-2 mb-2"
                >
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
              ))}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold mb-2">Välj mått för höjd</h4>
              {measures.map((measure) => (
                <label
                  key={measure.name}
                  className="flex items-center space-x-2 pl-2 mb-2"
                >
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
              ))}
            </div>
          </div>
        </div>
      )}

      {(chartType === "errorbar-column" ||  chartType === "errorbar-line") &&  (
        <div className="mt-6">
          <h4 className="text-xl font-semibold mb-2">
            Välj konfidensintervall för valt mått
          </h4>
          <select
            value={confidenceMeasure || ""}
            onChange={(e) => setConfidenceMeasure(e.target.value || null)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Ingen</option>
            {confidenceMeasures.map((cm) => (
              <option key={cm.name} value={cm.name}>
                {cm.name} {cm.unit && `(${cm.unit})`}
              </option>
            ))}
          </select>
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
            const selected = measures.filter((m) => m.isSelected);

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
            } else if (chartType === "errorbar-line") {
              if (selected.length !== 1) {
                alert(
                  "För ett linjediagram med felmarginal, välj exakt ett mått."
                );
                return;
              }
            } else if (chartType === "errorbar-column") {
              if (selected.length !== 1) {
                alert(
                  "För ett stapeldiagram med felmarginal, välj exakt ett mått."
                );
                return;
              }
              if (!confidenceMeasure) {
                alert("Välj ett konfidensintervall för det valda måttet.");
                return;
              }
            } else {
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
