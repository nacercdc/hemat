import Image from "next/image";
import React from "react";
import { LanguageSelector } from "~/components/ui/language-selector/LanguageSelector";

interface Props {
  children: React.ReactNode;
}
export function AuthLayout({ children }: Props) {
  return (
    <div className="flex flex-col w-full h-screen justify-between gap-6 bg-white items-center pb-5 pt-14 z-0 px-10">
      <div className="flex items-start w-full gap-3 z-0">
        <Image
          src="/images/acdc-logo.png"
          width={140}
          height={100}
          className="-mt-6 z-40"
          alt="Africa CDC Logo"
        />

        <div className="flex flex-col gap-10 w-full min-[500px]:w-[70%] sm:max-w-[60%] md:max-w-[45%] lg:max-w-[35%] xl:max-w-[30%] 2xl:max-w-[25%] mx-auto">
          <div className="flex flex-col gap-0">
            <span className="font-bold">Welcome to Africa CDC</span>
            <span className="text-xs text-basic-600">
              Enter your credentials to login to your account
            </span>
          </div>
          <div className="pt-8 bg-white pb-8 px-8 rounded-lg border-basic-200 border flex flex-col justify-center max-h-max gap-6 relative">
            <Image
              src="/images/head-board.png"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "10px" }}
              className="rounded-t-lg absolute top-0 inset-x-0 object-cover"
              alt="Africa CDC Logo"
            />
            {children}
            <Image
              src="/images/branding-texture.png"
              width={80}
              height={60}
              className="absolute bottom-0 right-0 rounded-br-xl"
              alt="Africa CDC Logo"
            />
          </div>
        </div>
        <LanguageSelector />
      </div>
      <span className="text-xs text-basic-700">
        &copy;{` Africa CDC All Right Reserved, 2025`}
      </span>
    </div>
  );
}
