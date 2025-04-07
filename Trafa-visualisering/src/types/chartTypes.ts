export type ChartType =
  | "column"
  | "line"
  | "combo"
  | "pie"
  | "stacked"
  | "stackedArea"
  | "variwide";
export type WizardStep =
  | "input-file"
  | "select-diagram-type"
  | "filter-dimensions"
  | "select-measures"
  | "chart-configuration"
  | "review-generate";

export interface Dimension {
  name: string;
  allValues: string[];
  selectedValues: string[];
  unit?: string;
}

export interface Measure {
  name: string;
  unit?: string;
  isSelected: boolean;
}

export interface ChartWizardProps {
  step: WizardStep;
  chartType: ChartType;
  dimensions: Dimension[];
  measures: Measure[];
  xAxisDimensions: string[];
  seriesDimension: string | null;
  barMeasure: string | null;
  lineMeasure: string | null;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setStep: React.Dispatch<React.SetStateAction<WizardStep>>;
  setDimensions: React.Dispatch<React.SetStateAction<Dimension[]>>;
  setMeasures: React.Dispatch<React.SetStateAction<Measure[]>>;
  setChartType: React.Dispatch<React.SetStateAction<ChartType>>;
  setXAxisDimensions: React.Dispatch<React.SetStateAction<string[]>>;
  setSeriesDimension: React.Dispatch<React.SetStateAction<string | null>>;
  setBarMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  setLineMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  handleGenerateChart: () => void;
  handleGoBack: () => void;
  jsonData: any[];
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  seriesColors: Record<string, string>;
  setSeriesColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  measureColors: Record<string, string>;
  setMeasureColors: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  legendPosition: string;
  setLegendPosition: React.Dispatch<React.SetStateAction<string>>;
  variwideWidthMeasure: string | null;
  setVariwideWidthMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  variwideHeightMeasure: string | null;
  setVariwideHeightMeasure: React.Dispatch<React.SetStateAction<string | null>>;
  yAxisPrimaryTitle: string;
  setYAxisPrimaryTitle: React.Dispatch<React.SetStateAction<string>>;
  yAxisSecondaryTitle: string;
  setYAxisSecondaryTitle: React.Dispatch<React.SetStateAction<string>>;
  yAxisPrimaryMin?: number;
  setYAxisPrimaryMin: React.Dispatch<React.SetStateAction<number | undefined>>;
  yAxisPrimaryMax?: number;
  setYAxisPrimaryMax: React.Dispatch<React.SetStateAction<number | undefined>>;
  yAxisPrimaryTick?: number;
  setYAxisPrimaryTick: React.Dispatch<React.SetStateAction<number | undefined>>;
  yAxisSecondaryMin?: number;
  setYAxisSecondaryMin: React.Dispatch<React.SetStateAction<number | undefined>>;
  yAxisSecondaryMax?: number;
  setYAxisSecondaryMax: React.Dispatch<React.SetStateAction<number | undefined>>;
  yAxisSecondaryTick?: number;
  setYAxisSecondaryTick: React.Dispatch<React.SetStateAction<number | undefined>>;
  seriesIcons: Record<string, string>;
  setSeriesIcons: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  yAxisTitlePosition: string;
  setYAxisTitlePosition: React.Dispatch<React.SetStateAction<string>>;
  yAxisSecondaryTitlePosition: string;
  setYAxisSecondaryTitlePosition: React.Dispatch<React.SetStateAction<string>>;
}
