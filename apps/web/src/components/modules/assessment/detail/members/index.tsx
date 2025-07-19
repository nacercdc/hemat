import { SecondaryTabs } from "@etm/web-ui-components";
import AssessmentGroups from "./components/AssessmentGroups";
import { SendInvitation } from "./components/invitation/SendInvitation";

export function MemberInvitation() {
  return (
    <SecondaryTabs
      options={[
        {
          value: "participants",
          label: "Participants ",
          content: <AssessmentGroups />,
        },

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
