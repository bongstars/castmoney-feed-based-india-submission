import { cn } from "@/app/utils/functions";
import { FC } from "react";

export const Spinner: FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div
      className={cn(
        "w-8 h-8 border-2 rounded-full border-t-black animate-spin",
        className
      )}
    />
  );
};
