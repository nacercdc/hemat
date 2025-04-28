import Image from "next/image";
import React from "react";

interface Props {
  children: React.ReactNode;
}
export function AuthLayout({ children }: Props) {
  return (
    <div className="flex relative items-center bg-white w-full min-h-screen flex-col gap-3 justify-center p-4 overflow-x-hidden">
      <Image
        src="/logo-dark.png"
        width={90}
        height={50}
        className="absolute left-24 top-10"
        alt="Vital Work-life"
      />
      <div className="w-[30rem] h-[30rem] rounded-full absolute top-1/2 left-1/2 translate-x-[-20%] translate-y-[-17%] bg-[radial-gradient(circle,theme(colors.primary.600)_0%,transparent_70%)]"></div>

      <div className="w-full min-[500px]:w-[70%] relative sm:max-w-[60%] md:max-w-[45%] lg:max-w-[35%] xl:max-w-[30%] 2xl:max-w-[25%] mx-auto">
        <div className="pt-4 bg-white pb-8 px-8 rounded-[32px] border-secondary border-1 border-t-1 flex flex-col justify-center max-h-max gap-6 shadow-sm shadow-basic-400 relative">
          <div className="w-20 h-16 border-[1.5px] border-t-4 border-b-0 border-r-0 top-0 left-[-1px] absolute rounded-tl-[32px] border-l-primary-900 border-t-primary-900 bg-transparent" />
          {children}
        </div>
      </div>
    </div>
  );
}
