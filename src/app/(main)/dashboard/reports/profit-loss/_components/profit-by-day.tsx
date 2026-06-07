import { ProfitReportGrid } from "./profit-report-grid";
import { reportData, toProfitRows } from "./report-data";

export function ProfitByDay() {
  return (
    <ProfitReportGrid
      title="Profit by day"
      description="Compare recurring weekday trading patterns."
      dimensionLabel="Day of week"
      transactionLabel="Orders"
      rows={toProfitRows(reportData.days)}
    />
  );
}
