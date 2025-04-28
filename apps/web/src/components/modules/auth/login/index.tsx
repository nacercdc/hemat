"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, InputRHF } from "@etm/web-ui-components";
import PasswordVisibilityToggler from "../../components/PasswordVisibilityToggler";
import { Icon } from "@iconify/react/dist/iconify.js";

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

  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onForgotPasswordRouteHandler = () => {
    router.push("/forgot-password");
  };

  const onSetPasswordVisibleHandler = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onLoginHandler = (_values: LoginFormInputs) => {
    //TODO: handle login
    router.push("/");
  };

  return (
    <div className="flex flex-col gap-10 h-full min-[1925px]:gap-10">
      <div className="flex flex-col">
        <div className="text-2xl font-bold text-secondary">Sign In</div>
        <div className="text-xs text-dark-light">To Vital Work Life</div>
      </div>
      <form
        onSubmit={handleSubmit(onLoginHandler)}
        className="flex flex-col gap-4"
      >
        <InputRHF
          type="email"
          label="Email"
          placeholder="Enter email"
          size="lg"
          control={control}
          name="email"
        />
        <InputRHF
          control={control}
          name="password"
          label="Password"
          placeholder="Enter password"
          size="lg"
          type={passwordVisible ? "text" : "password"}
          rightNode={
            <PasswordVisibilityToggler
              visible={passwordVisible}
              onToggle={onSetPasswordVisibleHandler}
            />
          }
        />

        <div className="flex justify-end items-center">
          <Button
            type="button"
            variant="link"
            size="sm"
            color="info"
            onClick={onForgotPasswordRouteHandler}
          >
            Forgot password?
          </Button>
        </div>
        <Button
          type="submit"
          children={
            <div className="flex items-center ">
              <span className="text-base text-card font-[500] ml-2">Login</span>
            </div>
          }
          size="lg"
          disabled={isSubmitting}
          loading={isSubmitting}
          color="authButtons"
        />
        <fieldset className="border-t border-basic-300">
          <legend className="mx-auto px-4 text-foreground text-xs">
            Or Sign in with
          </legend>
        </fieldset>

        <Button
          variant="outline"
          size="lg"
          leftNode={<Icon icon="logos:microsoft-icon" className="w-6" />}
        >
          Sign in with Microsoft
        </Button>
      </form>
    </div>
  );
}
