import { testingOn } from "@/flags";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
  const isTesting = await testingOn();
  return <DashboardContent isTesting={isTesting} />;
}
