"use client";

import { Suspense } from "react";
import { useFirestoreAddDocument } from "@e-market/web-firebase";
import { firestore } from "~/config/firebase.config";

export const runtime = "edge";

export default function HomePage() {
  const { mutate: createLanguage, ...state } =
    useFirestoreAddDocument(firestore);
  const handleCreateLanguage = () => {
    createLanguage({
      code: "gu",
      name: "Guragigna",
    });
  };
  return (
    <main className=" h-screen py-16 w-full">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Welcome <span className="text-primary">to</span> yarn monorepo starter
        </h1>

        <div className="w-full max-w-2xl overflow-y-scroll">
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-4">Loading...</div>
            }
          ></Suspense>
        </div>
        <button onClick={handleCreateLanguage}>
          {state.isPending ? "Pending..." : "Save language"}
        </button>
      </div>
    </main>
  );
}
