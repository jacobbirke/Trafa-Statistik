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

function unwrapItem(it: any): { code: string; label: string; unit?: string } {
  const attr = it["@attributes"] || {};

  const code =
    attr.Name ??
    (typeof it.Name === "object" ? it.Name["#text"] : undefined) ??
    it.Name ??
    "";

  const label =
    attr.Label ??
    it.Label ??
    (typeof it.Value === "object" ? it.Value["#text"] : undefined) ??
    attr.Value ??
    it.Value ??
    "";

  const unit = attr.Unit ?? it.Unit ?? "";

  return { code: String(code), label: String(label), unit: String(unit) };
}

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
    if (!productId) return;

    const fetchStructure = async () => {
      try {
        const resp = await fetch(
          `https://api.trafa.se/api/structure?query=${encodeURIComponent(
            productId
          )}&lang=sv`
        );
        const text = await resp.text();

        let itemsRaw: any[] = [];
        try {
          const json = JSON.parse(text);
          itemsRaw = Array.isArray(json.StructureItems)
            ? json.StructureItems
            : json.StructureItems
            ? [json.StructureItems]
            : [];
        } catch {
          const parsed = xmlToJson(text);
          let xmlItems =
            parsed?.StructureResponseWrapper?.StructureItems?.StructureItem;
          itemsRaw = Array.isArray(xmlItems)
            ? xmlItems
            : xmlItems
            ? [xmlItems]
            : [];
        }

        const children = itemsRaw.filter(
          (item) =>
            item.ParentName === productId ||
            item["@attributes"]?.ParentName === productId
        );
        const childArr = Array.isArray(children) ? children : [children];

        const dims = childArr
          .filter(
            (it: any) => it.Type === "D" || it["@attributes"]?.Type === "D"
          )
          .map((it: any) => {
            const { code, label } = unwrapItem(it);
            return {
              name: label,
              variable: code,
              allValues: [],
              selectedValues: [],
              unit: "",
            } as Dimension;
          });

        const meas = childArr
          .filter(
            (it: any) => it.Type === "M" || it["@attributes"]?.Type === "M"
          )
          .map((it: any) => {
            const { code, label, unit } = unwrapItem(it);
            return {
              name: label,
              variable: code,
              unit,
              isSelected: false,
              isConfidence: false,
            } as Measure;
          });

        setDimensionsMeta(dims);
        setMeasuresMeta(meas);
        setMeasures(meas);
      } catch (err) {
        console.error("fetchStructure failed:", err);
        setError("Kunde inte ladda struktur");
      }
    };

    fetchStructure();
  }, [productId]);

  const handleBuildQuery = () => {
    const measureKeys = selectedMeasures.map((m) => m.variable);
    const dimKeys = selectedDimensions.map((d) => d.variable);
    const fullQuery = [productId, ...measureKeys, ...dimKeys].join("|");
    setQuery(fullQuery);

    const dimsForParent = dimensionsMeta.filter((d) =>
      selectedDimensions.some((sd) => sd.variable === d.name)
    );
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-1">
            {dimensionsMeta.map((dim) => (
              <Button
                key={dim.variable}
                variant={
                  selectedDimensions.some((d) => d.variable === dim.variable)
                    ? "primary"
                    : "secondary"
                }
                onClick={() =>
                  setSelectedDimensions((prev) =>
                    prev.some((d) => d.variable === dim.variable)
                      ? prev.filter((d) => d.variable !== dim.variable)
                      : [...prev, { variable: dim.variable }]
                  )
                }
              >
                {dim.name}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Mått</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-1">
            {measuresMeta.map((me) => (
              <Button
                key={me.variable}
                variant={
                  selectedMeasures.some((m) => m.variable === me.variable)
                    ? "primary"
                    : "secondary"
                }
                onClick={() =>
                  setSelectedMeasures((prev) =>
                    prev.some((m) => m.variable === me.variable)
                      ? prev.filter((m) => m.variable !== me.variable)
                      : [...prev, { variable: me.variable }]
                  )
                }
                className="text-center"
              >
                {me.name}
              </Button>
            ))}
          </div>
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
