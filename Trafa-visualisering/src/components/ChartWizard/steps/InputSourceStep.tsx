import React, { useState } from "react";
import { Button } from "../../UI/Button";
import { Card } from "../../UI/Card";
import { WizardStep } from "../../../types/chartTypes";

const InfoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-sm md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto z-10 border border-blue-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl transition-colors"
        >
          &times;
        </button>
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center bg-blue-100 p-3 rounded-full mb-4">
            <svg
              className="h-8 w-8 text-blue-500"
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
          </div>
          <h4 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Möjligheter i gränssnittet
          </h4>
          <p className="text-gray-700 mb-6">
            Du kan anpassa och redigera diagrammet på flera sätt för att det ska
            passa dina behov. Här är de huvudsakliga funktionerna:
          </p>
        </div>
        <ul className="space-y-4 text-gray-700 text-sm md:text-base">
          <li className="flex gap-2">
            <span className="text-blue-500">●</span>{" "}
            <div>
              <strong>Diagramtyp:</strong> Välj mellan olika diagramtyper,
              exempelvis stapeldiagram, kombinerade linje- och stapeldiagram,
              pajdiagram och variwide för att presentera data på ett sätt som
              bäst passar din analys.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500">●</span>

            <div>
              <strong>Färg- och ikonalternativ:</strong> Anpassa färger för
              serier och mått. Du kan även välja olika ikoner för linjer för att
              visualisera data tydligare.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500">●</span>

            <div>
              <strong>Enheter:</strong> Bestäm vad du vill ha för enhet till
              måttvärdet.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500">●</span>

            <div>
              <strong>Dimensioner och roller:</strong> Välj vilka dimensioner
              som ska användas som x-axel (huvudkategori och underkategori),
              serie och filter.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500">●</span>

            <div>
              <strong>Y-axel inställningar:</strong> Redigera y-axelns titel,
              samt ställa in min/max-värden och intervall. Du kan även välja
              position på y-axelns titel.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500">●</span>

            <div>
              <strong>Legendposition:</strong> Bestäm var legenden ska placeras,
              exempelvis uppe, nere, vänster, höger eller inuti diagrammet.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500">●</span>

            <div>
              <strong>Inbäddningskod:</strong> Generera inbäddningskod som gör
              det möjligt att bädda in diagrammet på externa sidor.
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export const InputSourceStep: React.FC<{
  setStep: (step: WizardStep) => void;
}> = ({ setStep }) => {
  const [showInfo, setShowInfo] = useState(true);

  const toggleInfo = () => setShowInfo((prev) => !prev);

  return (
    <Card className="relative flex flex-col items-center gap-6 p-8">
      <button
        onClick={toggleInfo}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
        aria-label="Visa information om gränssnittet"
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
      <InfoModal isOpen={showInfo} onClose={toggleInfo} />

      <div className="text-center">
        <div className="inline-flex items-center justify-center bg-blue-100 p-4 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
            />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-3">
          Välj datakälla
        </h3>
        <p className="text-lg text-gray-600 max-w-md">
          Du kan antingen ladda upp en egen fil för att visualisera data eller
          välja färdiga dataset från Trafikanalys API.
        </p>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-6 mt-2">
        <Button
          onClick={() => setStep("input-file")}
          variant="primary"
          className="flex-1 py-5 group transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex items-center justify-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-lg font-medium">Ladda upp fil</span>
          </div>
        </Button>

        <Button
          onClick={() => setStep("select-api-product")}
          variant="success"
          className="flex-1 py-5 group transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex items-center justify-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
              />
            </svg>
            <span className="text-lg font-medium">Använd Trafikanalys API</span>
          </div>
        </Button>
      </div>
    </Card>
  );
};
