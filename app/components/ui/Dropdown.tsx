import {
  ButtonHTMLAttributes,
  Dispatch,
  FC,
  HTMLAttributes,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/app/utils/functions";

interface DropdownProps extends MotionProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
  dropdownKey: string;
}

interface DropdownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  setOpen: Dispatch<SetStateAction<boolean>>;
  dropdownKey: string;
  className?: string;
}

interface DropdownContainerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Dropdown: FC<PropsWithChildren<DropdownProps>> = ({
  open,
  setOpen,
  className,
  dropdownKey,
  children,
  initial = { opacity: 0 },
  animate = { opacity: open ? 1 : 0 },
  // transition = { duration: 1, type: "spring", bounce: 0.8 },
  ...motionProps
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !target.closest(`[data-dropdown-key="${dropdownKey}"]`)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setOpen, dropdownKey]);

  return (
    <motion.div
      ref={dropdownRef}
      initial={initial}
      animate={animate}
      className={cn(
        "bg-[#171818] rounded-md border-[1px] border-[#1B1C21] shadow-dropdown absolute",
        className
      )}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

const DropdownTrigger: FC<PropsWithChildren<DropdownTriggerProps>> = ({
  setOpen,
  dropdownKey,
  className,
  children,
  ...rest
}) => {
  return (
    <button
      data-dropdown-key={dropdownKey}
      onClick={() => setOpen((prev) => !prev)}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
};

const DropdownContainer: FC<PropsWithChildren<DropdownContainerProps>> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <div className={cn("relative", className)} {...rest}>
      {children}
    </div>
  );
};

export { Dropdown, DropdownTrigger, DropdownContainer };
