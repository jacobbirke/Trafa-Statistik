import React, { useEffect, useState } from "react";
import { Button } from "../../UI/Button";
import { Card } from "../../UI/Card";
import { xmlToJson } from "../../../utils/xmlUtils";
import {
  QueryPart,
  WizardStep,
  DimensionGroup,
  Dimension,
  Measure,
} from "../../../types/chartTypes";

function unwrapItem(it: any): {
  code: string;
  label: string;
  unit?: string;
  isConfidence: boolean;
  isSelectable: boolean;
  isRequired?: boolean;
} {
  const attr = it["@attributes"] || {};
  const value = it.Value?.["#text"] || it.Value || "";

  let label = "";
  if (it.Label) {
    label = it.Label["#text"] || it.Label;
  } else if (attr.Label) {
    label = attr.Label;
  } else {
    label = value;
  }

  const code = attr.Name || it.Name || "";
  const unit = attr.Unit || it.Unit || "";

  const isConfidence =
    /konfidensintervall/i.test(label) ||
    attr.MeasurementType === "KI" ||
    /\bKI$/i.test(label);

  const option = attr.Option ?? it.Option;
  const isSelectable = option === true || option === "true";

  const isRequired = false; 

  return {
    code: String(code),
    label: String(label),
    unit: String(unit),
    isConfidence,
    isSelectable,
    isRequired,
  };
}

const findTopLevelGroup = (
  item: any,
  items: any[],
  productId: string
): string | null => {
  let current = item;
  let topGroup: string | null = null;

  while (current) {
    const parentName = current.ParentName || current["@attributes"]?.ParentName;
    if (!parentName || parentName === productId) break;

    const parent = items.find((i) => {
      const iName = i.Name || i["@attributes"]?.Name;
      return iName === parentName;
    });

    if (!parent) break;

    const parentType = parent.Type || parent["@attributes"]?.Type;
    if (parentType === "H") {
      topGroup = parent.Label || parent["@attributes"]?.Label;
    }

    current = parent;
  }

  return topGroup;
};

const extractGroups = (items: any[], productId: string): DimensionGroup[] => {
  const groups: DimensionGroup[] = [];
  const groupMap: Record<string, Dimension[]> = {};

  items.forEach((item) => {
    if (item.Type === "H" || item["@attributes"]?.Type === "H") {
      const groupLabel = item.Label || item["@attributes"]?.Label;
      if (!groupMap[groupLabel]) {
        groupMap[groupLabel] = [];
        groups.push({ title: groupLabel, dimensions: groupMap[groupLabel] });
      }
    }
  });

  items.forEach((item) => {
    if (item.Type !== "D" && item["@attributes"]?.Type !== "D") return;

    const { code, label, isSelectable } = unwrapItem(item);

    const groupTitle = findTopLevelGroup(item, items, productId) || "";

    if (!groupMap[groupTitle]) {
      groupMap[groupTitle] = [];
      groups.push({ title: groupTitle, dimensions: groupMap[groupTitle] });
    }

    groupMap[groupTitle].push({
      name: label,
      variable: code,
      allValues: [],
      selectedValues: [],
      unit: "",
      isSelectable,
      groupTitle,
      dependencies: [],
    });
  });

  return groups;
};

const addDependencies = (groups: DimensionGroup[], productId: string) => {
  if (productId === "t10011") {
    const tillstandDim = groups
      .flatMap((g) => g.dimensions)
      .find((d) => d.name.includes("Tillstånd"));
    const agarkategoriDim = groups
      .flatMap((g) => g.dimensions)
      .find((d) => d.name.includes("Ägarkategori"));

    if (tillstandDim && agarkategoriDim) {
      tillstandDim.dependencies = [agarkategoriDim.variable];
    }
  }

  if (productId === "t1101") {
    const regionGroup = groups.find((g) => g.title.includes("Region"));
    if (regionGroup) {
      const fromRegion = regionGroup.dimensions.find((d) =>
        d.name.includes("Från region")
      );
      const toRegion = regionGroup.dimensions.find((d) =>
        d.name.includes("Till region")
      );

      if (fromRegion && toRegion) {
        fromRegion.dependencies = [toRegion.variable];
        toRegion.dependencies = [fromRegion.variable];
      }
    }
  }
};

