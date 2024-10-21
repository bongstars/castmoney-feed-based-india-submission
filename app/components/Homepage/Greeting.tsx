import { useDeviceType } from "@/app/hooks/useDeviceType";
import { ChartBarOutline, ChartBartFill, TrophyFill, TrophyOutline } from "@/app/icons";
import { cn } from "@/app/utils/functions";
import { User } from "@privy-io/react-auth"
import Image from "next/image";
import { Dispatch, FC, SetStateAction } from "react";

interface GreetingProps {
  user: User | null;
  className?: string;
  currentComponentTab?: string;
  setShowSubPage?: Dispatch<SetStateAction<boolean>>;
  showSubPage?: boolean;
}

export const Greeting: FC<GreetingProps> = ({
  user,
  className,
  currentComponentTab,
  setShowSubPage,
  showSubPage
}) => {
  const deviceType = useDeviceType();
  const isDekstop = deviceType === 'desktop';
  return (
    <div 
      className={cn(
        "w-full",
        !isDekstop && "flex items-center justify-between",
        className
      )}
    >
      <div 
        className={cn(
          "flex items-center",
          !isDekstop && "space-x-3"
        )}
      >
        {!isDekstop && 
          <Image 
            src={user?.farcaster?.pfp ?? "/placeholder-pfp.svg"}
            alt="pfp"
            width={24}
            height={24}
            className="w-6 h-6 rounded-full relative -bottom-1 shrink-0"
          />
        }
        <h1 className="text-4xl font-medium italic">
          gm {user?.farcaster?.username}
        </h1>
      </div>
      <button
        onClick={() => {
          if (!setShowSubPage) return;
          setShowSubPage(prev => !prev);
        }}
      >
        {currentComponentTab === 'hottest tokens' && 
          (showSubPage ? (
            <ChartBartFill
              width={24}
              height={24}
              className="fill-white"
            />
          ) : (
            <ChartBarOutline 
              width={24}
              height={24}
              className="stroke-white opacity-70"
            />
          ))
        }
        {currentComponentTab === 'leaderboard' && 
          (showSubPage ? (
            <TrophyFill 
              width={24}
              height={24}
              className="fill-white"
            />
          ) : (
            <TrophyOutline
              width={24}
              height={24}
              className="stroke-white opacity-70"
            />
          ))
        }
      </button>
    </div>
  )
}