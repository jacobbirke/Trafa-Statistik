// src/components/ChartWizard/steps/ConfigureApiQueryStep.tsx

import React, { useEffect, useState } from "react";
import { Button } from "../../UI/Button";
import { QueryPart, WizardStep } from "../../../types/chartTypes";
import { Card } from "../../UI/Card";
import { xmlToJson } from "../../../utils/xmlUtils";
import { ApiStructure, Dimension, Measure } from "../../../types/chartTypes";

interface ConfigureApiQueryStepProps {
  productId: string;
  setQuery: (query: string) => void;
  setStep: (step: WizardStep) => void;
  setDimensions: React.Dispatch<React.SetStateAction<Dimension[]>>;
  setMeasures: React.Dispatch<React.SetStateAction<Measure[]>>;
}

export const ConfigureApiQueryStep: React.FC<ConfigureApiQueryStepProps> = ({
  productId,
  setQuery,
  setStep,
  setDimensions,
  setMeasures,
}) => {
  const [structure, setStructure] = useState<ApiStructure | null>(null);
  const [selectedDimensions, setSelectedDimensions] = useState<QueryPart[]>([]);

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        const response = await fetch(
          `https://api.trafa.se/api/structure?query=${productId}&lang=sv`
        );
        const text = await response.text();
        const data = xmlToJson(text);
        
        const dimensions = (data.StructureResponseWrapper.StructureItems.StructureItem || [])
          .filter((item: any) => item.Type === "D")
          .map((dim: any) => ({
            name: dim.Name,
            label: dim.Label,
            values: dim.Values?.Value || []
          }));

        const measures = (data.StructureResponseWrapper.StructureItems.StructureItem || [])
          .filter((item: any) => item.Type === "M")
          .map((measure: any) => ({
            name: `${measure.Name}_M`,
            label: measure.Label,
            unit: measure.Unit || '',
            isSelected: true,
            isConfidence: false
          }));

        setStructure({ dimensions, measures });
        setMeasures(measures);
      } catch (error) {
        console.error("Fel vid hämtning av API-struktur:", error);
      }
    };

    fetchStructure();
  }, [productId, setMeasures]);

  const handleBuildQuery = () => {
    const queryParts = selectedDimensions.map(d => 
      d.filters?.length ? `${d.variable}:${d.filters.join(",")}` : d.variable
    );
    setQuery([productId, ...queryParts].join("|"));
    setStep("select-diagram-type");
  };

  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4">API-konfiguration</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg font-semibold mb-2">Tillgängliga dimensioner</h4>
          {structure?.dimensions.map((dim: any) => (
            <Button
              key={dim.name}
              onClick={() => setSelectedDimensions([...selectedDimensions, { variable: dim.name }])}
              variant="secondary"
            >
              {dim.label}
            </Button>
          ))}
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Valda dimensioner</h4>
          {selectedDimensions.map((dim, index) => (
            <div key={index} className="p-2 bg-gray-100 rounded mb-2">
              {dim.variable}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <Button onClick={() => setStep("select-api-product")} variant="secondary">
          Tillbaka
        </Button>
        <Button onClick={handleBuildQuery} variant="primary">
          Hämta data
        </Button>
      </div>
    </Card>
  );
};