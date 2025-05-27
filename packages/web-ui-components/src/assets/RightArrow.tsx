import type { SVGProps } from "react";

export const RightArrow = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      viewBox="0 0 7 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 2.63398C6.66667 3.01888 6.66667 3.98113 6 4.36603L2.25 6.53109C1.58333 6.91599 0.75 6.43486 0.75 5.66506L0.75 1.33494C0.75 0.565135 1.58333 0.084011 2.25 0.468911L6 2.63398Z" />
    </svg>
  );
};
