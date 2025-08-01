import { DropdownMenu } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import type { RoadmapList } from "~/libs/models/roadmap.model";
interface Props {
  roadmap: RoadmapList;
}
export default function ScaleAction({ roadmap }: Props) {
  const router = useRouter();
  const onGotoDetailRoadmapHandler = () => {
    router.push(`/assessment/${roadmap.assessmentId}/roadmap/${roadmap.id}`);
  };

  return (
    <>
      <DropdownMenu
        triggerTextAlign="end"
        align="end"
        trigger={
          <Icon
            icon="mi:options-horizontal"
            className="text-xl text-right text-dark"
          />
        }
        options={[
          {
            value: "view",
            label: "View",
            leftNode: (
              <Icon icon="solar:eye-outline" className="text-lg text-dark" />
            ),
            onClick: onGotoDetailRoadmapHandler,
          },
        ]}
      />
    </>
  );
}
