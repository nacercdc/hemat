import React, { Suspense } from "react";
import Register from "~/components/modules/auth/register";

export default function RegisterPage() {
  return (
    <Suspense>
      <Register />
    </Suspense>
  );
}
