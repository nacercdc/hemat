"use client";

import React, { useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { z } from "zod";
import { Button, InputRHF, Modal } from "@etm/web-ui-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateGroupForm } from "./form/CreateGroupForm";
import { useParams } from "next/navigation";
import MemberRoleCard from "../../components/MemberRoleCard";
import MemberInfo from "./MemberInfo";
import MemberAction from "./MemberAction";
import type { ModalRef } from "@etm/web-ui-components";
import EmailManager from "./EmailManager";

interface Member {
  assessmentId?: string;
  name: string;
  email: string;
  avatarUrl: string;
}

const members: Member[] = [
  {
    name: "Dr.Kebede Alemu",
    email: "kebede@gmail.com",
    avatarUrl: "http://path-that-goes-no-where.com",
  },
  {
    name: "Sara Mengistu",
    email: "sara@gmail.com",
    avatarUrl: "http://path-that-goes-no-where.com",
  },
];

const addAssessmentInvitationSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email" })
    .min(1, { message: "Email is required" }),
});

export type AddAssessmentInvitationFormData = z.infer<
  typeof addAssessmentInvitationSchema
>;

export function SendInvitationrrr() {
  const params = useParams();
  const { id } = params;
  const addTeamGroupModalRef = useRef<ModalRef>(null);

  const { control, handleSubmit } = useForm<AddAssessmentInvitationFormData>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(addAssessmentInvitationSchema),
  });

  const onOpenAddMemberModalHandler = () =>
    addTeamGroupModalRef.current?.openModal();

  const onCancelMemberFormHandler = () =>
    addTeamGroupModalRef.current?.closeModal();

  const onSubmitHandler = (_data: AddAssessmentInvitationFormData) => {
    if (!id) return;
    //TODO: add user data
  };

  const onRefetchHandler = () => {
    //TODO: will be replaced with assessment refetch func
  };

  const onSubmitTeamGroupFormHandler = () => {
    //TODO: Add submit logic here
  };

  return (
    <div className="flex items-start flex-wrap justify-between gap-4">
      <div className="lg:w-3/5 w-full flex flex-col gap-3">
        <div className="bg-dark-lighter/5 p-2 rounded-sm">
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="flex flex-col gap-4 p-2"
          >
            <h1 className="text-sm font-normal">Add Member</h1>
            <div className="flex gap-3">
              <InputRHF<AddAssessmentInvitationFormData>
                control={control}
                name="email"
                label=""
                placeholder="Write email of the user"
                size="lg"
                labelVariant="bold"
              />
              <Button
                leftNode={<Icon icon={"mdi:users-add"} className="!w-5 !h-5" />}
                size="lg"
                color="primaryLight"
                variant="outline"
              >
                Add
              </Button>
            </div>
          </form>
        </div>
        <div className="bg-dark-lighter/5 p-2 rounded-sm">
          <div className="bg-card p-3 rounded-md">
            <div className="flex justify-between">
              <h1>Members </h1>
              <Button
                leftNode={<Icon icon={"mdi:users-add"} className="!w-5 !h-5" />}
                size="lg"
                color="destructive"
                variant="outline"
                onClick={onOpenAddMemberModalHandler}
              >
                Create Team
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              {members.map((group) => (
                <div key={group.email} className="flex justify-between">
                  <MemberInfo email={group.email} name={group.name} />
                  <MemberAction id={group.email} refetch={onRefetchHandler} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <EmailManager />
      </div>
      <div className="flex-1 bg-dark-lighter/5 p-2 rounded-sm gap-2 flex flex-col">
        <MemberRoleCard
          title="Groups Leader"
          icon="meteor-icons:user"
          placeholderText="Group leader here"
        />
        <MemberRoleCard
          title="Team Leader"
          icon="mdi:group-add-outline"
          placeholderText="Team leader here"
        />
      </div>
      <Modal ref={addTeamGroupModalRef}>
        <div className="flex flex-col gap-4">
          <CreateGroupForm
            onCancelTeamGroupForm={onCancelMemberFormHandler}
            onSubmitTeamGroupForm={onSubmitTeamGroupFormHandler}
          />
        </div>
      </Modal>
    </div>
  );
}
