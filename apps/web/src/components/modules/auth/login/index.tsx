"use client";

import React, { useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, InputRHF, useToast } from "@etm/web-ui-components";
import PasswordVisibilityToggler from "../../components/PasswordVisibilityToggler";
import { AuthCardHeader } from "../components/AuthCardHeader";
import Link from "next/link";
import { useAddMutation as useLogin } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import type { LoginRequestBody } from "~/app/api/types";

type ActionMode = "resetPassword";

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormInputs = z.infer<typeof loginFormSchema>;
export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const { toast } = useToast();

  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: login, ...loginState } = useLogin<unknown, LoginRequestBody>(
    "/api/login"
  );

  const { control, handleSubmit } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onForgotPasswordRouteHandler = () => {
    router.push("/forgot-password");
  };

  const onSetPasswordVisibleHandler = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onLoginHandler = (values: LoginFormInputs) => {
    login(
      {
        baseURL: window.location.origin,
        data: {
          username: values.email,
          password: values.password,
        },
        isProtected: false,
      },
      {
        onSuccess: () => {
          router.replace("/");
        },
        onError: (error) => {
          toast({
            message:
              (JSON.parse(error.message) as { error?: string })?.error ??
              "Login failed.",
            title: "Login Error",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (
    (searchParams.get("mode") as ActionMode) === "resetPassword" &&
    searchParams.get("oobCode")
  ) {
    return redirect(`/reset-password?oobCode=${searchParams.get("oobCode")}`);
  }

  return (
    <form
      onSubmit={handleSubmit(onLoginHandler)}
      className="flex flex-col gap-8 h-full"
    >
      <AuthCardHeader
        header="Sign In"
        subHeader="Enter your credentials to login in to your account"
      />
      <div className="flex flex-col gap-4">
        <InputRHF
          label="Email"
          placeholder="Enter email"
          control={control}
          name="email"
          labelVariant="medium"
        />
        <InputRHF
          control={control}
          name="password"
          label="Password"
          placeholder="Enter password"
          labelVariant="medium"
          type={passwordVisible ? "text" : "password"}
          rightNode={
            <PasswordVisibilityToggler
              visible={passwordVisible}
              onToggle={onSetPasswordVisibleHandler}
            />
          }
        />
      </div>

      <div className="flex justify-end items-center -mt-6">
        <Checkbox size="md" label="Remember me" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          color="info"
          onClick={onForgotPasswordRouteHandler}
        >
          <span className="underline hover:no-underline text-info-500 !font-medium">
            Forgot password
          </span>
        </Button>
      </div>

      <Button
        type="submit"
        disabled={loginState.isPending}
        loading={loginState.isPending}
      >
        Sign in
      </Button>

      <div className="flex flex-row gap-4">
        <span className="text-sm">Do not have an account?</span>
        <Link href={""} className="underline text-sm text-info-500">
          Register
        </Link>
      </div>
    </form>
  );
}
