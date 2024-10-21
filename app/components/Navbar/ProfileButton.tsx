import Image from "next/image"
import toast from "react-hot-toast";
import { Dropdown, DropdownContainer, DropdownTrigger } from "../ui/Dropdown";
import { ChevronDown, Copy } from "@/app/icons";
import { cn, formatAddress, linkify } from "@/app/utils/functions";
import { FC, useState } from "react";

interface ProfileButtonProps {
  pfp: string | null;
  displayName: string | null;
  fid: number | null;
  username: string | null;
  bio: string | null;
  signOut: () => void;
  className?: string;
  address?: string;
}

export const MobileProfileButton: FC<ProfileButtonProps> = ({
  pfp
}) => {
  return (
    <Image 
      src={pfp ?? "/placeholder-pfp.svg"}
      alt="pfp"
      width={24}
      height={24}
      className="w-6 h-6 rounded-full"
    />
  )
}

export const ProfileButton: FC<ProfileButtonProps> = ({
  signOut,
  className,
  pfp,
  bio,
  displayName,
  fid,
  username,
  address
}) => {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  return (
    <DropdownContainer className={className}>
      <DropdownTrigger
        dropdownKey="profile-dropdown"
        setOpen={setDropDownOpen}
        className="flex items-center space-x-2 p-1.5 bg-[#131313] rounded-3xl"
      >
        <Image
          src={pfp ?? "/placeholder-pfp.svg"}
          alt="pfp"
          width={24}
          height={24}
          className="w-6 h-6 rounded-full"
        />
        <ChevronDown 
          width={12}
          height={12}
          className="stroke-[#9D9898]"
        />
      </DropdownTrigger>
      <Dropdown
        dropdownKey="profile-dropdown"
        setOpen={setDropDownOpen}
        open={dropDownOpen}
        initial={false}
        animate={{
          bottom: dropDownOpen ? -8 : 0,
          zIndex: dropDownOpen ? 26 : 20,
        }}
        transition={{
          bottom: { duration: 1, type: "spring", bounce: 0.6 },
          zIndex: { delay: 0.1 },
        }}
        style={{ willChange: "transform" }}
        className={cn(
          "right-0 px-4 py-3 bg-[#171818] text-white translate-y-full rounded-md border-[1px] transition-opacity min-w-[240px]",
          dropDownOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="m-2">
          <div className="flex items-center space-x-2">
            {displayName && (
              <p className="font-medium text-castmoney-brand text-nowrap">
                {displayName}
              </p>
            )}
            {fid && (
              <p className="text-xs opacity-80 text-castmoney-brand text-nowrap">
                #{fid}
              </p>
            )}
          </div>
          {username && (
            <p className="text-sm opacity-80 text-castmoney-brand mb-4 text-nowrap">
              @{username}
            </p>
          )}
          {address && (
            <div className="flex items-center space-x-2 mb-4">
              <p className="text-sm opacity-80 text-castmoney-brand text-nowrap">
                {formatAddress(address as `0x${string}`)}
              </p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(address);
                  toast.success('Address successfully copied!', {
                    position: 'bottom-right',
                    style: {
                      borderRadius: '10px',
                      background: '#333',
                      color: '#fff',
                    },
                  })
                }}
              >
                <Copy
                  width={10}
                  height={10}
                  className="fill-[#E8EAED]"
                />
              </button>
            </div>
          )}
          {bio && (
            <p
              className="text-sm text-castmoney-brand text-opacity-80 mb-4"
              dangerouslySetInnerHTML={{ __html: linkify(bio) }}
            ></p>
          )}
        </div>
        <button
          onClick={signOut}
          className="w-full bg-white text-black py-2 text-sm font-medium rounded-md"
        >
          Sign Out
        </button>
      </Dropdown>
    </DropdownContainer>
  )
}
