import Highcharts from "highcharts";
import { useEffect, useRef, useState } from "react";
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

const StatisticsInterface: React.FC = () => {
  const [step, setStep] = useState<RegisterUserSteps>("input-cvs");
  const [year] = useState<string>("");
  const [file] = useState<string>("");
  const [trainType, setTrainType] = useState<string>("");
  const [bar, setBar] = useState<string>("");
  const [line, setLine] = useState<string>("");
  const [chart, setChart] = useState<any>(null);
  const [allYears, setAllYears] = useState<string[]>([]); // Store all years
  const [selectedYears, setSelectedYears] = useState<string[]>([]); // Store selected years
  const [groupedData, setGroupedData] = useState<Record<string, GroupedData>>(
    {}
  ); // Store grouped data
  const [title, setTitle] = useState<string>(""); // Store the title for chart
  const [headers, setHeaders] = useState<string[]>([]); // Store headers (for column titles, etc.)
  const [units, setUnits] = useState<string[]>([]); // Store units for data (Train unit, Punctuality unit)
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  // Handle file upload and CSV parsing
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

          const year = row[0].toString().trim(); // Trim year to avoid spaces or hidden characters
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

        // Store data and metadata in state
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

  const handleYearChange = (e: { target: { value: any; }; }) => {
    const year = e.target.value;
    setSelectedYears((prevSelectedYears) =>
      prevSelectedYears.includes(year)
        ? prevSelectedYears.filter((item) => item !== year)
        : [...prevSelectedYears, year]
    );
  };

  // Handle select all / deselect all
  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedYears(allYears); // Select all years
    } else {
      setSelectedYears([]); // Deselect all years
    }
  };

  const handleGenerateChart = () => {
    if (!selectedYears.length || !chart) return;

    const filteredGroupedData: Record<string, GroupedData> = {};
    const filteredYears = selectedYears; // Only show selected years

    console.log("Selected Years:", selectedYears); // Debugging selected years

    // Filter the data based on selected years
    Object.keys(groupedData).forEach((trainType) => {
      const data = groupedData[trainType];
      const filteredData: GroupedData = {
        years: [],
        trainCounts: [],
        punctualities: [],
      };

      data.years.forEach((year, index) => {
        // Ensure year is cleaned (trimmed) before comparing
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

    console.log("Filtered Grouped Data:", filteredGroupedData); // Debugging filtered data

    // Check if there's any data to display
    if (Object.keys(filteredGroupedData).length === 0) {
      console.error("No data available for the selected years.");
      return;
    }

    // Update the chart with filtered data
    chart.xAxis[0].update({
      categories: filteredYears,
    });

    chart.series = [];
    Object.keys(filteredGroupedData).forEach((trainType) => {
      const data = filteredGroupedData[trainType];
      console.log(`Adding series for train type: ${trainType}`);
      chart.addSeries({
        name: `${trainType} - ${headers[2]}`,
        type: "column",
        yAxis: 1,
        data: data.trainCounts,
        tooltip: {
          valueSuffix: " " + units[2], // Train unit
        },
      });

      chart.addSeries({
        name: `${trainType} - ${headers[3]}`,
        type: "spline",
        data: data.punctualities,
        tooltip: {
          valueSuffix: " " + units[3], // Punctuality unit
        },
      });
    });

    chart.yAxis[0].update({
      title: {
        text: headers[3], // Punctuality title
        style: {
          color: Highcharts.getOptions().colors?.[1],
        },
      },
      labels: {
        format: "{value} " + units[3], // Punctuality unit
        style: {
          color: Highcharts.getOptions().colors?.[1],
        },
      },
      min: 0,
      max: 100,
      tickInterval: 20,
      endOnTick: false,
      startOnTick: false,
    });

    chart.yAxis[1].update({
      title: {
        text: headers[2], // Train title
        style: {
          color: Highcharts.getOptions().colors?.[0],
        },
      },
      labels: {
        format: "{value:,.0f} " + units[2], // Train unit
        style: {
          color: Highcharts.getOptions().colors?.[0],
        },
      },
    });

    chart.setTitle({
      text: title,
    });
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

          {/* Buttons to select/deselect all years */}
          <button onClick={() => handleSelectAll(true)}>Markera alla</button>
          <button onClick={() => handleSelectAll(false)}>Avmarkera alla</button>

          {/* Dynamically render checkboxes for each year */}
          {allYears.length > 0 && (
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
          )}

          {/* Navigation buttons */}
          <button onClick={() => setStep("input-cvs")}>Tillbaka</button>
          <button onClick={() => setStep("input-train-type")}>Nästa</button>
        </div>
      )}

      {step == "input-train-type" && (
        <div>
          <h3>Välj tågtyp</h3>

          <p>
            <input
              type="checkbox"
              name="typeOfTrain"
              value={trainType}
              onChange={(e) => setTrainType(e.target.value)}
            />{" "}
            Kortdistanståg
          </p>
          <p>
            <input
              type="checkbox"
              name="typeOfTrain"
              value={trainType}
              onChange={(e) => setTrainType(e.target.value)}
            />{" "}
            Medeldistanståg
          </p>
          <p>
            <input
              type="checkbox"
              name="typeOfTrain"
              value={trainType}
              onChange={(e) => setTrainType(e.target.value)}
            />{" "}
            Långdistanståg
          </p>
          <button onClick={() => setStep("input-year")}>Tillbaka</button>
          <button onClick={() => setStep("input-unit")}>Nästa</button>
        </div>
      )}

      {step == "input-unit" && (
        <div>
          <h3>Välj enheter för stapel- och linjediagram</h3>
          <p>
            <label htmlFor="bar">Stapel: </label>
            <select name="bar" id="bar">
              <option value={bar}>Punktlighet</option>
              <option value={bar}>Antal framförda tåg</option>
            </select>{" "}
          </p>
          <p>
            <label htmlFor="line">Linje: </label>
            <select name="line" id="line">
              <option value={line}>Punktlighet</option>
              <option value={line}>Antal framförda tåg</option>
            </select>{" "}
          </p>

          {/* eller */}

          <p>
            Stapel:
            <input
              type="radio"
              name="Stapel"
              value={bar}
              onChange={(e) => setBar(e.target.value)}
            />{" "}
            Punktlighet
            <input
              type="radio"
              name="Stapel"
              value={bar}
              onChange={(e) => setBar(e.target.value)}
            />{" "}
            Antal framförda tåg
          </p>
          <p>
            Linje:
            <input
              type="radio"
              name="linje"
              value={line}
              onChange={(e) => setLine(e.target.value)}
            />{" "}
            Punktlighet
            <input
              type="radio"
              name="linje"
              value={line}
              onChange={(e) => setLine(e.target.value)}
            />{" "}
            Antal framförda tåg
          </p>
          <button onClick={() => setStep("input-train-type")}>Tiilbaka</button>
          <button onClick={() => setStep("review-submit")}>Nästa</button>
        </div>
      )}

      {step == "review-submit" && (
        <div>
          <h3>Ditt urval</h3>

          <p>CVS-fil: {file}</p>
          <p>Period: {year}</p>
          <p>Typ av tåg: {trainType}</p>
          <p>Stapel: {bar} </p>
          <p>Linje: {line}</p>

          <button onClick={() => setStep("input-unit")}>Tillbaka</button>
          <button onClick={() => setStep("input-cvs")}>Börja om</button>
          <br />
          <button onClick={handleGenerateChart}>Generate Diagram</button>
          <div
            id="container"
            ref={containerRef}
            style={{ width: "100%", height: "600px" }}
          />
        </div>
      )}
    </div>
  );
};

export default StatisticsInterface;
