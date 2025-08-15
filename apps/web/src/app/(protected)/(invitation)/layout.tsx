import { InvitationLayout } from "~/components/layouts/protected/InvitationLayout";

interface Props {
  children: React.ReactNode;
}
export default function layout({ children }: Props) {
  return <InvitationLayout>{children}</InvitationLayout>;
}
