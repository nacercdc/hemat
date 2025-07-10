import React from "react";
import Image from "next/image";
import { Button } from "@etm/web-ui-components";

export function NavBar() {
  return (
    <div
      className="flex items-center justify-between w-full h-[130px] text-white px-20"
      style={{ backgroundColor: "#273E35" }}
    >
      <Image
        src="images/acdc-logo-white.svg"
        alt="Logo"
        width={200}
        height={100}
      />
      <div className="flex gap-4">
        <Button variant="ghost" color="light" size="lg">
          <span className="font-bold">Sign In</span>
        </Button>
        <Button variant="outline" color="light" size="lg">
          <span className="font-bold">Register</span>
        </Button>
      </div>
    </div>
  );
}
