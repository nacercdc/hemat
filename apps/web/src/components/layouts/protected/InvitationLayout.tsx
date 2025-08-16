"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export function InvitationLayout({ children }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen w-full bg-white px-4 sm:px-6 md:px-10 py-6 overflow-y-auto">
      <div className="flex flex-col lg:flex-row items-center justify-center w-full flex-1 gap-6 mt-10">
        <div className="flex flex-col items-center relative pt-16 pb-8 px-6 sm:px-8 gap-6 w-full sm:w-[65%] md:w-[45%] lg:w-[45%] xl:w-[30%] 2xl:w-[25%] rounded-lg border border-basic-200 shadow-sm">
          <div
            className="flex justify-center  w-full lg:w-[20%] cursor-pointer"
            onClick={() => router.replace("/")}
          >
            <Image
              src="/images/acdc-logo.svg"
              width={140}
              height={100}
              className="-mt-4 sm:-mt-6 z-40 object-contain"
              alt="Africa CDC Logo"
            />
          </div>
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

      <div className="mt-6 text-xs text-basic-700 text-center">
        &copy; Africa CDC All Rights Reserved, 2025
      </div>
    </div>
  );
}
