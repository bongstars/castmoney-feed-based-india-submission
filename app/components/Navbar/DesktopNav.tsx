import { cn } from "@/app/utils/functions";
import { User } from "@privy-io/react-auth";
import Image from "next/image";
import { FC } from "react";
import { ProfileButton } from "./ProfileButton";
import { SignInButton } from "./SignInButton";

interface DesktopNavProps {
  className?: string;
  authenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
}

export const DesktopNav: FC<DesktopNavProps> = ({
  className,
  authenticated,
  user,
  login,
  logout
}) => {
  return (
    <div 
      className={cn(
        "fixed top-0 left-1/2 w-full max-w-[1440px] -translate-x-1/2 z-[3] flex items-center justify-between p-4",
        className
      )}>
      <Image
        src="/app-logo.svg"
        alt="logo"
        width={144}
        height={23}
        className="w-[144px] h-[23px]"
      />
      {authenticated && user?.farcaster ? (
        <ProfileButton
          signOut={logout}
          bio={user.farcaster.bio}
          displayName={user.farcaster.displayName}
          fid={user.farcaster.fid}
          pfp={user.farcaster.pfp}
          username={user.farcaster.username}
          address={user?.wallet?.address}
        />
      ) : (
        <SignInButton signIn={login} />
      )}
    </div>
  )
}
