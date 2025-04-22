import { DashboardLayout } from "~/components/layouts/dashboard";

interface Props {
  children: React.ReactNode;
}
export default function layout({ children }: Props) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
