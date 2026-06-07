import { ProfitReportGrid } from "./profit-report-grid";
import { reportData, toProfitRows } from "./report-data";

export function ProfitByCustomer() {
  return (
    <ProfitReportGrid
      title="Profit by customer"
      description="Find your highest-value customers and accounts."
      dimensionLabel="Customer"
      transactionLabel="Orders"
      rows={toProfitRows(reportData.customers)}
    />
  );
}
