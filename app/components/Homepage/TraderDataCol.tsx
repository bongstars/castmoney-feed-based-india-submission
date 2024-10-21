// import { TD } from "@/components/ui/Table";
// import { FC, useCallback, useState } from "react";
// import { TradeAvatar } from "./TradeAvatar";
// import { cn, formatAddress, isAddress } from "@/utils";
// import { ProfileTooltip } from "../ProfileTooltip";
// import {
//   ActionData,
//   FilterUser,
//   SelectAction,
//   ToggleFilter,
// } from "@/context/CastMoneyContext";
// import { UserFilterButton } from "../UserFilterButton";

import { FC } from "react";
import { TD } from "../ui/Table";
import { cn } from "@/app/utils/functions";
import Image from "next/image";

interface TraderDataColProps {
  profileImage: string;
  name: string;
  className?: string;
  fid?: number;
  address?: string;
}

export const TraderDataCol: FC<TraderDataColProps> = ({
  profileImage,
  name,
  className,
  // fid,
  // address,
}) => {
  return (
    <TD
      className={cn(
        "py-2 px-3",
        className
      )}
    >
      <div className="flex items-center justify-start gap-2">
        <Image
          width={24}
          height={24}
          alt=""
          src={profileImage ?? "/placeholder-pfp.svg"}
          className="w-6 h-6 rounded-full object-cover"
        />
        <span className="text-white text-xs font-semibold">{name}</span>
      </div>
    </TD>
  );
};
