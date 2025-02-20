import React from "react";
import { Button } from "../../UI/Button";
import { ChartType, Measure, WizardStep } from "../../../types/chartTypes";

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
      default:
        return "För detta diagram, välj exakt ett mått.";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">Välj Mått</h3>
      <p className="text-gray-600 mb-4">{getInstruction()}</p>

      <div className="space-y-2">
        {measures.map((measure) => (
          <label
            key={measure.name}
            className="flex items-center p-2 rounded-md hover:bg-gray-50"
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
              className="mr-2 h-4 w-4 text-blue-600"
            />
            <span className="text-gray-700">
              {measure.name} {measure.unit && `(${measure.unit})`}
            </span>
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
            if (chartType === "combo" && selected.length !== 2) {
              alert("För kombinerat diagram, välj exakt två mått.");
              return;
            }
            if (chartType === "pie" && selected.length !== 1) {
              alert("För pajdiagram, välj exakt ett mått.");
              return;
            }
            // if (selected.length !== 1) {
            //   alert("För detta diagram, välj exakt ett mått.");
            //   return;
            // }
            setStep("chart-configuration");
          }}
          variant="primary"
        >
          Nästa
        </Button>
      </div>
    </div>
  );
};
