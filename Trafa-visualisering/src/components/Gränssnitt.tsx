import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import * as XLSX from "xlsx";

interface GroupedData {
  years: string[];
  trainCounts: number[];
  punctualities: number[];
}

type RegisterUserSteps =
  | "input-cvs"
  | "input-train-type"
  | "input-year"
  | "input-unit"
  | "review-submit";

const StatistikGränssnitt: React.FC = () => {
  const [step, setStep] = useState<RegisterUserSteps>("input-cvs");
  const [chart, setChart] = useState<any>(null);
  const [allYears, setAllYears] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [groupedData, setGroupedData] = useState<Record<string, GroupedData>>(
    {}
  );
  const [title, setTitle] = useState<string>("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [trainTypes, setTrainTypes] = useState<string[]>([]);
  const [barData, setBarData] = useState<"Punktlighet" | "Antal Framförda tåg">(
    "Antal Framförda tåg"
  );
  const [lineData, setLineData] = useState<
    "Punktlighet" | "Antal Framförda tåg"
  >("Punktlighet");

  useEffect(() => {
    if (containerRef.current) {
      const newChart = Highcharts.chart(
        containerRef.current,
        {
          chart: {
            zooming: {
              type: "xy",
            },
          },
          title: {
            text: "",
            align: "left",
          },
          credits: {
            text: 'Source: <a href="https://www.trafa.se/bantrafik/punktlighet-pa-jarnvag/" target="_blank">Trafikanalys</a>',
          },
          xAxis: [
            {
              categories: [],
              crosshair: true,
            },
          ],
          yAxis: [
            {
              title: {
                text: "",
                style: {
                  color:
                    (Highcharts.getOptions().colors?.[1] as string) ?? "black",
                },
              },
              labels: {
                format: "{value} ",
                style: {
                  color:
                    (Highcharts.getOptions().colors?.[1] as string) ?? "blue",
                },
              },
            },
            {
              title: {
                text: "",
                style: {
                  color:
                    (Highcharts.getOptions().colors?.[0] as string) ?? "green",
                },
              },
              labels: {
                format: "{value} ",
                style: {
                  color:
                    (Highcharts.getOptions().colors?.[0] as string) ?? "red",
                },
              },
              opposite: true,
            },
          ],
          tooltip: {
            shared: true,
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            backgroundColor:
              Highcharts.defaultOptions.legend?.backgroundColor ??
              "rgba(255,255,255,0.25)",
          },
          series: [],
        },
        () => {}
      );

      setChart(newChart);

      return () => {
        newChart.destroy();
      };
    }
  }, []);

  // File upload and CSV parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const data = event.target?.result;
      if (!(data instanceof ArrayBuffer)) return;

      try {
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<string[]>(sheet, {
          header: 1,
        });
        const title = jsonData[0][1];
        const headers = jsonData[1];
        const units = jsonData[2];

        const groupedData: Record<string, GroupedData> = {};
        const years: string[] = [];

        jsonData.forEach((row: any[], index: number) => {
          if (index <= 2) return; // Skip title, header, and unit rows

          const year = row[0].toString();
          const trainType = row[1];
          const trainCount = row[2];
          let punctuality = row[3];

          if (punctuality === undefined || punctuality === null) {
            punctuality = 0;
          } else {
            punctuality = parseFloat(punctuality).toFixed(2);
            punctuality = parseFloat(punctuality);
          }

          if (!years.includes(year)) {
            years.push(year);
          }

          if (!groupedData[trainType]) {
            groupedData[trainType] = {
              years: [],
              trainCounts: [],
              punctualities: [],
            };
          }

          groupedData[trainType].years.push(year);
          groupedData[trainType].trainCounts.push(trainCount);
          groupedData[trainType].punctualities.push(punctuality);
        });

        setGroupedData(groupedData);
        setAllYears(years);
        setTitle(title);
        setHeaders(headers);
        setUnits(units);
      } catch (error) {
        console.error("Error parsing the Excel file:", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = e.target.value;
    setSelectedYears((prev) =>
      e.target.checked
        ? [...prev, year]
        : prev.filter((selectedYear) => selectedYear !== year)
    );
  };

  const handleTrainTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trainType = e.target.value;
    setTrainTypes((prev) =>
      e.target.checked
        ? [...prev, trainType]
        : prev.filter((selectedType) => selectedType !== trainType)
    );
  };

  const handleGenerateChart = () => {
    if (!selectedYears.length || !trainTypes.length || !chart) return;

    const filteredGroupedData: Record<string, GroupedData> = {};
    const filteredYears = selectedYears;

    Object.keys(groupedData).forEach((trainType) => {
      if (!trainTypes.includes(trainType)) return;

      const data = groupedData[trainType];
      const filteredData: GroupedData = {
        years: [],
        trainCounts: [],
        punctualities: [],
      };

      data.years.forEach((year, index) => {
        if (selectedYears.includes(year.trim())) {
          filteredData.years.push(year);
          filteredData.trainCounts.push(data.trainCounts[index]);
          filteredData.punctualities.push(data.punctualities[index]);
        }
      });

      if (filteredData.years.length > 0) {
        filteredGroupedData[trainType] = filteredData;
      }
    });

    if (Object.keys(filteredGroupedData).length === 0) {
      console.error("No data available for the selected years or train types.");
      return;
    }

    chart.xAxis[0].update({
      categories: filteredYears,
    });

    chart.series = [];
    Object.keys(filteredGroupedData).forEach((trainType) => {
      const data = filteredGroupedData[trainType];

      // Stapel
      chart.addSeries({
        name: `${trainType} - ${
          barData === "Antal Framförda tåg" ? headers[2] : headers[3]
        }`,
        type: "column",
        yAxis: 1,
        data:
          barData === "Antal Framförda tåg"
            ? data.trainCounts
            : data.punctualities,
        tooltip: {
          valueSuffix:
            " " + (barData === "Antal Framförda tåg" ? units[2] : units[3]),
        },
      });

      chart.addSeries({
        name: `${trainType} - ${
          lineData === "Punktlighet" ? headers[3] : headers[2]
        }`,
        type: "spline",
        data:
          lineData === "Punktlighet" ? data.punctualities : data.trainCounts,
        tooltip: {
          valueSuffix: " " + (lineData === "Punktlighet" ? units[3] : units[2]),
        },
      });
    });

    // Linje
    chart.yAxis[0].update({
      title: {
        text: lineData === "Punktlighet" ? headers[3] : headers[2],
        style: {
          color: Highcharts.getOptions().colors?.[1],
        },
      },
      labels: {
        format: "{value} " + (lineData === "Punktlighet" ? units[3] : units[2]),
        style: {
          color: Highcharts.getOptions().colors?.[1],
        },
      },
      endOnTick: false,
      startOnTick: false,
    });

    chart.yAxis[1].update({
      title: {
        text: barData === "Antal Framförda tåg" ? headers[2] : headers[3],
        style: {
          color: Highcharts.getOptions().colors?.[0],
        },
      },
      labels: {
        format:
          "{value:,.0f} " +
          (barData === "Antal Framförda tåg" ? units[2] : units[3]),
        style: {
          color: Highcharts.getOptions().colors?.[0],
        },
      },
    });

    chart.setTitle({
      text: title,
    });
  };

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedYears(allYears);
    } else {
      setSelectedYears([]);
    }
  };

  return (
    <div>
      {step == "input-cvs" && (
        <div>
          <h3>Ladda upp CVS-fil</h3>
          <input
            type="file"
            id="upload"
            accept=".csv"
            onChange={handleFileUpload}
          />
          <button onClick={() => setStep("input-year")}>Nästa</button>
        </div>
      )}

      {step == "input-year" && (
        <div>
          <h3>Välj period</h3>
          <button onClick={() => handleSelectAll(true)}>Markera alla</button>
          <button onClick={() => handleSelectAll(false)}>Avmarkera alla</button>
          {allYears.length > 0 && (
            <div>
              <label>Select years:</label>
              <div>
                {allYears.map((year) => (
                  <div key={year}>
                    <input
                      type="checkbox"
                      id={`year-${year}`}
                      value={year}
                      checked={selectedYears.includes(year)}
                      onChange={handleYearChange}
                    />
                    <label htmlFor={`year-${year}`}>{year}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => setStep("input-cvs")}>Tillbaka</button>
          <button onClick={() => setStep("input-train-type")}>Nästa</button>
        </div>
      )}

      {step == "input-train-type" && (
        <div>
          <h3>Välj tågtåp</h3>
          <div>
            <input
              type="checkbox"
              id="Kortdistanståg"
              value="Kortdistanståg"
              checked={trainTypes.includes("Kortdistanståg")}
              onChange={handleTrainTypeChange}
            />
            <label htmlFor="Kortdistanståg">Kortdistanståg</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="Medeldistanståg"
              value="Medeldistanståg"
              checked={trainTypes.includes("Medeldistanståg")}
              onChange={handleTrainTypeChange}
            />
            <label htmlFor="Medeldistanståg">Medeldistanståg</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="Långdistanståg"
              value="Långdistanståg"
              checked={trainTypes.includes("Långdistanståg")}
              onChange={handleTrainTypeChange}
            />
            <label htmlFor="Långdistanståg">Långdistanståg</label>
          </div>

          <button onClick={() => setStep("input-year")}>Tillbaka</button>
          <button onClick={() => setStep("input-unit")}>Nästa</button>
        </div>
      )}

      {step === "input-unit" && (
        <div>
          <h3>Välj enhet för stapel- och linjediagram</h3>
          <div>
            <h4>Välj data för stapeldiagrammet</h4>
            <label>
              <input
                type="radio"
                name="barData"
                value="Antal Framförda tåg"
                checked={barData === "Antal Framförda tåg"}
                onChange={() => setBarData("Antal Framförda tåg")}
              />
              Antal Framförda tåg
            </label>
            <label>
              <input
                type="radio"
                name="barData"
                value="Punktlighet"
                checked={barData === "Punktlighet"}
                onChange={() => setBarData("Punktlighet")}
              />
              Punktlighet
            </label>
          </div>

          <div>
            <h4>Välj data för linjediagrammet</h4>
            <label>
              <input
                type="radio"
                name="lineData"
                value="Antal Framförda tåg"
                checked={lineData === "Antal Framförda tåg"}
                onChange={() => setLineData("Antal Framförda tåg")}
              />
              Antal Framförda tåg
            </label>
            <label>
              <input
                type="radio"
                name="lineData"
                value="Punktlighet"
                checked={lineData === "Punktlighet"}
                onChange={() => setLineData("Punktlighet")}
              />
              Punktlighet
            </label>
          </div>

          <button onClick={() => setStep("input-train-type")}>Tillbaka</button>
          <button onClick={() => setStep("review-submit")}>Nästa</button>
        </div>
      )}
      
      <button onClick={handleGenerateChart}>Generate Diagram</button>
      <div
        id="container"
        ref={containerRef}
        style={{ width: "100%", height: "600px" }}
      />
    </div>
  );
};

export default StatistikGränssnitt;
