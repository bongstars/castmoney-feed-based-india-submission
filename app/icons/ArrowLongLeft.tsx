import { FC } from "react";
import { IconProps } from ".";

export const ArrowLongLeft: FC<IconProps> = ({
  height,
  width,
  className
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      width={width}
      height={height}
      className={className}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" 
      />
    </svg>
  )
}