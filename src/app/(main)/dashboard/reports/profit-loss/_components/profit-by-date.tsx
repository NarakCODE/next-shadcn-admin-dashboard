import { ProfitReportGrid } from "./profit-report-grid";
import { reportData, toProfitRows } from "./report-data";

export function ProfitByDate() {
  return (
    <ProfitReportGrid
      title="Profit by date"
      description="Review daily revenue, cost, and margin movement."
      dimensionLabel="Date"
      transactionLabel="Orders"
      rows={toProfitRows(reportData.dates)}
    />
  );
}
