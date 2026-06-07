import { ProfitReportGrid } from "./profit-report-grid";
import { reportData, toProfitRows } from "./report-data";

export function ProfitByBrands() {
  return (
    <ProfitReportGrid
      title="Profit by brands"
      description="Identify the brands contributing most to gross profit."
      dimensionLabel="Brand"
      transactionLabel="Units sold"
      rows={toProfitRows(reportData.brands)}
    />
  );
}
