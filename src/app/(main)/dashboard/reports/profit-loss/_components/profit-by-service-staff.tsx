import { ProfitReportGrid } from "./profit-report-grid";
import { reportData, toProfitRows } from "./report-data";

export function ProfitByServiceStaff() {
  return (
    <ProfitReportGrid
      title="Profit by service staff"
      description="Understand sales and profit contribution by team member."
      dimensionLabel="Service staff"
      transactionLabel="Orders"
      rows={toProfitRows(reportData.staff)}
    />
  );
}
