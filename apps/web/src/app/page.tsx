"use client"

import { Suspense } from "react";
import {MultiSelect} from "@e-market/web-ui-components"

export const runtime = "edge";

interface User {
  id: number;
  name: string;
}

const allUsers: User[] = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alice Johnson" },
  { id: 4, name: "Bob Brown" },
  { id: 5, name: "Charlie Davis" },
];

export default function HomePage() {

  const handleSelect = (value: User[] | undefined) => {
    console.log("Selected value:", value);
  };

  return (
    <main className=" h-screen py-16 w-full">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Welcome <span className="text-primary">to</span> yarn monorepo starter
        </h1>

        <MultiSelect
          name="user"
          displayLabel="Users"
          displayDescription="Select a user"
          options={allUsers}
          valueKey="id"
          labelKey="name"
          placeholder="Select a user"
          searchPlaceholder="Search users..."
          emptyText="No users found."
          onSelect={handleSelect}
        />

        <div className="w-full max-w-2xl overflow-y-scroll">
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-4">Loading...</div>
            }
          ></Suspense>
        </div>
      </div>
    </main>
  );
}
