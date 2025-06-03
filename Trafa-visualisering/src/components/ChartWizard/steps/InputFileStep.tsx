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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md md:max-w-3xl max-h-[90vh] overflow-y-auto z-10 border border-blue-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl transition-colors"
        >
          &times;
        </button>
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center bg-blue-100 p-3 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h4 className="text-2xl font-bold text-gray-800 mb-1">
            Instruktioner för filuppladdning
          </h4>
          <p className="mb-4">
            Kontrollera att filen du laddar upp uppfyller följande krav så att
            data kan visualiseras korrekt:
          </p>
        </div>

        <div className="space-y-4 text-gray-700">
          <div>
            <h5 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                1
              </span>
              Tillåtna filformat
            </h5>
            <div className="flex gap-3 mb-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                .xlsx
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                .xls
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                .csv
              </span>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                2
              </span>
              Filstruktur
            </h5>
            <ul className="space-y-2 pl-1">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>Rubrikrad:</strong> Den första raden i filen ska
                  innehålla rubriker som beskriver varje kolumn.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>Data:</strong> Efter rubrikraden ska varje rad
                  innehålla en komplett uppsättning data med samma ordning som
                  rubrikerna.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                3
              </span>
              Suffix krav för rubrik
            </h5>
            <ul className="space-y-2 pl-1">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>Mått:</strong> Avsluta med{" "}
                  <code className="bg-blue-50 px-1.5 py-0.5 rounded">_M</code>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>Konfidensintervall:</strong> Avsluta med{" "}
                  <code className="bg-blue-50 px-1.5 py-0.5 rounded">_KI</code>
                </span>
              </li>
              <span>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  Övriga kolumner (såsom år, kön, kategorier, etc.) får ha egna
                  benämningar och bör vara konsekventa i hela filen.
                </li>
              </span>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h5 className="font-semibold text-lg mb-3 text-blue-700">
              Exempel på filstruktur
            </h5>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      År
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Kön
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Körda kilometer_M
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Konfidensintervall_KI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border-b">2012</td>
                    <td className="px-4 py-2 border-b">Män</td>
                    <td className="px-4 py-2 border-b">3,039,045</td>
                    <td className="px-4 py-2 border-b">90,875</td>
                  </tr>
                  <tr className="bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border-b">2012</td>
                    <td className="px-4 py-2 border-b">Kvinnor</td>
                    <td className="px-4 py-2 border-b">3,060,026</td>
                    <td className="px-4 py-2 border-b">114,939</td>
                  </tr>
                  <tr className="bg-white even:bg-gray-50">
                    <td className="border px-4 py-2">2013</td>
                    <td className="border px-4 py-2">Män</td>
                    <td className="border px-4 py-2">3031433</td>
                    <td className="border px-4 py-2">107667</td>
                  </tr>
                  <tr className="bg-white even:bg-gray-50">
                    <td className="border px-4 py-2">2013</td>
                    <td className="border px-4 py-2">Kvinnor</td>
                    <td className="border px-4 py-2">3043152</td>
                    <td className="border px-4 py-2">106251</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
    handleFileUpload(e);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      const event = {
        target: {
          files: e.dataTransfer.files,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      handleFileUpload(event);
    }
  };

  return (
    <Card className="relative flex flex-col items-center ">
      <button
        onClick={toggleInstructions}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-blue-100 focus:outline-none transition-colors"
        aria-label="Instruktioner"
      >
        <svg
          className="h-6 w-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <InfoModal isOpen={showInstructions} onClose={toggleInstructions} />
      <div className="text-center mb-4">
        <div className="mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-14 text-blue-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">
          Ladda upp din datafil
        </h3>
        <p className="text-gray-600 mt-2">
          Stöd för Excel (.xlsx, .xls) och CSV filer
        </p>
      </div>

      <div
        className={`w-full max-w-md rounded-2xl border-2 border-dashed mb-4 ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } transition-colors duration-300 p-8 text-center cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <input
          id="file-upload"
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="space-y-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-12 w-12 mx-auto ${
              isDragging ? "text-blue-500" : "text-gray-400"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <div>
            {fileName ? (
              <div className="font-medium text-blue-600">
                <span className="truncate block">{fileName}</span>
                <span className="text-sm text-green-600 mt-1 block">
                  Fil vald! Klicka på Nästa för att fortsätta
                </span>
              </div>
            ) : (
              <>
                <p className="font-medium text-gray-700">
                  <span className="text-blue-600 font-semibold">
                    Klicka för att bläddra
                  </span>{" "}
                  eller dra och släpp din fil här
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto mt-4">
        <Button
          onClick={() => setStep("input-source")}
          variant="secondary"
          className="flex-1 py-3"
        >
          Tillbaka
        </Button>
        <Button
          onClick={() => fileName && setStep("select-diagram-type")}
          variant="primary"
          className="flex-1 py-3"
          disabled={!fileName}
        >
          Nästa
        </Button>
      </div>

    </Card>
  );
};
