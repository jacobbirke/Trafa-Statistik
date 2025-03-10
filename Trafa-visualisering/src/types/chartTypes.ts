export type ChartType = "column" | "line" | "combo" | "pie" | "stacked" | "stackedArea" | "variwide";
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
  is3D: boolean;
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
  setIs3D: React.Dispatch<React.SetStateAction<boolean>>;
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
}
