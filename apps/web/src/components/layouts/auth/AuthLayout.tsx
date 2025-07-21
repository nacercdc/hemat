"use client";

import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LanguageSelector } from "~/components/ui/language-selector/LanguageSelector";

interface Props {
  children: React.ReactNode;
}

export function AuthLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const isLogin = pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen w-full bg-white px-4 sm:px-6 md:px-10 py-6">
      <div className="flex flex-col lg:flex-row items-start justify-between w-full flex-1 gap-6 mt-10">
        <div
          className="flex justify-center lg:justify-start w-full lg:w-[20%] cursor-pointer"
          onClick={() => router.replace("/home")}
        >
          <Image
            src="/images/acdc-logo.svg"
            width={140}
            height={100}
            className="-mt-4 sm:-mt-6 z-40 object-contain"
            alt="Africa CDC Logo"
          />
        </div>

        <div
          className={`flex justify-center w-full  ${
            isLogin ? "lg:w-[60%]" : ""
          }`}
        >
          <div
            className={`flex flex-col gap-6 w-full ${
              isLogin
                ? "sm:w-[90%] md:w-[70%] lg:w-[70%] xl:w-[50%] 2xl:w-[40%]"
                : ""
            }`}
          >
            <div className="flex flex-col gap-0 text-center lg:text-left">
              <span className="font-bold text-lg sm:text-xl">
                Welcome to Africa CDC
              </span>
              <span className="text-xs sm:text-sm text-basic-600">
                {isLogin
                  ? "Enter your credentials to login to your account"
                  : "Register and let's get started"}
              </span>
            </div>

            <div className="relative pt-8 pb-8 px-6 sm:px-8 bg-white rounded-lg border border-basic-200 flex flex-col gap-6 shadow-sm ">
              <Image
                src="/images/head-board.png"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "10px" }}
                className="rounded-t-lg absolute top-0 inset-x-0 object-cover"
                alt="Africa CDC Headboard"
              />

              {children}

              <Image
                src="/images/branding-texture.png"
                width={80}
                height={60}
                className="absolute bottom-0 right-0 rounded-br-xl z-10"
                alt="Africa CDC Texture"
              />
            </div>
          </div>
        </div>

        <div className="hidden lg:flex justify-end w-full lg:w-[20%]">
          <LanguageSelector />
        </div>
      </div>

      <div className="block lg:hidden mt-4">
        <LanguageSelector />
      </div>

      <div className="mt-6 text-xs text-basic-700 text-center">
        &copy; Africa CDC All Rights Reserved, 2025
      </div>
    </div>
  );
}
