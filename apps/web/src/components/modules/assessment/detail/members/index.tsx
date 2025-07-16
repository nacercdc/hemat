import { SecondaryTabs } from "@etm/web-ui-components";
import { SendInvitation } from "./components/SendInvitation";

export function MemberInvitation() {
  return (
    <SecondaryTabs
      options={[
        {
          value: "send-invitation",
          label: "Send Invitation",
          content: <SendInvitation />,
        },
      ]}
      defaultValue="participants"
    />
  );
}
