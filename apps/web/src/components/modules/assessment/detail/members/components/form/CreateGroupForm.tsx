"use client";

import { useEffect, useState } from "react";
import { Button, InputRHF } from "@etm/web-ui-components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MemberInfo from "../MemberInfo";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CreateGroupFormSkeleton } from "./CreateGroupFormSkeleton";

const LanguageFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export type TeamGroupFormData = z.infer<typeof LanguageFormSchema>;

interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

const DummyMembers: Member[] = [
  {
    id: "1",
    name: "Dr.Kebede Alemu",
    email: "kebede@gmail.com",
    avatarUrl: "http://path-that-goes-no-where.com",
  },
  {
    id: "2",
    name: "Sara Mengistu",
    email: "sara@gmail.com",
    avatarUrl: "http://path-that-goes-no-where.com",
  },
];
const fetchAssessmentMembers = (): Promise<Member[]> => {
  // TODO: This function fetch invited user
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DummyMembers);
    }, 1000);
  });
};

interface Props {
  onSubmitTeamGroupForm: (values: TeamGroupFormData) => void;
  onCancelTeamGroupForm?: () => void;
}

export function CreateGroupForm({
  onSubmitTeamGroupForm,
  onCancelTeamGroupForm,
}: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { control, handleSubmit, reset } = useForm<TeamGroupFormData>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(LanguageFormSchema),
    mode: "all",
  });

  const onCancelHandler = () => {
    onCancelTeamGroupForm?.();
    reset();
  };

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      const data = await fetchAssessmentMembers();
      setMembers(data);
      setIsLoading(false);
    };

    fetchMembers();
  }, []);

  if (isLoading) {
    return <CreateGroupFormSkeleton />;
  }

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmitTeamGroupForm(values);
        reset();
      })}
      className="flex flex-col w-full min-h-20 bg-card rounded-xl relative"
    >
      <div className="text-xl font-bold px-8 pt-8 mb-6">Create Team</div>
      <div className="flex flex-col gap-6 px-8 flex-1 py-8 w-full">
        <InputRHF<TeamGroupFormData>
          control={control}
          name="name"
          label="Name"
          placeholder="Write Group Name "
          size="xl"
          labelVariant="bold"
        />
        <div className="flex flex-col gap-4">
          {members.map((group) => (
            <div className="flex justify-between">
              <MemberInfo
                key={group.id}
                email={group.email}
                name={group.name}
              />
              <Icon icon="mdi:add" className="text-xl text-right text-dark" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center w-full bg-layout-bg p-4 rounded-b-lg px-8 mt-auto">
        <Button variant="outline" type="button" onClick={onCancelHandler}>
          Reset to default
        </Button>
        <div className="flex gap-4">
          <Button
            variant="outline"
            type="button"
            color="card"
            onClick={onCancelHandler}
          >
            Cancel
          </Button>
          <Button size="lg" type="submit">
            Create Group
          </Button>
        </div>
      </div>
    </form>
  );
}