interface ConfigureApiQueryStepProps {
  productId: string;
  setQuery: (query: string) => void;
  setStep: (step: WizardStep) => void;
  setDimensions: React.Dispatch<React.SetStateAction<Dimension[]>>;
  setMeasures: React.Dispatch<React.SetStateAction<Measure[]>>;
}

export const ConfigureApiQueryStep: React.FC<ConfigureApiQueryStepProps> = ({
  productId,
  setQuery,
  setStep,
  setDimensions,
}) => {
  const [dimensionGroups, setDimensionGroups] = useState<DimensionGroup[]>([]);
  const [measuresMeta, setMeasuresMeta] = useState<Measure[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<QueryPart[]>([]);
  const [selectedMeasures, setSelectedMeasures] = useState<QueryPart[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStructure = async () => {
      if (!productId) return;

      const queryParts = [
        productId,
        ...selectedMeasures.map((m) => m.variable),
        ...selectedDimensions.map((d) => d.variable),
      ];
      const queryString = queryParts.join("|");

      try {
        const resp = await fetch(
          `https://api.trafa.se/api/structure?query=${encodeURIComponent(
            queryString
          )}&lang=sv`
        );
        const text = await resp.text();

        let itemsRaw: any[] = [];
        try {
          const json = JSON.parse(text);
          itemsRaw = Array.isArray(json.StructureItems)
            ? json.StructureItems
            : [json.StructureItems];
        } catch {
          const parsed = xmlToJson(text);
          let xmlItems =
            parsed?.StructureResponseWrapper?.StructureItems?.StructureItem;
          itemsRaw = Array.isArray(xmlItems) ? xmlItems : [xmlItems];
        }

        const allItems = flattenStructure(itemsRaw);

        const meas = allItems
          .filter(
            (it: any) => it.Type === "M" || it["@attributes"]?.Type === "M"
          )
          .map((it: any) => {
            const { code, label, unit, isConfidence, isSelectable } =
              unwrapItem(it);
            return {
              name: label,
              variable: code,
              unit,
              isSelected: false,
              isConfidence,
              isSelectable,
            } as Measure;
          });

        setMeasuresMeta(meas);

        const groups = extractGroups(allItems, productId);
        addDependencies(groups, productId);
        setDimensionGroups(groups);
      } catch (err) {
        console.error("fetchStructure failed:", err);
        setError("Kunde inte ladda struktur");
      }
    };

    fetchStructure();
  }, [productId, selectedDimensions, selectedMeasures]);

  const flattenStructure = (items: any[]): any[] => {
    let result: any[] = [];
    items.forEach((item) => {
      result.push(item);

      let children: any[] = [];
      if (item.StructureItems) {
        children = Array.isArray(item.StructureItems)
          ? item.StructureItems
          : [item.StructureItems];
      } else if (item.StructureItem) {
        children = Array.isArray(item.StructureItem)
          ? item.StructureItem
          : [item.StructureItem];
      }

      if (children.length > 0) {
        result = result.concat(flattenStructure(children));
      }
    });
    return result;
  };

  const handleDimensionSelect = (dim: Dimension) => {
    if (!dim.isSelectable) return;

    let newSelectedDimensions = [...selectedDimensions];
    const isSelected = newSelectedDimensions.some(
      (d) => d.variable === dim.variable
    );

    if (isSelected) {
      newSelectedDimensions = newSelectedDimensions.filter(
        (d) =>
          d.variable !== dim.variable && !dim.dependencies?.includes(d.variable)
      );
    } else {
      newSelectedDimensions.push({ variable: dim.variable });
      dim.dependencies?.forEach((depVar) => {
        if (!newSelectedDimensions.some((d) => d.variable === depVar)) {
          newSelectedDimensions.push({ variable: depVar });
        }
      });
    }

    setSelectedDimensions(newSelectedDimensions);
  };

  const handleBuildQuery = () => {
    if (selectedMeasures.length === 0) {
      alert("Du måste välja minst ett mått för att kunna visa data");
      return;
    }

    const missingDependencies: string[] = [];
    dimensionGroups.forEach((group) => {
      group.dimensions.forEach((dim) => {
        if (selectedDimensions.some((d) => d.variable === dim.variable)) {
          dim.dependencies?.forEach((dep) => {
            if (!selectedDimensions.some((d) => d.variable === dep)) {
              missingDependencies.push(`${dim.name} kräver ${dep}`);
            }
          });
        }
      });
    });

    if (missingDependencies.length > 0) {
      alert(`Saknade beroenden:\n${missingDependencies.join("\n")}`);
      return;
    }

    const measureKeys = selectedMeasures.map((m) => m.variable);
    const dimKeys = selectedDimensions.map((d) => d.variable);
    const fullQuery = [productId, ...measureKeys, ...dimKeys].join("|");

    setQuery(fullQuery);

    const dimsForParent = dimensionGroups
      .flatMap((g) => g.dimensions)
      .filter((d) => dimKeys.includes(d.variable));
    setDimensions(dimsForParent);

    setStep("fetch-data");
  };

  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4">API-konfiguration</h3>
      {error && <p className="text-red-500 mb-2">Fel: {error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg font-semibold mb-2">Dimensioner</h4>
          {dimensionGroups
            .sort((a, b) => {
              if (a.title === "Övriga dimensioner") return 1;
              if (b.title === "Övriga dimensioner") return -1;
              return a.title.localeCompare(b.title);
            })
            .map((group) => (
              <div key={group.title} className="mb-5">
                <h5 className="font-medium text-gray-700 mb-1">
                  {group.title}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                  {group.dimensions.map((dim) => {
                    const isSelected = selectedDimensions.some(
                      (d) => d.variable === dim.variable
                    );
                    const dependenciesMet = dim.dependencies?.every((dep) =>
                      selectedDimensions.some((d) => d.variable === dep)
                    );

                    return (
                      <Button
                        key={dim.variable}
                        variant={
                          isSelected
                            ? "primary"
                            : dim.isSelectable && (dependenciesMet ?? true)
                            ? "secondary"
                            : "disabled"
                        }
                        onClick={() => handleDimensionSelect(dim)}
                        title={
                          !dim.isSelectable
                            ? "Kombinationen finns inte i datasettet"
                            : !(dependenciesMet ?? true)
                            ? `Kräver ${dim.dependencies?.join(", ")}`
                            : ""
                        }
                      >
                        {dim.name}
                        {!dependenciesMet && " 🔒"}
                        {!dim.isSelectable && " ⚠️"}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Mått</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
            {measuresMeta.map((me) => {
              const isSelected = selectedMeasures.some(
                (m) => m.variable === me.variable
              );
              return (
                <Button
                  key={me.variable}
                  variant={
                    isSelected
                      ? "primary"
                      : me.isSelectable
                      ? "secondary"
                      : "disabled"
                  }
                  onClick={() => {
                    if (!me.isSelectable) return;
                    setSelectedMeasures((prev) =>
                      prev.some((m) => m.variable === me.variable)
                        ? prev.filter((m) => m.variable !== me.variable)
                        : [...prev, { variable: me.variable }]
                    );
                  }}
                  title={
                    me.isSelectable
                      ? ""
                      : "Kombinationen finns inte i datasettet"
                  }
                  className="text-center"
                >
                  {me.name}
                  {!me.isSelectable && " ⚠️"}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <Button
          variant="secondary"
          onClick={() => setStep("select-api-product")}
        >
          Tillbaka
        </Button>
        <Button
          onClick={handleBuildQuery}
          variant="primary"
          disabled={selectedDimensions.length + selectedMeasures.length === 0}
        >
          Hämta data
        </Button>
      </div>
    </Card>
  );
};
