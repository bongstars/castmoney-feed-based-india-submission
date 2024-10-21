
import { cn } from "@/app/utils/functions";
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useRef,
} from "react";

interface ModalProps {
  className?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  className,
  open,
  setOpen,
  children,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const modal = modalRef.current;
    const overlay = overlayRef.current;
    if (!modal || !overlay) return;

    let timer: NodeJS.Timeout;
    if (open) {
      modal.classList.remove("scale-0");
      overlay.classList.remove("scale-0");
    } else {
      timer = setTimeout(() => {
        modal.classList.add("scale-0");
        overlay.classList.add("scale-0");
      }, 200);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [open]);
  return (
    <div
      className="relative z-[1000000]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "inset-0 bg-black bg-opacity-50 backdrop-blur-md transition-opacity fixed",
          open
            ? "ease-out duration-300 opacity-100 "
            : "ease-in duration-200 opacity-0"
        )}
        aria-hidden="true"
        ref={overlayRef}
      />
      <div
        className={cn("inset-0 z-[1000000] w-screen overflow-y-auto fixed")}
        ref={modalRef}
      >
        <div
          className={
            "flex w-full min-h-full justify-center text-center items-center sm:p-0"
          }
          onClick={() => {
            setOpen(false);
          }}
        >
          <div
            className={cn(
              "relative transform overflow-hidden rounded-lg bg-[#171818] text-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6",
              open
                ? "ease-out duration-300 opacity-100 translate-y-0 sm:scale-100"
                : "ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
              className
            )}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
