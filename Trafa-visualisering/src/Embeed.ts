import { handleGenerateChart } from "./components/handleGenerateChart";
import { createChart } from "./utils/chartUtils";

const qs = new URLSearchParams(location.search);
const config = JSON.parse(qs.get("config")!);

    document.addEventListener('DOMContentLoaded', function () {
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '600px';
  document.body.appendChild(container);
  
  const chart = createChart(container);
  handleGenerateChart(chart, config, container);
});
