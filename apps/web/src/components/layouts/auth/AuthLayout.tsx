import React from "react";
import Image from "next/image";
import { BrandOverlay } from "~/utils/svg";
import FooterNote from "../components/FooterNote";

interface Props {
  children: React.ReactNode;
}

export function AuthLayout({ children }: Props) {
  return (
    <div className="flex items-center bg-background w-full min-h-screen flex-col gap-3 justify-center p-4 overflow-x-hidden">
      <div className="flex flex-col py-5 gap-4 rounded-3xl backdrop-blur-xl items-center w-full min-[500px]:w-[70%] sm:max-w-[60%] md:max-w-[45%] lg:max-w-[35%] xl:max-w-[30%] 2xl:max-w-[25%] mx-auto">
        <div className="flex flex-col self-start items-start justify-center font-semibold text-secondary mb-2 ml-4">
          <div className="text-sm">Welcome to</div>
          <div className="relative">
            <BrandOverlay
              className="absolute -bottom-7 -right-10"
              width={60}
              height={60}
              viewBox="0 0 50 57"
            />
            <Image
              src="/brand_svg.svg"
              width={195}
              height={195}
              alt="Brand logo"
            />
            <BrandOverlay
              className="absolute -bottom-7 -left-11 transform scale-x-[-1]"
              width={60}
              height={60}
              viewBox="0 0 50 57"
            />
          </div>
        </div>
        <div className="rounded-3xl sm:relative backdrop-blur-3xl w-full h-full">
          <div className="pt-4 pb-8 px-8 bg-card backdrop-filter backdrop-blur-3xl rounded-[36px] flex flex-col justify-center max-h-max gap-6 shadow-md shadow-basic-300 sm:relative sm:z-10 w-full">
            {children}
          </div>
          <Image
            src="/brand_pattern.svg"
            width={120}
            height={95}
            alt="Brand pattern"
            className="absolute bottom-2 -right-28 max-sm:hidden"
          />
        </div>
      </div>
      <FooterNote />
    </div>
  );
}
