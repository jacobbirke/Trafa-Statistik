import React from "react";
import { Button } from "../../UI/Button";
import { ChartType, Measure, WizardStep } from "../../../types/chartTypes";
import { Card } from "../../UI/Card";

type Props = {
  chartType: ChartType;
  measures: Measure[];
  setMeasures: React.Dispatch<React.SetStateAction<Measure[]>>;

  setStep: (step: WizardStep) => void;
};

export const SelectMeasuresStep: React.FC<Props> = ({
  chartType,
  measures,
  setMeasures,
  setStep,
}) => {
  const getInstruction = () => {
    switch (chartType) {
      case "combo":
        return "För kombinerat diagram, välj exakt två mått.";
      case "pie":
        return "För pajdiagram, välj exakt ett mått.";
      case "variwide":
        return "Välj exakt två mått (ett för höjd, ett för bredd)";
      default:
        return "För detta diagram, välj exakt ett mått.";
    }
  };

  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4 ">Välj Mått</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"></div>
      <p className="text-gray-600 mb-4">{getInstruction()}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {measures.map((measure) => (
          <label
            key={measure.name}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              measure.isSelected
                ? "border-blue-500 bg-blue-50"
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
      </div>

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
              if (selected.length !== 2) {
                alert("För variwide diagram, välj exakt två mått.");
                return;
              }
            } else if (chartType === "combo") {
              if (selected.length !== 2) {
                alert("För kombinerat diagram, välj exakt två mått.");
                return;
              }
            } else if (chartType === "pie") {
              if (selected.length !== 1) {
                alert("För pajdiagram, välj exakt ett mått.");
                return;
              }
            } else {
              if (selected.length !== 1) {
                alert("För detta diagram, välj exakt ett mått.");
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
