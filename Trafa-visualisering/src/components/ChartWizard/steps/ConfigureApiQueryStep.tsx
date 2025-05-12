import React, { useEffect, useState } from "react";
import { Button } from "../../UI/Button";
import { Card } from "../../UI/Card";
import { xmlToJson } from "../../../utils/xmlUtils";
import {
  QueryPart,
  WizardStep,
  Dimension,
  Measure,
} from "../../../types/chartTypes";

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
  const [dimensionsMeta, setDimensionsMeta] = useState<Dimension[]>([]);
  const [measuresMeta, setMeasuresMeta] = useState<Measure[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<QueryPart[]>([]);
  const [selectedMeasures, setSelectedMeasures] = useState<QueryPart[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        const resp = await fetch(
          `https://api.trafa.se/api/structure?query=${encodeURIComponent(
            productId
          )}&lang=sv`
        );
        const text = await resp.text();
        let items: any[] = [];
        try {
          const json = JSON.parse(text);
          items = json.StructureItems || [];
        } catch {
          const parsed = xmlToJson(text);
          items =
            parsed?.StructureResponseWrapper?.StructureItems?.StructureItem ||
            [];
        }

        const dims: Dimension[] = items
          .filter((i) => i.Type === "D" || i["@attributes"]?.Type === "D")
          .map((i: any) => {
            const name = i.Name || i["@attributes"]?.Name;
            const allValues = Array.isArray(i.Values?.Value)
              ? i.Values.Value.map((v: any) => v.Code || v["@attributes"]?.Code)
              : i.Values?.Value
              ? [i.Values.Value.Code || i.Values.Value["@attributes"]?.Code]
              : [];
            return { name, allValues, selectedValues: [], unit: "" };
          });

        const meas: Measure[] = items
          .filter((i) => i.Type === "M" || i["@attributes"]?.Type === "M")
          .map((i: any) => {
            const name = i.Name || i["@attributes"]?.Name;
            const unit = i.Unit || i["@attributes"]?.Unit?.Value || "";
            return { name, unit, isSelected: false, isConfidence: false };
          });

        setDimensionsMeta(dims);
        setMeasuresMeta(meas);
        setMeasures(meas);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Kunde inte ladda struktur");
      }
    };
    if (productId) fetchStructure();
  }, [productId, setMeasures]);

  const handleBuildQuery = () => {
    const measureKeys = selectedMeasures.map((m) => m.variable);
    const dimKeys = selectedDimensions.map((d) => d.variable);
    const fullQuery = [productId, ...measureKeys, ...dimKeys].join("|");
    setQuery(fullQuery);

    const dimsForParent: Dimension[] = dimensionsMeta
      .filter((d) => selectedDimensions.some((sd) => sd.variable === d.name))
      .map((d) => ({ ...d }));
    setDimensions(dimsForParent);

    setStep("fetch-data");
  };

  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4">API-konfiguration</h3>
      {error && <p className="text-red-500 mb-2">Fel: {error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg font-semibold mb-2">Dimensioner</h4>
          {dimensionsMeta.map((dim) => (
            <Button
              key={dim.name}
              variant={
                selectedDimensions.some((d) => d.variable === dim.name)
                  ? "primary"
                  : "secondary"
              }
              onClick={() =>
                setSelectedDimensions((prev) =>
                  prev.some((d) => d.variable === dim.name)
                    ? prev.filter((d) => d.variable !== dim.name)
                    : [...prev, { variable: dim.name }]
                )
              }
            >
              {dim.name}
            </Button>
          ))}
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Mått</h4>
          {measuresMeta.map((me) => (
            <Button
              key={me.name}
              variant={
                selectedMeasures.some((m) => m.variable === me.name)
                  ? "primary"
                  : "secondary"
              }
              onClick={() =>
                setSelectedMeasures((prev) =>
                  prev.some((m) => m.variable === me.name)
                    ? prev.filter((m) => m.variable !== me.name)
                    : [...prev, { variable: me.name }]
                )
              }
            >
              {me.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <Button
          variant="secondary"
          onClick={() => setStep("select-api-product")}
        >
          Tillbaka
        </Button>
        <Button
          onClick={handleBuildQuery}
          variant="primary"
          disabled={selectedDimensions.length + selectedMeasures.length === 0}
        >
          Hämta data
        </Button>
      </div>
    </Card>
  );
};
