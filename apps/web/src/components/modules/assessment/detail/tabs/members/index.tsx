"use client";

import React, { useRef } from "react";
import MemberRoleCard from "../../components/members/MemberRoleCard";
import { string, z } from "zod";
import { Button, InputRHF, ModalRef, Modal } from "@etm/web-ui-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react/dist/iconify.js";
import MemberInfo from "./components/MemberInfo";
import MemberAction from "./components/MemberAction";
import { CreateGroupForm } from "./components/CreateGroupForm";
import { useParams } from "next/navigation";

const AddAssessmentInvitationSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email" })
    .min(1, { message: "Email is required" }),
  assessmentId: string(),
});

export type AddAssessmentInvitationFormData = z.infer<
  typeof AddAssessmentInvitationSchema
>;

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

export default function MemberInvitation() {
  const params = useParams();
  const assessmentId = params.id;
  const addTeamGroupModalRef = useRef<ModalRef>(null);
  const openAddMemberModal = () => addTeamGroupModalRef.current?.openModal();
  const onCancelMemberFormHandler = () =>
    addTeamGroupModalRef.current?.closeModal();

  const { control, handleSubmit, reset } =
    useForm<AddAssessmentInvitationFormData>({
      defaultValues: {
        email: "",
        assessmentId: `{${assessmentId}}`,
      },
      resolver: zodResolver(AddAssessmentInvitationSchema),
    });

  const onSubmit = (data: AddAssessmentInvitationFormData) => {
    //TODO: add user data
  };

  const refetch = () => {
    //TODO: will be replaced with assessment refetch func
  };

  const onSubmitTeamGroupFormHandler = () => {
    //TODO: Add submit logic here
  };

  return (
    <div className="flex items-start flex-wrap justify-between  gap-4">
      <div className="lg:w-3/5 w-full flex flex-col gap-3">
        <div className="bg-dark-lighter/5 p-2 rounded-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-2"
          >
            <h1 className="text-sm font-normal ">Add Member</h1>
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
          <div className="bg-white p-3 rounded-md">
            <div className="flex justify-between">
              <h1>Members </h1>
              <Button
                leftNode={<Icon icon={"mdi:users-add"} className="!w-5 !h-5" />}
                size="lg"
                color="destructive"
                variant="outline"
                onClick={openAddMemberModal}
              >
                Create Team
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              {members.map((group) => (
                <div className="flex justify-between">
                  <MemberInfo
                    key={group.email}
                    email={group.email}
                    name={group.name}
                  />
                  <MemberAction id={group.email} refetch={refetch} />
                </div>
              ))}
            </div>
          </div>
        </div>
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
