import { ProfitReportGrid } from "./profit-report-grid";
import { reportData, toProfitRows } from "./report-data";

export function ProfitByCategories() {
  return (
    <ProfitReportGrid
      title="Profit by categories"
      description="Compare performance across your product catalog."
      dimensionLabel="Category"
      transactionLabel="Units sold"
      rows={toProfitRows(reportData.categories)}
    />
  );
}
