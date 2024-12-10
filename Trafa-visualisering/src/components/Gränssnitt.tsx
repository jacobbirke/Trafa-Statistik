import { useState } from "react";

type RegisterUserSteps =
  | "input-cvs"
  | "input-train-type"
  | "input-year"
  | "input-unit"
  | "review-submit";

export function StatisticsInterface() {
  const [step, setStep] = useState<RegisterUserSteps>("input-cvs");
  const [year, setYear] = useState<string>("");
  const [file, setFile] = useState<string>("");
  const [trainType, setTrainType] = useState<string>("");
  const [bar, setBar] = useState<string>("");
  const [line, setLine] = useState<string>("");

  return (
    <div>
      {step == "input-cvs" && (
        <div>
          <h3>Ladda upp CVS-fil</h3>
          <input
            type="file"
            name="cvsFile"
            value={file}
            onChange={(e) => setFile(e.target.value)}
          />
          <button onClick={() => setStep("input-year")}>Nästa</button>
        </div>
      )}

      {step == "input-year" && (
        <div>
          <h3>Välj period</h3>

          <button>Markera alla</button>
          <button>Avmarkera alla</button>

          <p>
            <input
              type="checkbox"
              value={year}
              name="year"
              onChange={(e) => setYear(e.target.value)}
            />{" "}
            2013
          </p>
          <p>
            <input
              type="checkbox"
              value={year}
              name="year"
              onChange={(e) => setYear(e.target.value)}
            />{" "}
            2014
          </p>
          <p>
            <input
              type="checkbox"
              value={year}
              name="year"
              onChange={(e) => setYear(e.target.value)}
            />{" "}
            2015
          </p>
          <p>
            <input
              type="checkbox"
              value={year}
              name="year"
              onChange={(e) => setYear(e.target.value)}
            />{" "}
            2016
          </p>
          <p>
            <input
              type="checkbox"
              value={year}
              name="year"
              onChange={(e) => setYear(e.target.value)}
            />{" "}
            2017
          </p>
          <p>
            <input
              type="checkbox"
              value={year}
              name="year"
              onChange={(e) => setYear(e.target.value)}
            />{" "}
            2018
          </p>
          <p>
            <input
              type="checkbox"
              value={year}
              name="year"
              onChange={(e) => setYear(e.target.value)}
            />{" "}
            2019
          </p>
          <p>
            <input
              type="checkbox"
              value={year}
              name="year"
              onChange={(e) => setYear(e.target.value)}
            />{" "}
            2020
          </p>
          <p>
            <input
              type="checkbox"
              value={year}
              name="year"
              onChange={(e) => setYear(e.target.value)}
            />{" "}
            2021
          </p>
          <p>
            <input
              type="checkbox"
              value={year}
              name="year"
              onChange={(e) => setYear(e.target.value)}
            />{" "}
            2022
          </p>
          <p>
            <input
              type="checkbox"
              value={year}
              name="year"
              onChange={(e) => setYear(e.target.value)}
            />{" "}
            2023
          </p>
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
          <button>Skapa Diagram</button>
        </div>
      )}
    </div>
  );
}
