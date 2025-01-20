import { Suspense } from "react";

export const runtime = "edge";

export default function HomePage() {
  return (
    <main className="container h-screen py-16">
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
      </div>
    </main>
  );
}
