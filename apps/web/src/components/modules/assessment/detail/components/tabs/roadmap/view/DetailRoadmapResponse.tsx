"use client";
import { Badge } from "@etm/web-ui-components";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { PageContainer } from "~/components/modules/components/PageContainer";
import RoadmapDomainComponent from "../components/RoadmapDomainComponent";

export default function DetailRoadmapResponse() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id;
  const onBackHandler = useCallback(() => {
    router.back();
  }, [assessmentId]);

  const dummyData = {
    domain: {
      name: "Leadership and Governance",
      code: "I.",
      targetValue: 4,
      currentValue: 5,
      components: [
        {
          component_name: "HIE Strategy",
          component_code: "I.B.",
          current_state: 4,
          target_state: 5,
          sub_component: [
            {
              gap_address:
                "# Infrastructure to support training, including distance learning are limited",
              strategic_invitation:
                "Eg: Establish sufficient infrastructure to support different modes of training, including distance learning.",
              who_responsible: "MOH",
              resource_used: "",
              upload_document:
                "Presence of sufficinet infrastracture to support training in national and subnational leve",
              code: "I.B.1",
              name: "HIE strategic plan ",
              current_state: 3,
              target: 4,
            },
            {
              gap_address:
                "# Infrastructure to support training, including distance learning are limited",
              strategic_invitation:
                "Eg: Establish sufficient infrastructure to support different modes of training, including distance learning.",
              who_responsible: "MOH",
              resource_used: "",
              upload_document:
                "Presence of sufficinet infrastracture to support training in national and subnational leve",
              code: "I.B.2",
              name: "HIE strategic plan ",
              current_state: 3,
              target: 4,
            },
          ],
        },
        {
          component_name: "HIE Strategy",
          component_code: "I.A.",
          current_state: 4,
          target_state: 5,
          sub_component: [
            {
              gap_address:
                "# Infrastructure to support training, including distance learning are limited",
              strategic_invitation:
                "Eg: Establish sufficient infrastructure to support different modes of training, including distance learning.",
              who_responsible: "MOH",
              resource_used: "",
              upload_document:
                "Presence of sufficinet infrastracture to support training in national and subnational leve",
              code: "I.A.1",
              name: "HIE strategic plan ",
              current_state: 2,
              target: 4,
            },
            {
              gap_address:
                "# Infrastructure to support training, including distance learning are limited",
              strategic_invitation:
                "Eg: Establish sufficient infrastructure to support different modes of training, including distance learning.",
              who_responsible: "MOH",
              resource_used: "",
              upload_document:
                "Presence of sufficinet infrastracture to support training in national and subnational leve",
              code: "I.A.2",
              name: "HIE strategic plan ",
              current_state: 2,
              target: 4,
            },
          ],
        },
      ],
    },
  };
  return (
    <PageContainer
      pageTitle={
        <div className="flex gap-4 items-center  ">
          <h1 className="font-bold text-lg">
            {dummyData.domain.code} {dummyData.domain.name}
          </h1>
          <Badge
            text={`Current : ${dummyData.domain.currentValue}`}
            variant={"info"}
          />
          <Badge
            text={`Target : ${dummyData.domain.targetValue}`}
            variant={"success"}
          />
        </div>
      }
      includeBreadcrumb={false}
      onBack={onBackHandler}
    >
      {dummyData.domain.components.map((comp) => (
        <RoadmapDomainComponent component={comp} key={comp.component_code} />
      ))}
    </PageContainer>
  );
}
