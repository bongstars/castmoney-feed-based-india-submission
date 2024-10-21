import { FC, PropsWithChildren } from "react"
import { cn } from "../utils/functions"
import { Navbar } from "./Navbar";
import { usePrivy } from "@privy-io/react-auth";
import { useDeviceType } from "../hooks/useDeviceType";

interface LayoutProps {
  className?: string;
  mobileTab: string;
  setMobileTab: (tab: string) => void;
}

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  mobileTab,
  setMobileTab
}) => {
  const { authenticated, login, user, logout } = usePrivy();
  const deviceType = useDeviceType();
  const isDesktop = deviceType === 'desktop';
  return (
    <div className="min-h-screen bg-[#131313] py-8 text-white relative font-work-sans">
      <div
        className="fixed top-0 left-0 w-full h-[98px] z-[1]"
        style={{
          background: "linear-gradient(180deg, #20211C 0%, #131313 100%)",
        }}
      />
      <Navbar 
        authenticated={authenticated}
        login={login}
        user={user}
        logout={logout}
        mobileTab={mobileTab}
        setMobileTab={setMobileTab}
        // className={cn(
        //   isDesktop && "max-w-[1140px] w-full"
        // )}
      />
      <div 
        className={cn(
          "container relative mx-auto px-4 max-w-[1440px]", 
          isDesktop && "mt-20 max-h-[calc(100vh-240px)]",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
