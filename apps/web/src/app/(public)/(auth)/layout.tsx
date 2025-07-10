import { AuthLayout } from "~/components/layouts/auth";

interface Props {
  children: React.ReactNode;
}

export default function layout({ children }: Props) {
  return <AuthLayout>{children}</AuthLayout>;
}
