import { cn } from "@/app/utils/functions";
import { FC, PropsWithChildren } from "react";

interface PanelProps {
  open: boolean;
  direction?: "left" | "right" | "top" | "bottom";
  className?: string;
}

const Panel: FC<PropsWithChildren<PanelProps>> = ({ 
  open, 
  direction = 'left', 
  className,
  children 
}) => {
  const directionClasses = {
    left: "translate-x-full",
    right: "-translate-x-full",
    top: "translate-y-full",
    bottom: "-translate-y-full",
  };

  return (
    <div
      className={cn(
        "fixed w-full h-full z-[101] bg-[#131313] top-0 left-0 transition-all duration-150 ease-in-out",
        open ? "" : directionClasses[direction],
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Panel;
