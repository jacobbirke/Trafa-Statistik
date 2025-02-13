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
  chartType: "column" | "line" | "combo" | "pie" | "stacked",
  setChartType: React.Dispatch<
    React.SetStateAction<"column" | "line" | "combo" | "pie" | "stacked">
  >,
  barMeasure: string | null,
  setBarMeasure: React.Dispatch<React.SetStateAction<string | null>>,
  lineMeasure: string | null,
  setLineMeasure: React.Dispatch<React.SetStateAction<string | null>>,
  seriesDimension: string | null,
  setSeriesDimension: React.Dispatch<React.SetStateAction<string | null>>,
  handleGenerateChart: () => void,
  handleGoBack: () => void,
  containerRef: React.MutableRefObject<HTMLDivElement | null>
): React.ReactNode {
  const getDimensionRole = (
    dimName: string
  ): "main" | "sub" | "series" | "filter" => {
    if (xAxisDimensions[0] === dimName) return "main";
    if (xAxisDimensions[1] === dimName) return "sub";
    if (seriesDimension === dimName) return "series";
    return "filter";
  };
  const handleDimensionRoleChange = (
    dimName: string,
    newRole: "main" | "sub" | "series" | "filter"
  ) => {
    setDimensions((prev) => {
      let updatedXAxis = [...xAxisDimensions];
      updatedXAxis = updatedXAxis.filter((name) => name !== dimName);
      let updatedSeriesDim =
        seriesDimension === dimName ? null : seriesDimension;

      if (newRole === "main") {
        updatedXAxis[0] = dimName;
        if (updatedXAxis[1] === dimName) updatedXAxis[1] = "";
      } else if (newRole === "sub") {
        if (!updatedXAxis[0]) {
          updatedXAxis[0] = "";
        }
        updatedXAxis[1] = dimName;
      } else if (newRole === "series") {
        updatedSeriesDim = dimName;
      }
      updatedXAxis = updatedXAxis.filter(Boolean);

      setXAxisDimensions(updatedXAxis);
      setSeriesDimension(updatedSeriesDim);

      return prev;
    });
  };
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
          <label>
            <input
              type="radio"
              name="diagramType"
              value="stacked"
              checked={chartType === "stacked"}
              onChange={() => setChartType("stacked")}
            />
            Staplad kolumn
          </label>
          <label>
            <input
              type="radio"
              name="diagramType"
              value="pie"
              checked={chartType === "pie"}
              onChange={() => {
                setChartType("pie");
                setSeriesDimension(null);
              }}
            />
            Pajdiagram
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
          ) : chartType === "pie" ? (
            <p>För pajdiagram, välj exakt ett mått.</p>
          ) : (
            <p>
              För{" "}
              {chartType === "line" || chartType === "stacked"
                ? "linjediagram"
                : "stapeldiagram"}
              , välj exakt ett mått.
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
              if (chartType === "combo") {
                if (selectedMs.length !== 2) {
                  alert("För kombinerat diagram, välj exakt två mått.");
                  return;
                }
              } else if (chartType === "pie") {
                if (selectedMs.length !== 1) {
                  alert("För pajdiagram, välj exakt ett mått.");
                  return;
                }
              } else {
                if (selectedMs.length !== 1) {
                  alert(
                    "För stapel-, linje- eller staplat diagram, välj exakt ett mått."
                  );
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
          {chartType === "pie" ? (
            <div>
              <h4>Välj dimension för serie</h4>
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
          ) : (
            <div>
              <h4>
                Välj kategori{chartType === "stacked" ? "" : "er"} för x-axeln {chartType === "stacked" ? "" : "(första valet blir huvudkategori, om du väljer en till så blir den underkategori)"}
              </h4>
              {dimensions.map((dim) => (
                <div key={dim.name}>
                  <label>
                    <input
                      type="checkbox"
                      name="xAxis"
                      value={dim.name}
                      checked={xAxisDimensions.includes(dim.name)}
                      onChange={() => {
                        const maxAllowed: number =
                          chartType === "stacked" ? 1 : 2;
                        if (xAxisDimensions.includes(dim.name)) {
                          setXAxisDimensions((prev) =>
                            prev.filter((name) => name !== dim.name)
                          );
                        } else {
                          if (xAxisDimensions.length < maxAllowed) {
                            setXAxisDimensions((prev) => [...prev, dim.name]);
                          } else {
                            alert(
                              `Du kan bara välja ${maxAllowed} dimension${
                                maxAllowed === 1 ? "" : "er"
                              } för x-axeln.`
                            );
                          }
                        }
                      }}
                    />
                    {dim.name}{" "}
                    {xAxisDimensions[0] === dim.name &&
                      chartType !== "stacked" && (
                        <strong>- Huvudkategori</strong>
                      )}
                    {xAxisDimensions[1] === dim.name && (
                      <strong>- Underkategori</strong>
                    )}
                  </label>
                </div>
              ))}
            </div>
          )}
          {chartType !== "pie" && (
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
          )}
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
            (chartType === "column" ||
              chartType === "line" ||
              chartType === "stacked") && (
              <div>
                <h4>Valt diagramtyp:</h4>
                <p>
                  {chartType === "column"
                    ? "Stapeldiagram"
                    : chartType === "line"
                    ? "Linjediagram"
                    : "Staplat diagram"}
                </p>
              </div>
            )}
          <button onClick={() => setStep("select-measures")}>Tillbaka</button>
          <button
            onClick={() => {
              if (chartType !== "pie" && xAxisDimensions.length === 0) {
                alert("Välj minst en dimension för x-axeln.");
                return;
              } else if (chartType === "combo") {
                if (!barMeasure || !lineMeasure) {
                  alert(
                    "Välj mått för både stapel- och linjediagram när kombinerat diagram är valt."
                  );
                  return;
                }
              } else if (chartType === "stacked") {
                if (xAxisDimensions.length !== 1) {
                  alert(
                    "För staplat diagram, välj exakt en dimension för x-axeln."
                  );
                  return;
                }
                if (!seriesDimension) {
                  alert(
                    "För staplat diagram, välj exakt en dimension för serier."
                  );
                  return;
                }
              }
              const filterDims = dimensions.filter(
                (dim) =>
                  !xAxisDimensions.includes(dim.name) &&
                  dim.name !== seriesDimension
              );
              const updatedDims = dimensions.map((dim) => {
                if (filterDims.some((fd) => fd.name === dim.name)) {
                  if (dim.selectedValues.length !== 1) {
                    const newSelected =
                      dim.selectedValues.length > 0
                        ? [dim.selectedValues[0]]
                        : [dim.allValues[0]];
                    return { ...dim, selectedValues: newSelected };
                  }
                }
                return dim;
              });
              setDimensions(updatedDims);
              setStep("review-generate");
            }}
          >
            Nästa
          </button>
        </div>
      )}

      {step === "review-generate" && (
        <div>
          <div
            style={{
              border: "2px solid",
              padding: "1rem",
            }}
          >
            <h3>Snabbkonfiguration</h3>
            <h4>Dimensioner & Roller</h4>
            {dimensions.map((dim) => {
              const currentRole = getDimensionRole(dim.name);
              return (
                <div key={dim.name}>
                  <strong>{dim.name}</strong>{" "}
                  <div>
                    <label>
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "main"}
                        onChange={() =>
                          handleDimensionRoleChange(dim.name, "main")
                        }
                      />
                      Huvudkategori
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "sub"}
                        onChange={() =>
                          handleDimensionRoleChange(dim.name, "sub")
                        }
                      />
                      Underkategori
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "series"}
                        onChange={() =>
                          handleDimensionRoleChange(dim.name, "series")
                        }
                      />
                      Serie
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "filter"}
                        onChange={() =>
                          handleDimensionRoleChange(dim.name, "filter")
                        }
                      />
                      Filter
                    </label>
                  </div>
                </div>
              );
            })}
            <h4>Filtrera Värden</h4>
            {dimensions.map((dim) => (
              <div key={dim.name}>
                <strong>{dim.name}</strong>
                <div>
                  {dim.allValues.map((value) => (
                    <label key={value}>
                      <input
                        type="checkbox"
                        checked={dim.selectedValues.includes(value)}
                        onChange={(e) => {
                          setDimensions((prev) =>
                            prev.map((d) => {
                              if (d.name !== dim.name) return d;
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
                            })
                          );
                        }}
                      />
                      {value}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <h4>Mått</h4>
            <div>
              <button onClick={handleSelectAllMeasures}>
                Markera alla mått
              </button>{" "}
              <button onClick={handleDeselectAllMeasures}>
                Ta bort alla mått
              </button>
            </div>
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
            ))}{" "}
            <br />
            <button onClick={handleGoBack}>Tillbaka</button>
            <button onClick={() => setStep("select-diagram-type")}>
              Börja om
            </button>
            <br />
            <button onClick={handleGenerateChart}>Generera diagram</button>
          </div>

          <h3>Filter</h3>
          {dimensions
            .filter(
              (dim) =>
                !xAxisDimensions.includes(dim.name) &&
                dim.name !== seriesDimension
            )
            .map((dim) => (
              <div key={dim.name}>
                <label>{dim.name}</label>
                <select
                  value={dim.selectedValues[0]}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setDimensions((prev) =>
                      prev.map((d) =>
                        d.name === dim.name
                          ? { ...d, selectedValues: [newValue] }
                          : d
                      )
                    );
                  }}
                >
                  {dim.allValues.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}

          <div
            id="container"
            ref={containerRef}
            style={{ width: "100%", height: "600px" }}
          />
        </div>
      )}
    </div>
  );
}
