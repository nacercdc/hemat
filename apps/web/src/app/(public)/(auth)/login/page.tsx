import React, { Suspense } from "react";
import Login from "~/components/modules/auth/login";

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
