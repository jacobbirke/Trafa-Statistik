import React from "react";
import { Button } from "../../UI/Button";
import { WizardStep } from "../../../types/chartTypes";

type Props = {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setStep: (step: WizardStep) => void;
};

export const InputFileStep: React.FC<Props> = ({
  handleFileUpload,
  setStep,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-bold mb-4">Ladda upp fil</h3>
    <input
      type="file"
      accept=".xlsx, .xls, .csv"
      onChange={handleFileUpload}
      className="mb-4 block w-full text-sm text-gray-600 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded"
    />
    <Button onClick={() => setStep("select-diagram-type")} variant="primary">
      Nästa
    </Button>
  </div>
);
