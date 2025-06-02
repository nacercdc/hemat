import Image from "next/image";
import React from "react";

interface Props {
  children: React.ReactNode;
}
export function AuthLayout({ children }: Props) {
  return (
    <div className="flex relative items-center bg-white w-full min-h-screen flex-col gap-3 justify-center p-4 overflow-x-hidden">
      <Image
        src="/images/acdc-logo.png"
        width={90}
        height={50}
        className="absolute left-24 top-10"
        alt="ACDC Logo"
      />


      <div className="w-full min-[500px]:w-[80%] relative sm:max-w-[60%] md:max-w-[45%] lg:max-w-[35%] xl:max-w-[30%] 2xl:max-w-[25%] mx-auto">
        <Image
          src="/images/auth-form-top.png"
          width={1925}
          height={10}
          className="absolute left-0 top-0 rounded-t-[8px]"
          alt="ACDC Branding texture Image "
        />
        <div className="pt-4 bg-white pb-8 px-8 rounded-[8px] border-secondary border-1 border-t-1 flex flex-col justify-center max-h-max gap-6 shadow-sm shadow-basic-400 relative">
          {children}
        </div>
      </div>
    </div>
  );
}
