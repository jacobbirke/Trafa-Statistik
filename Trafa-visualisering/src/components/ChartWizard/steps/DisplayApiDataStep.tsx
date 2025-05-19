import React, { useEffect, useState } from "react";
import { Card } from "../../UI/Card";
import { Button } from "../../UI/Button";
import { xmlToJson } from "../../../utils/xmlUtils";
import { WizardStep } from "../../../types/chartTypes";

interface Props {
  query: string;
  setStep: (step: WizardStep) => void;
}

export const DisplayApiDataStep: React.FC<Props> = ({ query, setStep }) => {
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
          return type === "M" ? `${value}_M` : value;
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
          onClick={() => setStep("filter-dimensions")}
          disabled={!data}
        >
          Fortsätt till filtrering
        </Button>
      </div>
    </Card>
  );
};
