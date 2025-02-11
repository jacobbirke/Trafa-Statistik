import React from "react";
import { Dimension, Measure } from "./Gränssnitt";

export function userInterface(
  step: string,
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
  setStep: React.Dispatch<
    React.SetStateAction<
      | "input-file"
      | "select-diagram-type"
      | "filter-dimensions"
      | "select-measures"
      | "chart-configuration"
      | "review-generate"
    >
  >,
  dimensions: Dimension[],
  setDimensions: React.Dispatch<React.SetStateAction<Dimension[]>>,
  handleSelectAllMeasures: () => void,
  handleDeselectAllMeasures: () => void,
  measures: Measure[],
  setMeasures: React.Dispatch<React.SetStateAction<Measure[]>>,
  xAxisDimensions: string[],
  setXAxisDimensions: React.Dispatch<React.SetStateAction<string[]>>,
  chartType: "column" | "line" | "combo",
  setChartType: React.Dispatch<React.SetStateAction<"column" | "line" | "combo">>,
  barMeasure: string | null,
  setBarMeasure: React.Dispatch<React.SetStateAction<string | null>>,
  lineMeasure: string | null,
  setLineMeasure: React.Dispatch<React.SetStateAction<string | null>>,
  seriesDimension: string | null,
  setSeriesDimension: React.Dispatch<React.SetStateAction<string | null>>,
  handleGenerateChart: () => void,
  handleGoBack: () => void, // New parameter
  containerRef: React.MutableRefObject<HTMLDivElement | null>
): React.ReactNode {
  return (
    <div>
      {step === "input-file" && (
        <div>
          <h3>Ladda upp fil</h3>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
          />
          <button onClick={() => setStep("select-diagram-type")}>Nästa</button>
        </div>
      )}

      {step === "select-diagram-type" && (
        <div>
          <h3>Välj Diagramtyp</h3>
          <label>
            <input
              type="radio"
              name="diagramType"
              value="column"
              checked={chartType === "column"}
              onChange={() => setChartType("column")}
            />
            Stapeldiagram
          </label>
          <label>
            <input
              type="radio"
              name="diagramType"
              value="line"
              checked={chartType === "line"}
              onChange={() => setChartType("line")}
            />
            Linjediagram
          </label>
          <label>
            <input
              type="radio"
              name="diagramType"
              value="combo"
              checked={chartType === "combo"}
              onChange={() => setChartType("combo")}
            />
            Kombinerat (Stapel & Linje)
          </label>
          <div>
            <button onClick={() => setStep("input-file")}>Tillbaka</button>
            <button onClick={() => setStep("filter-dimensions")}>Nästa</button>
          </div>
        </div>
      )}

      {step === "filter-dimensions" && (
        <div>
          <h3>Filtrera Dimensioner</h3>
          {dimensions.map((dim) => (
            <div key={dim.name}>
              <h4>{dim.name}</h4>
              <button
                onClick={() =>
                  setDimensions((prev) =>
                    prev.map((d) =>
                      d.name === dim.name
                        ? { ...d, selectedValues: [...d.allValues] }
                        : d
                    )
                  )
                }
              >
                Markera alla
              </button>
              <button
                onClick={() =>
                  setDimensions((prev) =>
                    prev.map((d) =>
                      d.name === dim.name ? { ...d, selectedValues: [] } : d
                    )
                  )
                }
              >
                Ta bort alla
              </button>
              {dim.allValues.map((value) => (
                <div key={value}>
                  <label>
                    <input
                      type="checkbox"
                      checked={dim.selectedValues.includes(value)}
                      onChange={(e) =>
                        setDimensions((prev) =>
                          prev.map((d) => {
                            if (d.name === dim.name) {
                              if (e.target.checked) {
                                return {
                                  ...d,
                                  selectedValues: [...d.selectedValues, value],
                                };
                              } else {
                                return {
                                  ...d,
                                  selectedValues: d.selectedValues.filter(
                                    (v) => v !== value
                                  ),
                                };
                              }
                            }
                            return d;
                          })
                        )
                      }
                    />
                    {value}
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button onClick={() => setStep("select-diagram-type")}>
            Tillbaka
          </button>
          <button
            onClick={() => {
              const allValid = dimensions.every(
                (dim) => dim.selectedValues && dim.selectedValues.length > 0
              );
              if (!allValid) {
                alert("Välj minst ett värde för varje dimension");
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
          {chartType === "combo" ? (
            <p>För kombinerat diagram, välj exakt två mått.</p>
          ) : (
            <p>
              För {chartType === "line" ? "linjediagram" : "stapeldiagram"},
              välj exakt ett mått.
            </p>
          )}
          <button onClick={handleSelectAllMeasures}>Markera alla</button>
          <button onClick={handleDeselectAllMeasures}>Ta bort alla</button>
          {measures.map((measure) => (
            <div key={measure.name}>
              <label>
                <input
                  type="checkbox"
                  checked={measure.isSelected}
                  onChange={(e) =>
                    setMeasures((prev) =>
                      prev.map((m) =>
                        m.name === measure.name
                          ? { ...m, isSelected: e.target.checked }
                          : m
                      )
                    )
                  }
                />
                {measure.name} {measure.unit && `(${measure.unit})`}
              </label>
            </div>
          ))}
          <button onClick={() => setStep("filter-dimensions")}>Tillbaka</button>
          <button
            onClick={() => {
              const selectedMs = measures.filter((m) => m.isSelected);
              if (chartType === "column" || chartType === "line") {
                if (selectedMs.length !== 1) {
                  alert("För stapel- eller linjediagram, välj exakt ett mått.");
                  return;
                }
              } else if (chartType === "combo") {
                if (selectedMs.length !== 2) {
                  alert("För kombinerat diagram, välj exakt två mått.");
                  return;
                }
              }
              setStep("chart-configuration");
            }}
          >
            Nästa
          </button>
        </div>
      )}

      {step === "chart-configuration" && (
        <div>
          <h3>Diagramkonfiguration</h3>
          <div>
            <h4>Välj kategori för x-axeln (Dimension)</h4>
            {dimensions.map((dim) => (
              <div key={dim.name}>
                <label>
                  <input
                    type="checkbox"
                    name="xAxis"
                    value={dim.name}
                    checked={xAxisDimensions.includes(dim.name)}
                    onChange={() => {
                      if (xAxisDimensions.includes(dim.name)) {
                        setXAxisDimensions((prev) =>
                          prev.filter((name) => name !== dim.name)
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
                    }}
                  />
                  {dim.name}
                </label>
              </div>
            ))}
          </div>
          <div>
            <h4>Välj Dimension för Serier</h4>
            <select
              value={seriesDimension || ""}
              onChange={(e) => setSeriesDimension(e.target.value || null)}
            >
              <option value="">Ingen</option>
              {dimensions.map((dim) => (
                <option key={dim.name} value={dim.name}>
                  {dim.name}
                </option>
              ))}
            </select>
          </div>

          {measures.filter((m) => m.isSelected).length > 1 &&
            chartType === "combo" && (
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
                          onChange={() => setBarMeasure(measure.name)}
                        />
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
                          onChange={() => setLineMeasure(measure.name)}
                        />
                        {measure.name}
                      </label>
                    </div>
                  ))}
              </div>
            )}

          {measures.filter((m) => m.isSelected).length === 1 &&
            (chartType === "column" || chartType === "line") && (
              <div>
                <h4>Valt diagramtyp:</h4>
                <p>
                  {chartType === "column" ? "Stapeldiagram" : "Linjediagram"}
                </p>
              </div>
            )}

          <button onClick={() => setStep("select-measures")}>Tillbaka</button>
          <button
            onClick={() => {
              if (xAxisDimensions.length === 0) {
                alert("Välj minst en dimension för x-axeln.");
                return;
              } else if (chartType === "combo") {
                if (!barMeasure || !lineMeasure) {
                  alert(
                    "Välj mått för både stapel- och linjediagram när kombinerat diagram är valt."
                  );
                  return;
                }
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
          <button onClick={handleGoBack}>Tillbaka</button>
        </div>
      )}

      <div
        id="container"
        ref={containerRef}
        style={{ width: "100%", height: "600px" }}
      />
    </div>
  );
}
