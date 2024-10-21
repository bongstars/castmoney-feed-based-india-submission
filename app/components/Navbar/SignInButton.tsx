import Image from "next/image"
import { FC } from "react";

interface SignInButtonProps {
  signIn: () => void;
}

export const MobileSignInButton: FC<SignInButtonProps> = ({ signIn }) => {
  return (
    <button
      onClick={signIn}
      className="flex items-center bg-white rounded-full text-sm leading-5 font-semibold text-[#8a63d2] justify-center p-1"
    >
      <Image 
        className="w-4 h-4"
        width={16}
        height={16}
        alt=""
        src="/fc-logo.svg"
      />
    </button>
  )
}

export const SignInButton: FC<SignInButtonProps> = ({ signIn }) => {
  return (
    <button
      onClick={signIn}
      className="flex items-center bg-white rounded-full text-sm leading-5 font-semibold text-[#8a63d2] gap-3 p-[15px]"
    >
      <Image 
        className="w-4 h-4"
        width={16}
        height={16}
        alt=""
        src="/fc-logo.svg"
      />
      <span className="block">
        Sign in with Farcaster
      </span>
    </button>
  )
}
