"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { z } from "zod";
import type { ModalRef } from "@etm/web-ui-components";
import { Button, Input } from "@etm/web-ui-components";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MemberRoleCard from "../../components/MemberRoleCard";
import MemberInfo from "./MemberInfo";
import MemberAction from "./MemberAction";
import { useParams } from "next/navigation";
import { Modal } from "@etm/web-ui-components";

const addAssessmentInvitationSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email" })
    .min(1, { message: "Email is required" }),
});

export type AddAssessmentInvitationFormData = z.infer<
  typeof addAssessmentInvitationSchema
>;

export function SendInvitation() {
  const sendInvitationModalRef = useRef<ModalRef>(null);
  const openInvitationModal = () => sendInvitationModalRef.current?.openModal();
  // const onCancelScaleFormHandler = () =>
  //   sendInvitationModalRef.current?.closeModal();
  const [emails, setEmails] = useState<string[]>([]);
  const params = useParams();
  const assessmentId = params.id;
  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<AddAssessmentInvitationFormData>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(addAssessmentInvitationSchema),
  });

  const addEmail = async (): Promise<void> => {
    const isValid = await trigger("email");
    if (!isValid) return;

    const newEmail = getValues("email").trim().toLowerCase();
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setValue("email", "");
    }
  };

  const removeEmail = (email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  };

  const onSubmitHandler = () => {
    if (emails.length === 0) return;
    //TODO: send Invitation with assessment Id
    console.log(emails);
    console.log("ASSESSMENT ID", assessmentId);
    setEmails([]);
  };

  return (
    <div className="flex items-start flex-wrap justify-between gap-4 bg-dark-lighter/5 ">
      <div className="lg:w-3/5 w-full flex flex-col gap-3 p-2">
        <div className="flex gap-3">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                placeholder="Write email of the participant's"
                size="lg"
                error={errors.email?.message}
              />
            )}
          />
          <Button
            leftNode={<Icon icon={"mdi:users-add"} className="!w-5 !h-5" />}
            size="lg"
            color="primaryLight"
            variant="outline"
            onClick={addEmail}
          >
            Add
          </Button>
        </div>
        {emails.length != 0 ? (
          <div className="flex flex-col bg-card rounded-sm p-2">
            <div>
              {emails.map((email) => (
                <div key={email} className="flex justify-between">
                  <MemberInfo email={email} />
                  <MemberAction id={email} refetch={() => removeEmail(email)} />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="lg" onClick={openInvitationModal}>
                Send Invitation
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm p-4">
            Add the email before sending the invitation
          </div>
        )}
      </div>
      <div className="flex-1 rounded-sm gap-2 flex flex-col p-2">
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
      <Modal ref={sendInvitationModalRef}>
        <div className="flex flex-col gap-4 items-center p-10">
          <div>Invitation successfully have been sent to every member</div>
          <div>
            {" "}
            <Icon icon={"material-symbols:add"} className="!w-5 !h-5" />
          </div>
          <div>
            <Button type="submit" size="lg" onClick={onSubmitHandler}>
              Ok
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
