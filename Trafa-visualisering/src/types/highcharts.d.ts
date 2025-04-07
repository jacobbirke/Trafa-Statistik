import * as Highcharts from 'highcharts';

declare module 'highcharts' {
  interface SeriesPieOptions {
    unit?: string;
  }
}