import { useRouter } from "next/navigation";
import React from "react";
import { HorizontalDotButton } from "~/components/modules/components/HorizontalDotButton";
// TODO: move the interface to models
export interface Organization {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
}

interface Props {
  organization: Organization;
}
export default function OrganizationAction({ organization }: Props) {
  const router = useRouter();

  const onGotoUpdateHandler = () => {
    router.push(`/organizations/${organization.id}`);
  };

  return (
    <div className="w-full flex justify-end py-2.5">
      <HorizontalDotButton onClick={onGotoUpdateHandler} />
    </div>
  );
}
