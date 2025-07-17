import { SecondaryTabs } from "@etm/web-ui-components";
import { SendInvitation } from "./components/SendInvitation";
import AssessmentGroups from "./components/AssessmentGroups";

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
