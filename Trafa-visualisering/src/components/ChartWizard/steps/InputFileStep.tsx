import React from "react";
import { Button } from "../../UI/Button";
import { WizardStep } from "../../../types/chartTypes";
import { Card } from "../../UI/Card";

type Props = {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setStep: (step: WizardStep) => void;
};

export const InputFileStep: React.FC<Props> = ({
  handleFileUpload,
  setStep,
}) => {
  return (
    <Card className="p-20 flex flex-col items-center">
      <h3 className="text-2xl font-bold text-center">Ladda upp fil</h3>
      <h6 className="text-center mb-10">.xlsx, .xls, .csv</h6>

      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        className="m-5 block w-full max-w-md text-sm text-gray-600 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded mx-auto"
      />

      <Button
        onClick={() => setStep("select-diagram-type")}
        variant="primary"
        className="w-full max-w-md mx-auto mt-5"
      >
        Nästa
      </Button>
    </Card>
  );
};
