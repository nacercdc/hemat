import React, { Suspense } from "react";
import Login from "~/components/modules/auth/login";

export default function LoginPage({
  params,
}: {
  params: { invitationId: string };
}) {
  return (
    <Suspense>
      <Login invitationId={params.invitationId} />
    </Suspense>
  );
}
