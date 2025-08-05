"use client";

import React from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";

export function FooterSection() {
  return (
    <div className="flex flex-col gap-11 w-full px-10 2xl:px-48 py-12 bg-[#273E35]">
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-11 items-center ">
        <div className="flex flex-col gap-4">
          <Image
            src="/images/acdc-logo-white.svg"
            alt="logo"
            width={100}
            height={50}
            className="w-48 h-28 -ml-2"
          />
          <div className="flex items-center gap-2">
            <input
              name="email"
              placeholder="Enter your email here"
              className="border-none outline-none focus:outline-none rounded-md bg-[#FFFFFF21] focus:bg-[#FFFFFF21] px-4 py-2.5 max-w-80 w-full text-white"
            />
            <button className="outline-none border-none">
              <div className="w-12 h-12 rounded-full bg-[#348F41] flex justify-center items-center">
                <Icon icon="mynaui:send" className="!w-6 !h-6 text-white" />
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-white">
          <h3 className="text-2xl font-bold">Quick Links</h3>
          <a href="#map" className="text-sm font-bold hover:underline">
            Map
          </a>
          <a href="#partners" className="text-sm font-bold hover:underline">
            Partners
          </a>
          <a
            href="#assessment_tools"
            className="text-sm font-bold hover:underline"
          >
            Assessment Tools
          </a>
        </div>

        <div className="flex flex-col gap-4 lg:items-end text-white items-start">
          <h3 className="text-2xl font-bold">Contact us</h3>
          <span className="text-sm font-bold">Phone: +251911111111</span>
          <div className="flex flex-col lg:items-end items-start">
            <span className="text-sm font-bold">Tel: +251911111111</span>
            <a
              href="https://communications@africacdc.org"
              target="_blank"
              className="text-sm font-bold underline"
            >
              communications@africacdc.org
            </a>
            <span className="text-sm font-bold text-end text-nowrap">
              Visit Africa CDC on the{" "}
              <a
                href="https://au.int/africacdc"
                target="_blank"
                className="underline"
              >
                African Union Website
              </a>
            </span>
          </div>
        </div>
      </div>

      <div className="h-0.5 bg-[#FFFFFF1F] w-full"></div>

      <div className="flex justify-between">
        <span className="text-[#FFFFFFAD] text-sm">
          Copyright &copy; 2025, Africa CDC. All rights reserved
        </span>
        <div className="flex gap-2 items-center">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFFFFF1A]">
            <Icon icon="ic:outline-facebook" className="w-6 h-6 text-white" />
          </button>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFFFFF1A]">
            <Icon icon="uil:linkedin" className="w-5 h-5 text-white" />
          </button>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFFFFF1A]">
            <Icon icon="hugeicons:new-twitter" className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
