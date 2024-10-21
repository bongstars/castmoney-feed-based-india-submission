import { FC } from "react";
import { IconProps } from ".";

export const FilterOutline: FC<IconProps> = ({ width, height, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M14.667 2H1.333l5.334 6.307v4.36L9.334 14V8.307L14.667 2z"
      />
    </svg>
  );
};
