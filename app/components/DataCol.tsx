import { FC } from "react";
import { TD } from "./ui/Table";
import { cn } from "@/app/utils/functions";

interface DataColProps {
  value: string;
  className?: string;
  // type?: "gain" | "loss";
}

export const DataCol: FC<DataColProps> = ({ value, className }) => {
  return (
    <TD
      className={cn(
        "py-2 px-3 text-left",
        className,
        // type === "loss" && "text-[#FC9D9D]",
        // type === "gain" && "text-[#F3FCA5]",
        // !type && "text-white"
      )}
    >
      <span className="text-sm">{value}</span>
    </TD>
  );
};
