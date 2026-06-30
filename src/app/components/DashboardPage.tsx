import { DashboardContent } from "./DashboardContent";
import { RightPanel } from "./RightPanel";

export function DashboardPage() {
  return (
    <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto">
      <div className="flex-1 min-w-0">
        <DashboardContent />
      </div>
      <div className="w-full xl:w-80 shrink-0">
        <RightPanel />
      </div>
    </div>
  );
}
