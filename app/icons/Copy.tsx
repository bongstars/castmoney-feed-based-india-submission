import { FC } from "react";
import { IconProps } from ".";

export const Copy: FC<IconProps> = ({ width, height, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={0}
      width={width}
      height={height}
      className={className}
    >
      <path d="M4 11C3.63333 11 3.31944 10.8695 3.05833 10.6084C2.79722 10.3473 2.66667 10.0334 2.66667 9.66671V1.66671C2.66667 1.30004 2.79722 0.986152 3.05833 0.725041C3.31944 0.46393 3.63333 0.333374 4 0.333374H10C10.3667 0.333374 10.6806 0.46393 10.9417 0.725041C11.2028 0.986152 11.3333 1.30004 11.3333 1.66671V9.66671C11.3333 10.0334 11.2028 10.3473 10.9417 10.6084C10.6806 10.8695 10.3667 11 10 11H4ZM4 9.66671H10V1.66671H4V9.66671ZM1.33333 13.6667C0.966667 13.6667 0.652778 13.5362 0.391667 13.275C0.130556 13.0139 0 12.7 0 12.3334V3.00004H1.33333V12.3334H8.66667V13.6667H1.33333Z" />
    </svg>
  );
};
