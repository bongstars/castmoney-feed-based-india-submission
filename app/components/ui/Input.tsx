import { cn } from "@/app/utils/functions";
import {
  ComponentType,
  FC,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  PropsWithChildren,
} from "react";

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  placeholder?: string;
}
interface MessageProps {
  className?: string;
}
interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  placeholder?: string;
  label?: string;
  type?: string;
  InputLabelComponent: ComponentType<InputLabelProps>;
  InputComponent: ComponentType<InputProps>;
  MessageComponent?: ComponentType<PropsWithChildren<MessageProps>>;
  message?: string;
}

const InputLabel: FC<PropsWithChildren<InputLabelProps>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <label className={cn("block text-sm text-white/50", className)} {...props}>
      {children}
    </label>
  );
};

const Input: FC<InputProps> = ({
  type,
  name,
  placeholder,
  className,
  ...props
}) => {
  return (
    <input
      type={type}
      name={name}
      id={name}
      className={cn(
        "block w-full rounded-md bg-[#131313] p-3 text-xs text-white placeholder:text-[#AEAEAE80] outline-none",
        className
      )}
      placeholder={placeholder}
      {...props}
    />
  );
};

const Message: FC<PropsWithChildren<MessageProps>> = ({
  className,
  children,
}) => {
  return <p className={cn("mt-1 text-xs", className)}>{children}</p>;
};

const InputGroup: FC<InputGroupProps> = ({
  name,
  placeholder,
  label,
  type,
  className,
  InputLabelComponent,
  InputComponent,
  MessageComponent,
  message,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <InputLabelComponent htmlFor={name}>{label}</InputLabelComponent>
      )}
      <div className="mt-2">
        <InputComponent
          type={type}
          name={name}
          placeholder={placeholder}
          {...props}
        />
      </div>
      {message && MessageComponent && (
        <MessageComponent>{message}</MessageComponent>
      )}
    </div>
  );
};

export {
  type InputProps,
  type InputLabelProps,
  type InputGroupProps,
  Input,
  InputLabel,
  InputGroup,
  Message,
};
