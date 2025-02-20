import React from "react";
import { Button } from "../../UI/Button";
import { ChartType, WizardStep } from "../../../types/chartTypes";

type Props = {
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
  setStep: (step: WizardStep) => void;
};

const chartOptions = [
  { value: "column", label: "Stapeldiagram", icon: "📊" },
  { value: "line", label: "Linjediagram", icon: "📈" },
  { value: "combo", label: "Kombinerat (Stapel & Linje)", icon: "🔀" },
  { value: "stacked", label: "Staplad kolumn", icon: "🗃️" },
  { value: "pie", label: "Pajdiagram", icon: "🥧" },
];

export const SelectDiagramTypeStep: React.FC<Props> = ({
  chartType,
  setChartType,
  setStep,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-bold mb-4">Välj Diagramtyp</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {chartOptions.map((option) => (
        <label
          key={option.value}
          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            chartType === option.value
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-200"
          }`}
        >
          <input
            type="radio"
            name="diagramType"
            value={option.value}
            checked={chartType === option.value}
            onChange={() => setChartType(option.value as ChartType)}
            className="mr-3 h-5 w-5 text-blue-600"
          />
          <div>
            <span className="text-lg font-medium text-gray-700">
              {option.icon} {option.label}
            </span>
          </div>
        </label>
      ))}
    </div>
    <div className="mt-6 flex justify-between">
      <Button onClick={() => setStep("input-file")} variant="secondary">
        Tillbaka
      </Button>
      <Button onClick={() => setStep("filter-dimensions")} variant="primary">
        Nästa
      </Button>
    </div>
  </div>
);
