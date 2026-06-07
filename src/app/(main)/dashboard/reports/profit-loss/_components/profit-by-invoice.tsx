import { ProfitReportGrid } from "./profit-report-grid";
import { reportData, toProfitRows } from "./report-data";

export function ProfitByInvoice() {
  return (
    <ProfitReportGrid
      title="Profit by invoice"
      description="Audit gross profit down to individual invoices."
      dimensionLabel="Invoice"
      transactionLabel="Items"
      rows={toProfitRows(reportData.invoices)}
    />
  );
}
