"use client";

import { PageContainer } from "../components/PageContainer";
import { InvitationsTable } from "./components/table";

export function Invitations() {
  return (
    <PageContainer pageTitle="Invitations" includeBreadcrumb={false}>
      <InvitationsTable />
    </PageContainer>
  );
}
