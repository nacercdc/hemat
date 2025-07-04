import { SecondaryTabs } from "@etm/web-ui-components";
import SubComponents from "../settings/components/tabs/subComponents";
import MeasurementScales from "../settings/components/tabs/measurement-scales";
import { SendInvitation } from "./components/SendInvitation";

export function MemberInvitation() {
  return (
    <SecondaryTabs
      options={[
        {
          value: "subComponents",
          label: "Participants ",
          content: <SendInvitation />,
        },
        {
          value: "send-invitation",
          label: "Send Invitation",
          content: <SendInvitation />,
        },
      ]}
      defaultValue="domain"
    />
  );
}
