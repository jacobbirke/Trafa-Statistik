import React from "react";
import { Button } from "../../UI/Button";
import { Dimension, WizardStep } from "../../../types/chartTypes";
import { Card } from "../../UI/Card";

type Props = {
  dimensions: Dimension[];
  setDimensions: React.Dispatch<React.SetStateAction<Dimension[]>>;
  setStep: (step: WizardStep) => void;
};

export const FilterDimensionsStep: React.FC<Props> = ({
  dimensions,
  setDimensions,
  setStep,
}) => {
  const handleSelectAll = (dimName: string) => {
    setDimensions((prev) =>
      prev.map((d) =>
        d.name === dimName ? { ...d, selectedValues: [...d.allValues] } : d
      )
    );
  };

  const handleDeselectAll = (dimName: string) => {
    setDimensions((prev) =>
      prev.map((d) => (d.name === dimName ? { ...d, selectedValues: [] } : d))
    );
  };

  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4">Filtrera dimensioner</h3>
      {dimensions.map((dim) => (
        <div key={dim.name} className="border p-4 mb-4 rounded-lg">
          <div className="flex gap-2 mb-2">          
            <h4 className="text-xl font-semibold mr-4 p-1">{dim.name}</h4>
            <Button
              onClick={() => handleSelectAll(dim.name)}
              variant="success"
              className="text-sm"
            >
              Markera alla
            </Button>
            <Button
              onClick={() => handleDeselectAll(dim.name)}
              variant="danger"
              className="text-sm"
            >
              Ta bort alla
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {dim.allValues.map((value) => (
              <label
                key={value}
                className={`flex items-center p-2 rounded-md border ${
                  dim.selectedValues.includes(value)
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={dim.selectedValues.includes(value)}
                  onChange={(e) =>
                    setDimensions((prev) =>
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
                    )
                  }
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                <span className="text-style">{value}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-between mt-6">
        <Button
          onClick={() => setStep("select-diagram-type")}
          variant="secondary"
        >
          Tillbaka
        </Button>
        <Button
          onClick={() => {
            const allValid = dimensions.every(
              (d) => d.selectedValues.length > 0
            );
            if (!allValid) {
              alert("Välj minst ett värde för varje dimension");
              return;
            }
            setStep("select-measures");
          }}
          variant="primary"
        >
          Nästa
        </Button>
      </div>
    </Card>
  );
};
