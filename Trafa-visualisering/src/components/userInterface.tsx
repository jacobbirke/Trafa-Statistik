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
  containerRef: React.MutableRefObject<HTMLDivElement | null>,
  is3D: boolean,
  setIs3D: React.Dispatch<React.SetStateAction<boolean>>
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
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Input File Step */}
      {step === "input-file" && (
          
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-2xl font-bold mb-4">Ladda upp fil</h3>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="mb-4 block w-full text-sm text-gray-600 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded"
            />
            <button
              onClick={() => setStep("select-diagram-type")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Nästa
            </button>
          </div>
      )}

      {/* Select Diagram Type Step */}
      {step === "select-diagram-type" && (
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-2xl font-bold mb-4">Välj Diagramtyp</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="diagramType"
                value="column"
                checked={chartType === "column"}
                onChange={() => setChartType("column")}
                className="mr-2"
              />
              Stapeldiagram
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="diagramType"
                value="line"
                checked={chartType === "line"}
                onChange={() => setChartType("line")}
                className="mr-2"
              />
              Linjediagram
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="diagramType"
                value="combo"
                checked={chartType === "combo"}
                onChange={() => setChartType("combo")}
                className="mr-2"
              />
              Kombinerat (Stapel & Linje)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="diagramType"
                value="stacked"
                checked={chartType === "stacked"}
                onChange={() => setChartType("stacked")}
                className="mr-2"
              />
              Staplad kolumn
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="diagramType"
                value="pie"
                checked={chartType === "pie"}
                onChange={() => {
                  setChartType("pie");
                  setSeriesDimension(null);
                }}
                className="mr-2"
              />
              Pajdiagram
            </label>
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setStep("input-file")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Tillbaka
            </button>
            <button
              onClick={() => setStep("filter-dimensions")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Nästa
            </button>
          </div>
        </div>
      )}

      {/* Filter Dimensions Step */}
      {step === "filter-dimensions" && (
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-2xl font-bold mb-4">Filtrera Dimensioner</h3>
          {dimensions.map((dim) => (
            <div key={dim.name} className="border p-4 mb-4 rounded">
              <h4 className="text-xl font-semibold mb-2">{dim.name}</h4>
              <div className="flex space-x-2 mb-2">
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
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
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
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Ta bort alla
                </button>
              </div>
              <div className="space-y-1">
                {dim.allValues.map((value) => (
                  <div key={value} className="flex items-center">
                    <label className="flex items-center space-x-2">
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
                                    selectedValues: [
                                      ...d.selectedValues,
                                      value,
                                    ],
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
                        className="mr-2"
                      />
                      {value}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex space-x-4">
            <button
              onClick={() => setStep("select-diagram-type")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
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
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Nästa
            </button>
          </div>
        </div>
      )}

      {/* Select Measures Step */}
      {step === "select-measures" && (
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-2xl font-bold mb-4">Välj Mått</h3>
          <div className="flex space-x-2 mb-4">
            <button
              onClick={handleSelectAllMeasures}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Markera alla
            </button>
            <button
              onClick={handleDeselectAllMeasures}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Ta bort alla
            </button>
          </div>
          <div className="space-y-2">
            {measures.map((measure) => (
              <div key={measure.name} className="flex items-center">
                <label className="flex items-center space-x-2">
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
                    className="mr-2"
                  />
                  {measure.name} {measure.unit && `(${measure.unit})`}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setStep("filter-dimensions")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Tillbaka
            </button>
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
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Nästa
            </button>
          </div>
        </div>
      )}

      {/* Chart Configuration Step */}
      {step === "chart-configuration" && (
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-2xl font-bold mb-4">Diagramkonfiguration</h3>
          {chartType === "pie" ? (
            <div className="mb-4">
              <h4 className="text-xl font-semibold mb-2">
                Välj dimension för serie
              </h4>
              <select
                value={seriesDimension || ""}
                onChange={(e) => setSeriesDimension(e.target.value || null)}
                className="border rounded px-2 py-1"
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
            <div className="mb-4">
              <h4 className="text-xl font-semibold mb-2">
                Välj kategori{chartType === "stacked" ? "" : "er"} för x-axeln{" "}
                {chartType === "stacked"
                  ? ""
                  : "(första valet blir huvudkategori, om du väljer en till så blir den underkategori)"}
              </h4>
              {dimensions.map((dim) => (
                <div key={dim.name} className="flex items-center mb-2">
                  <label className="flex items-center space-x-2">
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
                      className="mr-2"
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
            <div className="mb-4">
              <h4 className="text-xl font-semibold mb-2">
                Välj dimension för serie
              </h4>
              <select
                value={seriesDimension || ""}
                onChange={(e) => setSeriesDimension(e.target.value || null)}
                className="border rounded px-2 py-1"
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
              <div className="mb-4">
                <h4 className="text-xl font-semibold mb-2">
                  Välj Mått för Stapeldiagram
                </h4>
                {measures
                  .filter((measure) => measure.isSelected)
                  .map((measure) => (
                    <div key={measure.name} className="flex items-center mb-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="barMeasure"
                          value={measure.name}
                          checked={barMeasure === measure.name}
                          onChange={() => setBarMeasure(measure.name)}
                          className="mr-2"
                        />
                        {measure.name}
                      </label>
                    </div>
                  ))}
                <h4 className="text-xl font-semibold mb-2">
                  Välj Mått för Linjediagram
                </h4>
                {measures
                  .filter((measure) => measure.isSelected)
                  .map((measure) => (
                    <div key={measure.name} className="flex items-center mb-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="lineMeasure"
                          value={measure.name}
                          checked={lineMeasure === measure.name}
                          onChange={() => setLineMeasure(measure.name)}
                          className="mr-2"
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
              <div className="mb-4">
                <h4 className="text-xl font-semibold mb-2">Valt diagramtyp:</h4>
                <p>
                  {chartType === "column"
                    ? "Stapeldiagram"
                    : chartType === "line"
                    ? "Linjediagram"
                    : "Staplat diagram"}
                </p>
              </div>
            )}
          <div className="flex space-x-4">
            <button
              onClick={() => setStep("select-measures")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Tillbaka
            </button>
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
                      "För staplat diagram, välj exakt en dimension för serie."
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
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Nästa
            </button>
          </div>
        </div>
      )}

      {/* Review & Generate Step */}
      {step === "review-generate" && (
        <div className="space-y-8">
          <div className="border-2 border-gray-300 p-4 rounded">
            <h3 className="text-2xl font-bold mb-4">Snabbkonfiguration</h3>
            <h4 className="text-xl font-semibold mb-2">Dimensioner & Roller</h4>
            {dimensions.map((dim) => {
              const currentRole = getDimensionRole(dim.name);
              return (
                <div key={dim.name} className="mb-4">
                  <strong className="block mb-1">{dim.name}</strong>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "main"}
                        onChange={() =>
                          handleDimensionRoleChange(dim.name, "main")
                        }
                        className="mr-1"
                      />
                      Huvudkategori
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "sub"}
                        onChange={() =>
                          handleDimensionRoleChange(dim.name, "sub")
                        }
                        className="mr-1"
                      />
                      Underkategori
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "series"}
                        onChange={() =>
                          handleDimensionRoleChange(dim.name, "series")
                        }
                        className="mr-1"
                      />
                      Serie
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`role-${dim.name}`}
                        checked={currentRole === "filter"}
                        onChange={() =>
                          handleDimensionRoleChange(dim.name, "filter")
                        }
                        className="mr-1"
                      />
                      Filter
                    </label>
                  </div>
                </div>
              );
            })}
            <h4 className="text-xl font-semibold mb-2">Filtrera Värden</h4>
            {dimensions.map((dim) => (
              <div key={dim.name} className="mb-4">
                <strong className="block mb-1">{dim.name}</strong>
                <div className="space-y-1">
                  {dim.allValues.map((value) => (
                    <label key={value} className="flex items-center space-x-2">
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
                        className="mr-2"
                      />
                      {value}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <h4 className="text-xl font-semibold mb-2">Mått</h4>
            {measures.map((measure) => (
              <div key={measure.name} className="mb-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={measure.isSelected}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setMeasures((prevMeasures) => {
                        const newMeasures = prevMeasures.map((m) =>
                          m.name === measure.name
                            ? { ...m, isSelected: isChecked }
                            : m
                        );

                        const selected = newMeasures.filter(
                          (m) => m.isSelected
                        );

                        if (chartType === "combo") {
                          if (selected.length > 2) {
                            alert(
                              "För kombinerat diagram, välj exakt två mått."
                            );
                            return prevMeasures;
                          }
                        } else if (chartType === "pie") {
                          if (selected.length > 1) {
                            alert("För pajdiagram, välj exakt ett mått.");
                            return prevMeasures;
                          }
                        } else {
                          if (selected.length > 1) {
                            alert(
                              "För stapel-, linje- eller staplat diagram, välj exakt ett mått."
                            );
                            return prevMeasures;
                          }
                        }
                        return newMeasures;
                      });
                    }}
                    className="mr-2"
                  />
                  {measure.name} {measure.unit && `(${measure.unit})`}
                </label>
              </div>
            ))}

            {chartType === "combo" && (
              <div className="mb-4">
                <h4 className="text-xl font-semibold mb-2">
                  Välj Mått för Stapeldiagram
                </h4>
                {measures
                  .filter((m) => m.isSelected)
                  .map((measure) => (
                    <div key={measure.name} className="flex items-center mb-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="barMeasure"
                          value={measure.name}
                          checked={barMeasure === measure.name}
                          onChange={() => setBarMeasure(measure.name)}
                          className="mr-2"
                        />
                        {measure.name}
                      </label>
                    </div>
                  ))}
                <h4 className="text-xl font-semibold mb-2">
                  Välj Mått för Linjediagram
                </h4>
                {measures
                  .filter((m) => m.isSelected)
                  .map((measure) => (
                    <div key={measure.name} className="flex items-center mb-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="lineMeasure"
                          value={measure.name}
                          checked={lineMeasure === measure.name}
                          onChange={() => setLineMeasure(measure.name)}
                          className="mr-2"
                        />
                        {measure.name}
                      </label>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleGoBack}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Tillbaka
              </button>
              <button
                onClick={() => setStep("select-diagram-type")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Börja om
              </button>
            </div>
            <div className="mt-4">
              <button
                onClick={handleGenerateChart}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Generera diagram
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Filter</h3>
            {dimensions
              .filter(
                (dim) =>
                  !xAxisDimensions.includes(dim.name) &&
                  dim.name !== seriesDimension
              )
              .map((dim) => (
                <div key={dim.name} className="mb-4">
                  <label className="block font-semibold mb-1">{dim.name}</label>
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
                      handleGenerateChart();
                    }}
                    className="border rounded px-2 py-1"
                  >
                    {dim.allValues.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

            {(chartType === "column" ||
              chartType === "pie" ||
              chartType === "combo" ||
              chartType === "stacked") && (
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={is3D}
                    onChange={(e) => setIs3D(e.target.checked)}
                    className="mr-2"
                  />
                  Visa i 3D
                </label>
              </div>
            )}

            <div
              id="container"
              ref={containerRef}
              className="w-full h-[600px] bg-gray-100 rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
