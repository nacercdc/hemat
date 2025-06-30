"use client";

import React, { useCallback } from "react";
import DomainComponent from "../components/DomainComponent";
import { useRouter } from "next/navigation";
import { PageContainer } from "~/components/modules/components/PageContainer";

export default function DetailAssessmentResponse() {
  const router = useRouter();

  const onBackHandler = useCallback(() => {
    router.back();
  }, [router]);

  const dummyData = {
    domain: {
      name: "Leaderships and Governance",
      code: "1.A",
      components: [
        {
          component_name: "Strategic Plan",
          component_code: "s-code",
          sub_component_name: [
            {
              name: "sub-name-1",
              answer: [
                {
                  evaluation: "evaluation",
                  desc: "desc",
                  value: [
                    {
                      point: 5,
                      code: "code one",
                    },
                  ],
                },
              ],
            },
            {
              name: "sub-name-2",
              answer: [
                {
                  evaluation: "evaluation two",
                  desc: "desc two",
                  value: [
                    {
                      point: 5,
                      code: "code two",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          component_name: "Strategic Plan",
          component_code: "s-code",
          sub_component_name: [
            {
              name: "sub-name-1",
              answer: [
                {
                  evaluation: "evaluation",
                  desc: "desc",
                  value: [
                    {
                      point: 5,
                      code: "code one",
                    },
                  ],
                },
              ],
            },
            {
              name: "sub-name-2",
              answer: [
                {
                  evaluation: "evaluation two",
                  desc: "desc two",
                  value: [
                    {
                      point: 5,
                      code: "code two",
                    },
                  ],
                },
              ],
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
            {dummyData.domain.code} {dummyData.domain.name}{" "}
          </h1>
          <span className="px-3 py-1  bg-primary  font-bold text-sm text-white rounded-sm">
            5
          </span>
        </div>
      }
      includeBreadcrumb={false}
      onBack={onBackHandler}
    >
      <div className="p-6">
        <div className="flex flex-col gap-5">
          <div className="flex gap-2 items-center  ">
            <h1 className="font-bold text-sm">1.A Component One </h1>
            <span className="px-3 py-1  bg-primary  font-bold text-sm text-white rounded-sm">
              5
            </span>
          </div>
          <DomainComponent components={[]} />
        </div>
      </div>
      <div></div>
    </PageContainer>
  );
}
