import { ProfitReportGrid } from "./profit-report-grid";
import { reportData, toProfitRows } from "./report-data";

export function ProfitByLocations() {
  return (
    <ProfitReportGrid
      title="Profit by locations"
      description="Measure profitability across stores and channels."
      dimensionLabel="Location"
      transactionLabel="Orders"
      rows={toProfitRows(reportData.locations)}
    />
  );
}
