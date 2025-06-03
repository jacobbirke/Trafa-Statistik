import React, { useEffect, useState } from "react";
import { Card } from "../../UI/Card";
import { Button } from "../../UI/Button";
import { xmlToJson } from "../../../utils/xmlUtils";
import { Dimension, Measure, WizardStep } from "../../../types/chartTypes";

interface Props {
  query: string;
  setStep: (step: WizardStep) => void;
  setDimensions: React.Dispatch<React.SetStateAction<Dimension[]>>;
  setMeasures: React.Dispatch<React.SetStateAction<Measure[]>>;
  setJsonData: React.Dispatch<React.SetStateAction<any[][]>>;
}

export const DisplayApiDataStep: React.FC<Props> = ({
  query,
  setStep,
  setDimensions,
  setMeasures,
  setJsonData,
}) => {
  const [data, setData] = useState<any[][] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(
          `https://api.trafa.se/api/data?query=${encodeURIComponent(
            query
          )}&lang=sv`
        );
        const text = await resp.text();
        let wrapped: any;
        if (text.trim().startsWith("<")) {
          wrapped = xmlToJson(text).StatisticsData;
        } else {
          wrapped = JSON.parse(text);
        }
        const headerColumns =
          wrapped.Header?.Column?.Column ?? wrapped.Header?.Column ?? [];
        const colArray = Array.isArray(headerColumns)
          ? headerColumns
          : [headerColumns];

        const headers = colArray.map((c: any) => {
          const type = c["@attributes"]?.Type || c.Type;
          const value = c.Value?.["#text"] || c.Value;

          if (value && /konfidensintervall/i.test(value)) {
            return `${value}_KI`;
          } else if (type === "M") {
            return `${value}_M`;
          } else {
            return value;
          }
        });

        const rowsNode = wrapped.Rows?.Row ?? wrapped.Rows ?? [];
        const rowArray = Array.isArray(rowsNode) ? rowsNode : [rowsNode];
        const rows = rowArray.map((r: any) => {
          const cells = Array.isArray(r.Cell?.Cell)
            ? r.Cell.Cell
            : Array.isArray(r.Cell)
            ? r.Cell
            : [];
          return cells.map((cell: any) => {
            const rawValue = cell.Value?.["#text"] || cell.Value;
            if (typeof rawValue === "string") {
              const cleanValue = rawValue.replace(/\s+/g, "").replace(",", ".");
              const num = parseFloat(cleanValue);
              return isNaN(num) ? rawValue : num;
            }
            return rawValue;
          });
        });

        setData([headers, ...rows]);
        setJsonData([headers, ...rows]);
        const dimNames = headers.filter(
          (h) => !h.endsWith("_M") && !h.endsWith("_KI")
        );
        const dims: Dimension[] = dimNames.map((name) => {
          const idx = headers.indexOf(name);
          const vals = rows.map((r) => r[idx]?.toString() ?? "");
          return {
            name,
            variable: name,
            allValues: Array.from(new Set(vals)),
            selectedValues: [],
            unit: "",
          };
        });
        setDimensions(dims);

        const measures: Measure[] = headers
          .map((h, i) => ({ header: h, idx: i }))
          .filter((c) => c.header.endsWith("_M") || c.header.endsWith("_KI"))
          .map((c) => {
            const isConfidence = c.header.endsWith("_KI");
            const baseName = isConfidence
              ? c.header.replace(/_KI$/, "")
              : c.header.replace(/_M$/, "");
            return {
              name: baseName,
              variable: c.header, 
              unit: "",
              isSelected: false,
              isConfidence,
            };
          });
        setMeasures(measures);
      } catch (e: any) {
        console.error(e);
        setError("Kunde inte hämta data från API");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);
  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4">Resultat från API</h3>

      {loading && <p>Hämtar data…</p>}
      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              {data[0].map((h, i) => (
                <th key={i} className="border px-2 py-1">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border px-2 py-1">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex gap-4 justify-end">
        <Button
          variant="secondary"
          onClick={() => setStep("select-api-product")}
        >
          Börja om
        </Button>
        <Button
          variant="secondary"
          onClick={() => setStep("configure-api-query")}
        >
          Tillbaka
        </Button>
        <Button
          variant="primary"
          onClick={() => setStep("select-diagram-type")}
          disabled={!data}
        >
          Fortsätt
        </Button>
      </div>
    </Card>
  );
};
