import React, { useState } from "react";
import { Button } from "../../UI/Button";
import { WizardStep } from "../../../types/chartTypes";
import { Card } from "../../UI/Card";

const InfoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white p-4 md:p-8 rounded shadow-lg w-full max-w-sm md:max-w-2xl lg:max-w-4xl max-h-[95dvh] overflow-y-auto z-10">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
        >
          &times;
        </button>
        <h4 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          Instruktioner och krav för filuppladdning
        </h4>
        <p className="mb-4">
          Kontrollera att filen du laddar upp uppfyller följande krav så att
          data kan visualiseras korrekt:
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-900 space-y-2 text-sm md:text-base">
          <li className="mb-2">
            <strong>Tillåtna filformat:</strong>{" "}
            <span className="text-blue-600">.xlsx, .xls, .csv</span>
          </li>
          <li className="mb-2">
            <strong>Filstruktur:</strong>
            <ol className="list-decimal pl-6 mt-2">
              <li>
                <strong>Rubrikrad:</strong> Den första raden i filen ska
                innehålla rubriker som beskriver varje kolumn.
              </li>
              <li>
                <strong>Data:</strong> Efter rubrikraden ska varje rad innehålla
                en komplett uppsättning data med samma ordning som rubrikerna.
              </li>
            </ol>
          </li>
          <li className="mb-2">
            <strong>Suffix krav för kolumnnamn:</strong>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Mått (värden):</strong> Rubriker för mätvärden ska sluta
                med <code>_M</code>.
              </li>
              <li>
                <strong>Konfidensintervall:</strong> Möjlighet för visualisering
                med felmarginal finns för stapel och linjediagram. Om
                tillhörande konfidensintervall finns ska det märkas med{" "}
                <code>_KI</code>.
              </li>
              <li>
                Övriga kolumner (såsom år, kön, kategorier, etc.) får ha egna
                benämningar och bör vara konsekventa i hela filen.
              </li>
            </ul>
          </li>
          <li className="mb-2">
            <strong>Exempel på filstruktur:</strong>
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full bg-white border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-4 py-2 text-left">År</th>
                    <th className="border px-4 py-2 text-left">Kön</th>
                    <th className="border px-4 py-2 text-left">
                      Körda kilometer i 1000-tal_M
                    </th>
                    <th className="border px-4 py-2 text-left">
                      95% konfidensintervall för körda kilometer i 1000-tal_KI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2">2012</td>
                    <td className="border px-4 py-2">Män</td>
                    <td className="border px-4 py-2">3039045</td>
                    <td className="border px-4 py-2">90875</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">2012</td>
                    <td className="border px-4 py-2">Kvinnor</td>
                    <td className="border px-4 py-2">3060026</td>
                    <td className="border px-4 py-2">114939</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2">2013</td>
                    <td className="border px-4 py-2">Män</td>
                    <td className="border px-4 py-2">3031433</td>
                    <td className="border px-4 py-2">107667</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">2013</td>
                    <td className="border px-4 py-2">Kvinnor</td>
                    <td className="border px-4 py-2">3043152</td>
                    <td className="border px-4 py-2">106251</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>
        </ul>

        <h2 className="text-lg md:text-xl font-bold mb-2 mt-6">Möjligheter i gränssnittet</h2>
        <p className="mb-4">
          Du kan anpassa och redigera diagrammet på flera sätt för att det ska
          passa dina behov. Här är de huvudsakliga funktionerna:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-900 text-sm md:text-base">
          <li>
            <strong>Diagramtyp:</strong> Välj mellan olika diagramtyper,
            exempelvis stapeldiagram, kombinerade linje- och stapeldiagram,
            pajdiagram, och variwide för att presentera data på ett sätt som
            bäst passar din analys.
          </li>
          <li>
            <strong>Färg- och ikonalternativ:</strong> Anpassa färger för serier
            och mått. Du kan även välja olika ikoner för linjer för att
            visualisera data tydligare.
          </li>
          <li>
            <strong>Enheter:</strong> Bestäm vad du vill ha för enhet till
            måttvärdet.
          </li>
          <li>
            <strong>Dimensioner och roller:</strong> Välj vilka dimensioner som
            ska användas som x-axel (huvudkategori och underkategori), serie och
            filter.
          </li>
          <li>
            <strong>Y-axel inställningar:</strong> Redigera y-axelns titel, samt
            ställa in min/max-värden och intervall. Du kan även välja position
            på y-axelns titel.
          </li>
          <li>
            <strong>Legendposition:</strong> Bestäm var legenden ska placeras,
            exempelvis uppe, nere, vänster, höger eller inuti diagrammet.
          </li>
          <li>
            <strong>Inbäddningskod:</strong> Generera inbäddningskod som gör det
            möjligt att bädda in diagrammet på externa sidor.
          </li>
        </ul>
      </div>
    </div>
  );
};

type Props = {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setStep: (step: WizardStep) => void;
};

export const InputFileStep: React.FC<Props> = ({
  handleFileUpload,
  setStep,
}) => {
  const [showInstructions, setShowInstructions] = useState(true);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <Card className="relative flex flex-col items-center">
      <button
        onClick={toggleInstructions}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
        aria-label="Toggle instructions"
      >
        <svg
          className="h-6 w-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <InfoModal isOpen={showInstructions} onClose={toggleInstructions} />
      <div>
        <h3 className="text-2xl font-bold text-center">Ladda upp fil</h3>
        <h6 className="text-center mb-10">
          Möjliga filformat (.xlsx, .xls, .csv)
        </h6>
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileUpload}
          className="m-5 block w-full max-w-md text-sm text-gray-600 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded mx-auto"
        />
      </div>
      <Button
        onClick={() => setStep("select-diagram-type")}
        variant="primary"
        className="w-full max-w-md mx-auto mt-5"
      >
        Nästa
      </Button>{" "}
    </Card>
  );
};
