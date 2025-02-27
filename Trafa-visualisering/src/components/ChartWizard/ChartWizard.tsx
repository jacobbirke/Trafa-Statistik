import React from "react";
import { InputFileStep } from "./steps/InputFileStep";
import { SelectDiagramTypeStep } from "./steps/SelectDiagramTypeStep";
import { FilterDimensionsStep } from "./steps/FilterDimensionsStep";
import { SelectMeasuresStep } from "./steps/SelectMeasuresStep";
import { ChartConfigurationStep } from "./steps/ChartConfigurationStep";
import { ReviewGenerateStep } from "./steps/ReviewGenerateStep";
import { ChartWizardProps } from "../../types/chartTypes";

export const ChartWizard: React.FC<ChartWizardProps> = ({
  step,
  chartType,
  dimensions,
  measures,
  xAxisDimensions,
  seriesDimension,
  barMeasure,
  lineMeasure,
  is3D,
  jsonData,
  title,
  containerRef,
  handleFileUpload,
  setStep,
  setDimensions,
  setMeasures,
  setChartType,
  setXAxisDimensions,
  setSeriesDimension,
  setBarMeasure,
  setLineMeasure,

  handleGenerateChart,
  handleGoBack,
  setIs3D,
}) => {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      {step === "input-file" && (
        <InputFileStep handleFileUpload={handleFileUpload} setStep={setStep} />
      )}

      {step === "select-diagram-type" && (
        <SelectDiagramTypeStep
          chartType={chartType}
          setChartType={setChartType}
          setStep={setStep}
        />
      )}

      {step === "filter-dimensions" && (
        <FilterDimensionsStep
          dimensions={dimensions}
          setDimensions={setDimensions}
          setStep={setStep}
        />
      )}

      {step === "select-measures" && (
        <SelectMeasuresStep
          chartType={chartType}
          measures={measures}
          setMeasures={setMeasures}
          setStep={setStep}
        />
      )}

      {step === "chart-configuration" && (
        <ChartConfigurationStep
          chartType={chartType}
          dimensions={dimensions}
          measures={measures}
          xAxisDimensions={xAxisDimensions}
          seriesDimension={seriesDimension}
          barMeasure={barMeasure}
          lineMeasure={lineMeasure}
          setXAxisDimensions={setXAxisDimensions}
          setSeriesDimension={setSeriesDimension}
          setBarMeasure={setBarMeasure}
          setLineMeasure={setLineMeasure}
          setStep={setStep}
        />
      )}

      {step === "review-generate" && (
        <ReviewGenerateStep
          dimensions={dimensions}
          setDimensions={setDimensions}
          measures={measures}
          setMeasures={setMeasures}
          xAxisDimensions={xAxisDimensions}
          setXAxisDimensions={setXAxisDimensions}
          seriesDimension={seriesDimension}
          setSeriesDimension={setSeriesDimension}
          chartType={chartType}
          barMeasure={barMeasure}
          setBarMeasure={setBarMeasure}
          lineMeasure={lineMeasure}
          setLineMeasure={setLineMeasure}
          is3D={is3D}
          setIs3D={setIs3D}
          containerRef={containerRef}
          handleGenerateChart={handleGenerateChart}
          handleGoBack={handleGoBack}
          setStep={setStep}
          jsonData={jsonData}
          title={title}
        />
      )}
    </div>
  );
};
