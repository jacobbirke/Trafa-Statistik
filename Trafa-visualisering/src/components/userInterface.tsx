import React from "react";
import { Dimension, Measure } from "./Gränssnitt";

export function userInterface(step: string, handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void, setStep: React.Dispatch<React.SetStateAction<"input-file" | "select-dimensions" | "filter-dimensions" | "select-measures" | "chart-configuration" | "review-generate">>, handleSelectAllDimensions: () => void, handleDeselectAllDimensions: () => void, dimensions: Dimension[], selectedDimensions: Dimension[], setSelectedDimensions: React.Dispatch<React.SetStateAction<Dimension[]>>, handleSelectAllDimensionValues: (dimensionName: string) => void, handleDeselectAllDimensionValues: (dimensionName: string) => void, handleSelectAllMeasures: () => void, handleDeselectAllMeasures: () => void, measures: Measure[], setMeasures: React.Dispatch<React.SetStateAction<Measure[]>>, xAxisDimensions: string[], setXAxisDimensions: React.Dispatch<React.SetStateAction<string[]>>, chartType: string, setChartType: React.Dispatch<React.SetStateAction<"column" | "line">>, barMeasure: string | null, setBarMeasure: React.Dispatch<React.SetStateAction<string | null>>, lineMeasure: string | null, setLineMeasure: React.Dispatch<React.SetStateAction<string | null>>, handleGenerateChart: () => void, containerRef: React.MutableRefObject<HTMLDivElement | null>): React.ReactNode {
  return <div>
    {step === "input-file" && (
      <div>
        <h3>Ladda upp fil</h3>
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileUpload} />
        <button onClick={() => setStep("select-dimensions")}>Nästa</button>
      </div>
    )}

    {step === "select-dimensions" && (
      <div>
        <h3>Välj Dimensioner</h3>
        <button onClick={handleSelectAllDimensions}>Markera alla</button>
        <button onClick={handleDeselectAllDimensions}>Ta bort alla</button>
        {dimensions.map((dim) => (
          <div key={dim.name}>
            <label>
              <input
                type="checkbox"
                checked={selectedDimensions.some((d) => d.name === dim.name)}
                onChange={(e) => setSelectedDimensions((prev) => e.target.checked
                  ? [...prev, { ...dim, selectedValues: [] }]
                  : prev.filter((d) => d.name !== dim.name)
                )} />
              {dim.name} {dim.unit && `(${dim.unit})`}
            </label>
          </div>
        ))}
        <button onClick={() => setStep("input-file")}>Tillbaka</button>
        <button onClick={() => setStep("filter-dimensions")}>Nästa</button>
      </div>
    )}

    {step === "filter-dimensions" && (
      <div>
        <h3>Filtrera Dimensioner</h3>
        {selectedDimensions.map((dim) => (
          <div key={dim.name}>
            <h4>{dim.name}</h4>
            <button onClick={() => handleSelectAllDimensionValues(dim.name)}>
              Markera alla
            </button>
            <button
              onClick={() => handleDeselectAllDimensionValues(dim.name)}
            >
              Ta bort alla
            </button>
            {dim.allValues.map((value) => (
              <div key={value}>
                <label>
                  <input
                    type="checkbox"
                    checked={dim.selectedValues.includes(value)}
                    onChange={(e) => setSelectedDimensions((prev) => prev.map((d) => d.name === dim.name
                      ? {
                        ...d,
                        selectedValues: e.target.checked
                          ? [...d.selectedValues, value]
                          : d.selectedValues.filter(
                            (v) => v !== value
                          ),
                      }
                      : d
                    )
                    )} />
                  {value}
                </label>
              </div>
            ))}
          </div>
        ))}
        <button onClick={() => setStep("select-dimensions")}>Tillbaka</button>
        <button
          onClick={() => {
            const allDimensionsValid = selectedDimensions.every(
              (dim) => dim.selectedValues.length > 0
            );

            if (!allDimensionsValid) {
              alert("Välj minst ett värde för varje vald dimension");
              return;
            }

            setStep("select-measures");
          }}
        >
          Nästa
        </button>
      </div>
    )}

    {step === "select-measures" && (
      <div>
        <h3>Välj Mått</h3>
        <button onClick={handleSelectAllMeasures}>Markera alla</button>
        <button onClick={handleDeselectAllMeasures}>Ta bort alla</button>
        {measures.map((measure) => (
          <div key={measure.name}>
            <label>
              <input
                type="checkbox"
                checked={measure.isSelected}
                onChange={(e) => setMeasures((prev) => prev.map((m) => m.name === measure.name
                  ? { ...m, isSelected: e.target.checked }
                  : m
                )
                )} />
              {measure.name} {measure.unit && `(${measure.unit})`}
            </label>
          </div>
        ))}
        <button onClick={() => setStep("filter-dimensions")}>Tillbaka</button>
        <button onClick={() => setStep("chart-configuration")}>Nästa</button>
      </div>
    )}

    {step === "chart-configuration" && (
      <div>
        <h3>Diagramkonfiguration</h3>
        <div>
          <h4>Välj X-Axel (Dimension)</h4>
          {selectedDimensions.map((dim) => (
            <div key={dim.name}>
              <label>
                <input
                  type="checkbox"
                  name="xAxis"
                  value={dim.name}
                  checked={xAxisDimensions.includes(dim.name)}
                  onChange={() => {
                    if (xAxisDimensions.includes(dim.name)) {
                      setXAxisDimensions((prev) => prev.filter((name) => name !== dim.name)
                      );
                    } else {
                      if (xAxisDimensions.length < 2) {
                        setXAxisDimensions((prev) => [...prev, dim.name]);
                      } else {
                        alert(
                          "Du kan bara välja två dimensioner för x-axeln."
                        );
                      }
                    }
                  }} />
                {dim.name}
              </label>
            </div>
          ))}
        </div>
        {measures.filter((measure) => measure.isSelected).length === 1 && (
          <div>
            <h4>Välj Diagramtyp</h4>
            <label>
              <input
                type="radio"
                name="chartType"
                value="column"
                checked={chartType === "column"}
                onChange={() => setChartType("column")} />
              Stapeldiagram
            </label>
            <label>
              <input
                type="radio"
                name="chartType"
                value="line"
                checked={chartType === "line"}
                onChange={() => setChartType("line")} />
              Linjediagram
            </label>
          </div>
        )}
        {measures.filter((measure) => measure.isSelected).length > 1 && (
          <div>
            <h4>Välj Mått för Stapeldiagram</h4>
            {measures
              .filter((measure) => measure.isSelected)
              .map((measure) => (
                <div key={measure.name}>
                  <label>
                    <input
                      type="radio"
                      name="barMeasure"
                      value={measure.name}
                      checked={barMeasure === measure.name}
                      onChange={() => setBarMeasure(measure.name)} />
                    {measure.name}
                  </label>
                </div>
              ))}
            <h4>Välj Mått för Linjediagram</h4>
            {measures
              .filter((measure) => measure.isSelected)
              .map((measure) => (
                <div key={measure.name}>
                  <label>
                    <input
                      type="radio"
                      name="lineMeasure"
                      value={measure.name}
                      checked={lineMeasure === measure.name}
                      onChange={() => setLineMeasure(measure.name)} />
                    {measure.name}
                  </label>
                </div>
              ))}
          </div>
        )}
        <button onClick={() => setStep("select-measures")}>Tillbaka</button>
        <button
          onClick={() => {
            if (xAxisDimensions.length === 0) {
              alert("Välj minst en dimension för x-axeln.");
              return;
            }

            if (measures.filter((measure) => measure.isSelected).length > 1 &&
              (!barMeasure || !lineMeasure)) {
              alert(
                "Välj mått för både stapel- och linjediagram när flera mått är valda."
              );
              return;
            }

            setStep("review-generate");
          }}
        >
          Nästa
        </button>
      </div>
    )}

    {step === "review-generate" && (
      <div>
        <button onClick={handleGenerateChart}>Generera diagram</button>
      </div>
    )}

    <div
      id="container"
      ref={containerRef}
      style={{ width: "100%", height: "600px" }} />
  </div>;
}
