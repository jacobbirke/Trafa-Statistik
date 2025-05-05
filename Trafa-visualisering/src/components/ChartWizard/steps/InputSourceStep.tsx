import React from "react";
import { Button } from "../../UI/Button";
import { Card } from "../../UI/Card";
import { WizardStep } from "../../../types/chartTypes";

export const InputSourceStep: React.FC<{
  setStep: (step: WizardStep) => void;
}> = ({ setStep }) => (
  <Card className="flex flex-col items-center gap-4">
    <h3 className="text-2xl font-bold">Välj datakälla</h3>
    <div className="flex gap-4">
      <Button onClick={() => setStep("input-file")} variant="primary">
        Ladda upp fil
      </Button>
      <Button onClick={() => setStep("select-api-product")} variant="primary">
        Använd Trafikanalys API
      </Button>
    </div>
  </Card>
);