import { User } from "@privy-io/react-auth";
import { ComponentType, FC, useCallback } from "react";
import { TabButton, Tabs } from "../ui/Tabs";
import { cn } from "@/app/utils/functions";
import { Bell, HomeSolid, MagnifyingGlass, Wallet } from "@/app/icons";
import { MobileProfileButton } from "./ProfileButton";
import { MobileSignInButton } from "./SignInButton";

interface MobileNavProps {
  className?: string;
  authenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
  mobileTab: string;
  setMobileTab: (tab: string) => void;
}

interface NavTabProps {
  className?: string;
}

export const MobileNav: FC<MobileNavProps> = ({
  authenticated,
  user,
  logout,
  login,
  mobileTab,
  setMobileTab
}) => {
  const tabs = [
    { label: "home", TabComponent: () => <HomeSolid width={16} height={16} /> },
    { label: "search", disabled: true, TabComponent: () => <MagnifyingGlass width={16} height={16} /> },
    { label: "notifications", disabled: true, TabComponent: () => <Bell width={16} height={16} className="stroke-white fill-none" /> },
    { label: "wallet", TabComponent: () => <Wallet width={16} height={16} className="stroke-white fill-none" /> },
    { 
      label: "profile", 
      TabComponent: () => {
        if (authenticated && user?.farcaster) {
          return (
            <MobileProfileButton 
              signOut={logout}
              bio={user.farcaster.bio}
              displayName={user.farcaster.displayName}
              fid={user.farcaster.fid}
              pfp={user.farcaster.pfp}
              username={user.farcaster.username}
              address={user?.wallet?.address}
            />
          )
        } else {
          return (
            <MobileSignInButton signIn={login} />
          )
        }
      }
    },
  ];
  
  const renderTab = useCallback(
    ({
      selected,
      label,
      TabComponent,
      disabled,
      onSelect,
    }: {
      selected: boolean;
      label: string;
      TabComponent: ComponentType<NavTabProps>;
      disabled?: boolean;
      onSelect?: () => void;
    }) => {
      return (
        <TabButton
          className={cn(
            "transition-all duration-200 ease-in-out fill-white",
            label !== 'profile' ? selected ? "opacity-100" : "opacity-40 hover:opacity-60" : "",
            disabled && "opacity-10"
          )}
          onSelect={() => {
            if (disabled || !onSelect) return;
            onSelect();
          }}
        >
          <TabComponent />
        </TabButton>
      );
    },
    []
  );
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#131313] px-8 py-3 border-[1px] border-[#343433] z-[102]">
      <Tabs
        tabs={tabs}
        selectedTabLabel={mobileTab}
        className="flex items-center justify-between"
        onSelect={setMobileTab}
        Tab={renderTab}
      />
    </div>
  )
}
