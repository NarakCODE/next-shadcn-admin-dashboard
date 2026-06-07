import { ProfitReportGrid } from "./profit-report-grid";
import { reportData, toProfitRows } from "./report-data";

export function ProfitByProducts() {
  return (
    <ProfitReportGrid
      title="Profit by products"
      description="See which individual products create the most value."
      dimensionLabel="Product"
      transactionLabel="Units sold"
      rows={toProfitRows(reportData.products)}
    />
  );
}
