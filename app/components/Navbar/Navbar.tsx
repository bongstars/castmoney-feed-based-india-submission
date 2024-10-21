import { User } from "@privy-io/react-auth";
import { DesktopNav } from "./DesktopNav"
import { FC } from "react";
import { useDeviceType } from "@/app/hooks/useDeviceType";
import { MobileNav } from "./MobileNav";

interface NavbarProps {
  className?: string;
  authenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
  mobileTab: string;
  setMobileTab: (tab: string) => void;
}

export const Navbar: FC<NavbarProps> = ({
  authenticated,
  login,
  logout,
  user,
  className,
  mobileTab,
  setMobileTab
}) => {
  const deviceType = useDeviceType();
  const isDesktop = deviceType === 'desktop';
  return (
    isDesktop ? (
      <DesktopNav 
        authenticated={authenticated}
        login={login}
        logout={logout}
        user={user}
        className={className}
      />
    ) : (
      <MobileNav 
        authenticated={authenticated}
        login={login}
        logout={logout}
        user={user}
        className={className}
        mobileTab={mobileTab}
        setMobileTab={setMobileTab}
      />
    )
  )
}
