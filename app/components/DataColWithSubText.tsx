import { FC } from "react";
import { cn } from "../utils/functions"
import { TD } from "./ui/Table";

interface DataColWithSubTextProps {
  className?: string;
  subTextClassName?: string;
  value: string;
  subText?: string;
}

export const DataColWithSubText: FC<DataColWithSubTextProps> = ({
  value,
  className,
  subText,
  subTextClassName
}) => {
  return (
    <TD
      className={cn(
        "py-2 px-3 text-left text-white text-sm",
        className,
      )}
    >
      <div 
        className={cn(
          "flex flex-col",
          subText && "gap-2"
        )}
      >
        <span className={cn(!subText && "self-start")}>{value}</span>
        <span 
          className={cn(
            "text-white text-xs opacity-60",
            !subText && "invisible",
            subTextClassName
          )}
        >
          {subText}
        </span>
      </div>
    </TD>
  )
}
