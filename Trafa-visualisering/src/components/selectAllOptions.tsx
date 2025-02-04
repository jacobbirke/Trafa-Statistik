import React from "react";
import { Dimension, Measure } from "./Gränssnitt";

export function selectAllOptions(setSelectedDimensions: React.Dispatch<React.SetStateAction<Dimension[]>>, dimensions: Dimension[], setMeasures: React.Dispatch<React.SetStateAction<Measure[]>>, measures: Measure[]) {
  const handleSelectAllDimensions = () => {
    setSelectedDimensions(
      dimensions.map((dim) => ({ ...dim, selectedValues: [] }))
    );
  };

  const handleDeselectAllDimensions = () => {
    setSelectedDimensions([]);
  };

  const handleSelectAllDimensionValues = (dimensionName: string) => {
    setSelectedDimensions((prev) => prev.map((dim) => dim.name === dimensionName
      ? { ...dim, selectedValues: [...dim.allValues] }
      : dim
    )
    );
  };

  const handleDeselectAllDimensionValues = (dimensionName: string) => {
    setSelectedDimensions((prev) => prev.map((dim) => dim.name === dimensionName ? { ...dim, selectedValues: [] } : dim
    )
    );
  };

  const handleSelectAllMeasures = () => {
    setMeasures(measures.map((measure) => ({ ...measure, isSelected: true })));
  };

  const handleDeselectAllMeasures = () => {
    setMeasures(measures.map((measure) => ({ ...measure, isSelected: false })));
  };
  return { handleSelectAllDimensions, handleDeselectAllDimensions, handleSelectAllDimensionValues, handleDeselectAllDimensionValues, handleSelectAllMeasures, handleDeselectAllMeasures };
}
