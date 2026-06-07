import { PageHeader } from "@/components/page-header";

import { ProfitLossReport } from "./_components/profit-loss-report";

export default function ProfitLossReportPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Profit & Loss"
        subtitle="Compare revenue, cost, and gross profit across every part of your business."
      />
      <ProfitLossReport />
    </div>
  );
}
