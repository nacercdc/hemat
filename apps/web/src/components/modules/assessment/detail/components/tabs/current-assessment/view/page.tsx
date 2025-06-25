"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { PageContainer } from "~/components/modules/components/PageContainer";
import DomainComponent from "../components/DomainComponent";

interface Value {
  point: number;
  code: string;
}

interface Answer {
  evaluation: string;
  desc: string;
  value: Value[];
}

interface SubComponent {
  name: string;
  answer: Answer[];
}

interface Component {
  component_name: string;
  component_code: string;
  sub_component_name: SubComponent[];
}

interface Domain {
  name: string;
  code: string;
  components: Component[];
}

interface DummyData {
  domain: Domain;
}

export default function DetailAssessmentResponse() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id;

  const onBackHandler = useCallback(() => {
    router.back();
  }, [assessmentId]);

  const dummyData = {
    domain: {
      name: "Leaderships and Governance",
      code: "1.A",
      components: [
        {
          component_name: "Stratagic Plan",
          component_code: "kkkkkkkkkkkkk",
          sub_component_name: [
            {
              name: "lll",
              answer: [
                {
                  evaluation: "mmmmmmmmm",
                  desc: "mmmmmmmmmmmm",
                  value: [
                    {
                      point: 5,
                      code: "ooooo",
                    },
                  ],
                },
              ],
            },
            {
              name: "lll",
              answer: [
                {
                  evaluation: "mmmmmmmmm",
                  desc: "mmmmmmmmmmmm",
                  value: [
                    {
                      point: 5,
                      code: "ooooo",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          component_name: "",
          component_code: "kkkkkkkkkkkkk",
          sub_component_name: [
            {
              name: "lll",
              answer: [
                {
                  evaluation: "mmmmmmmmm",
                  desc: "mmmmmmmmmmmm",
                  value: [
                    {
                      point: 5,
                      code: "ooooo",
                    },
                  ],
                },
              ],
            },
            {
              name: "lll",
              answer: [
                {
                  evaluation: "mmmmmmmmm",
                  desc: "mmmmmmmmmmmm",
                  value: [
                    {
                      point: 5,
                      code: "ooooo",
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
          <DomainComponent components={dummyData.domain.components} />
        </div>
      </div>
      <div></div>
    </PageContainer>
  );
}
