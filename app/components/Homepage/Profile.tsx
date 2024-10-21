import { Copy } from "@/app/icons";
import { linkify } from "@/app/utils/functions";
import { User } from "@privy-io/react-auth"
import Image from "next/image";
import { FC } from "react";
import toast from "react-hot-toast";

// This is a mobile component for the profile tab
interface ProfileProps {
  user: User | null;
  logout: () => void;
}

export const Profile: FC<ProfileProps> = ({
  user,
  logout
}) => {
  const pfp = user?.farcaster?.pfp;
  const username = user?.farcaster?.username;
  const fid = user?.farcaster?.fid;
  const bio = user?.farcaster?.bio;
  return (
    user ? (
      <div className="bg-[#171818] pt-7 px-5 pb-2">
        <div className="flex items-center justify-between mb-2">
          <Image
            src={pfp ?? "/placeholder-pfp.svg"}
            alt="pfp"
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover"
          />
          <button 
            className="px-9 py-2 bg-[#E0ED64] rounded-md text-[#101114] font-semibold text-xs"
            onClick={logout}
          >
            log out
          </button>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <p className="text-sm text-[#F9F8FD] font-semibold text-nowrap">
              {username}
            </p>
            <button 
              onClick={() => {
                const address = user.farcaster?.ownerAddress
                if (!address) return;
                navigator.clipboard.writeText(address);
                toast.success('Address successfully copied!', {
                  position: 'bottom-right',
                  style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                  },
                });
              }}
            >
              <Copy 
                width={12}
                height={12}
                className="fill-white opacity-60"
              />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#E5E5E5] text-xs">fid</span>
            <span className="text-white text-sm font-medium">{fid}</span>
          </div>
        </div>
        <p
          className="text-sm text-white"
          dangerouslySetInnerHTML={{ __html: linkify(bio ?? "") }}
        />
      </div>
    ) : (
      <></>
    )
  )
}