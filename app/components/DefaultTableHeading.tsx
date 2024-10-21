import { FC } from "react";
import { cn } from "@/app/utils/functions";
import { TableHeading, TableHeadingProps, TH } from "./ui/Table";

type HeadingContentProps = TableHeadingProps<TableHeading> & {
  className?: string;
};

export const DefaultTableHeading: FC<HeadingContentProps> = ({
  label,
  className,
}) => {
  return (
    <TH
      className={cn(
        "py-3 px-3 text-xs font-normal text-[#FFFFFF] bg-[#131313] text-opacity-80 text-left",
        className
      )}
    >
      {label}
    </TH>
  );
};
