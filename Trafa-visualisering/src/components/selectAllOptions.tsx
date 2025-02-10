import React from "react";
import { Measure } from "./Gränssnitt";

export function selectAllOptions(
  setMeasures: React.Dispatch<React.SetStateAction<Measure[]>>,
  measures: Measure[]
) {
  const handleSelectAllMeasures = () => {
    setMeasures(measures.map((measure) => ({ ...measure, isSelected: true })));
  };

  const handleDeselectAllMeasures = () => {
    setMeasures(measures.map((measure) => ({ ...measure, isSelected: false })));
  };

  return { handleSelectAllMeasures, handleDeselectAllMeasures };
}
