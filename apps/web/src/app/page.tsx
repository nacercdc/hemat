"use client"

import { Suspense } from "react";
import type { SubmitHandler} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import { z } from "zod"

import {InputRHF} from "@e-market/web-ui-components"

export const runtime = "edge";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
})

type FormInputs = z.infer<typeof formSchema>;

export default function HomePage() {
  const { control, handleSubmit } = useForm<FormInputs>({resolver: zodResolver(formSchema), defaultValues: {firstName: ""}})

  const onSubmit: SubmitHandler<FormInputs> = (data) => console.log(data);

  return (
    <main className=" h-screen py-16 w-full">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Welcome <span className="text-primary">to</span> yarn monorepo starter
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputRHF size={"lg"} name="firstName" label={"Username"} control={control} description="Enter your first name here ..."  />
          <button type="submit">Submit</button>
        </form>
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
