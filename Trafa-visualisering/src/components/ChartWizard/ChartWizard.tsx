import React from "react";
import { InputFileStep } from "./steps/InputFileStep";
import { SelectDiagramTypeStep } from "./steps/SelectDiagramTypeStep";
import { FilterDimensionsStep } from "./steps/FilterDimensionsStep";
import { SelectMeasuresStep } from "./steps/SelectMeasuresStep";
import { ChartConfigurationStep } from "./steps/ChartConfigurationStep";
import { ReviewGenerateStep } from "./steps/ReviewGenerateStep";
import { ChartWizardProps } from "../../types/chartTypes";
import { InputSourceStep } from "./steps/InputSourceStep";
import { SelectApiProductStep } from "./steps/SelectApiProductStep";
import { ConfigureApiQueryStep } from "./steps/ConfigureApiQueryStep";
import { DisplayApiDataStep } from "./steps/DisplayApiDataStep";

export const ChartWizard: React.FC<ChartWizardProps> = ({
  step,
  chartType,
  dimensions,
  measures,
  xAxisDimensions,
  seriesDimension,
  barMeasure,
  lineMeasure,
  jsonData,
  title,
  setTitle,
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
  setSeriesColors,
  seriesColors,
  setMeasureColors,
  measureColors,
  handleGenerateChart,
  handleGoBack,
  legendPosition,
  setLegendPosition,
  variwideWidthMeasure,
  setVariwideWidthMeasure,
  variwideHeightMeasure,
  setVariwideHeightMeasure,
  yAxisPrimaryTitle,
  setYAxisPrimaryTitle,
  yAxisSecondaryTitle,
  setYAxisSecondaryTitle,
  yAxisPrimaryMin,
  setYAxisPrimaryMin,
  yAxisPrimaryMax,
  setYAxisPrimaryMax,
  yAxisPrimaryTick,
  setYAxisPrimaryTick,
  yAxisSecondaryMin,
  setYAxisSecondaryMin,
  yAxisSecondaryMax,
  setYAxisSecondaryMax,
  yAxisSecondaryTick,
  setYAxisSecondaryTick,
  seriesIcons,
  setSeriesIcons,
  yAxisTitlePosition,
  setYAxisTitlePosition,
  yAxisSecondaryTitlePosition,
  setYAxisSecondaryTitlePosition,
  confidenceMeasures,
  confidenceMeasure,
  setConfidenceMeasure,
  errorDisplayType,
  setErrorDisplayType,
  selectedProduct,
  setSelectedProduct,
  apiQuery,
  setApiQuery,
  setJsonData,
}) => {
  return (
    <div className="max-w-5xl mx-auto p-3 space-y-8">
      {step === "input-source" && <InputSourceStep setStep={setStep} />}

      {step === "input-file" && (
        <InputFileStep handleFileUpload={handleFileUpload} setStep={setStep} />
      )}

      {step === "select-api-product" && (
        <SelectApiProductStep
          setSelectedProduct={setSelectedProduct}
          setStep={setStep}
        />
      )}

      {step === "configure-api-query" && (
        <ConfigureApiQueryStep
          productId={selectedProduct}
          setQuery={setApiQuery}
          setStep={setStep}
          setDimensions={setDimensions}
          setMeasures={setMeasures}
        />
      )}

      {step === "fetch-data" && (
        <DisplayApiDataStep
          query={apiQuery}
          setStep={setStep}
          setDimensions={setDimensions}
          setMeasures={setMeasures}
          setJsonData={setJsonData}
        />
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
          variwideWidthMeasure={variwideWidthMeasure}
          setVariwideWidthMeasure={setVariwideWidthMeasure}
          variwideHeightMeasure={variwideHeightMeasure}
          setVariwideHeightMeasure={setVariwideHeightMeasure}
          barMeasure={barMeasure}
          lineMeasure={lineMeasure}
          setBarMeasure={setBarMeasure}
          setLineMeasure={setLineMeasure}
          confidenceMeasures={confidenceMeasures}
          confidenceMeasure={confidenceMeasure}
          setConfidenceMeasure={setConfidenceMeasure}
        />
      )}

      {step === "chart-configuration" && (
        <ChartConfigurationStep
          chartType={chartType}
          dimensions={dimensions}
          measures={measures}
          xAxisDimensions={xAxisDimensions}
          seriesDimension={seriesDimension}
          setXAxisDimensions={setXAxisDimensions}
          setSeriesDimension={setSeriesDimension}
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
          containerRef={containerRef}
          handleGenerateChart={handleGenerateChart}
          handleGoBack={handleGoBack}
          setStep={setStep}
          jsonData={jsonData}
          setJsonData={setJsonData}
          title={title}
          setTitle={setTitle}
          seriesColors={seriesColors}
          setSeriesColors={setSeriesColors}
          measureColors={measureColors}
          setMeasureColors={setMeasureColors}
          legendPosition={legendPosition}
          setLegendPosition={setLegendPosition}
          variwideWidthMeasure={variwideWidthMeasure}
          setVariwideWidthMeasure={setVariwideWidthMeasure}
          variwideHeightMeasure={variwideHeightMeasure}
          setVariwideHeightMeasure={setVariwideHeightMeasure}
          yAxisPrimaryTitle={yAxisPrimaryTitle}
          setYAxisPrimaryTitle={setYAxisPrimaryTitle}
          yAxisSecondaryTitle={yAxisSecondaryTitle}
          setYAxisSecondaryTitle={setYAxisSecondaryTitle}
          yAxisPrimaryMin={yAxisPrimaryMin}
          setYAxisPrimaryMin={setYAxisPrimaryMin}
          yAxisPrimaryMax={yAxisPrimaryMax}
          setYAxisPrimaryMax={setYAxisPrimaryMax}
          yAxisPrimaryTick={yAxisPrimaryTick}
          setYAxisPrimaryTick={setYAxisPrimaryTick}
          yAxisSecondaryMin={yAxisSecondaryMin}
          setYAxisSecondaryMin={setYAxisSecondaryMin}
          yAxisSecondaryMax={yAxisSecondaryMax}
          setYAxisSecondaryMax={setYAxisSecondaryMax}
          yAxisSecondaryTick={yAxisSecondaryTick}
          setYAxisSecondaryTick={setYAxisSecondaryTick}
          seriesIcons={seriesIcons}
          setSeriesIcons={setSeriesIcons}
          yAxisTitlePosition={yAxisTitlePosition}
          setYAxisTitlePosition={setYAxisTitlePosition}
          yAxisSecondaryTitlePosition={yAxisSecondaryTitlePosition}
          setYAxisSecondaryTitlePosition={setYAxisSecondaryTitlePosition}
          confidenceMeasure={confidenceMeasure}
          setConfidenceMeasure={setConfidenceMeasure}
          confidenceMeasures={confidenceMeasures}
          errorDisplayType={errorDisplayType}
          setErrorDisplayType={setErrorDisplayType}
        />
      )}
    </div>
  );
};
