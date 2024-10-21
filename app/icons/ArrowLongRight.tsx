import { FC } from "react"
import { IconProps } from "."

export const ArrowLongRight: FC<IconProps> = ({
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
      height={height}
      width={width}
      className={className}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" 
      />
    </svg>
  )
}
