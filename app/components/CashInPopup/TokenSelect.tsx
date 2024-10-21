import { FC, useCallback, useMemo, useState } from "react";
import { TabButton, Tabs } from "../ui/Tabs";
import { motion } from "framer-motion";
import { Dropdown, DropdownContainer, DropdownTrigger } from "../ui/Dropdown";
import { cn } from "@/app/utils/functions";
import { ChevronUpDown } from "@/app/icons";
import Image from "next/image";

interface TokenSelectProps {
  className?: string;
  tokens: {
    name: string;
    address: string;
    image: string;
  }[];
  currentToken: string;
  setCurrentToken: (token: string) => void;
}

export const TokenSelect: FC<TokenSelectProps> = ({
  className,
  currentToken,
  setCurrentToken,
  tokens,
}) => {
  const [open, setOpen] = useState(false);
  const tabs = useMemo(
    () =>
      tokens.map((token) => ({
        label: token.name,
        address: token.address,
        image: token.image,
      })),
    [tokens],
  );
  const isOpen = open && tabs.length > 1;
  const renderTokenImage = (imageUri: string, symbol: string) => {
    if (imageUri) {
      return (
        <Image
          src={imageUri}
          alt={symbol || "Token"}
          width={20}
          height={20}
          className="w-5 h-5 rounded-full"
        />
      );
    } else {
      return (
        <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold">
          {symbol ? symbol.charAt(0).toUpperCase() : "?"}
        </div>
      );
    }
  };
  const renderTab = useCallback(
    ({
      selected,
      label,
      image,
      onSelect,
    }: {
      selected: boolean;
      image: string;
      label: string;
      onSelect?: () => void;
    }) => {
      return (
        <TabButton
          className="transition-all duration-200 ease-in-out px-4 py-3 hover:bg-castmoney-container-primary rounded-lg w-full text-left flex items-center"
          onSelect={onSelect}
        >
          {renderTokenImage(image, label)}
          <span className="text-white text-xs">{label}</span>
          {selected && (
            <motion.div
              layoutId="big-moves-filters-highlight"
              className="absolute left-0 top-0 w-full h-full z-[1] bg-white/10 rounded-lg"
            />
          )}
        </TabButton>
      );
    },
    [],
  );

  return (
    <DropdownContainer className={cn("text-white text-xs", className)}>
      <DropdownTrigger
        dropdownKey="big-moves-filters-dropdown"
        setOpen={setOpen}
        className="flex items-center space-x-1 pl-1 py-1 pr-2 rounded-3xl border-[1px] border-[#343433]"
      >
        {renderTokenImage(
          tabs.find((token) => token.label === currentToken)?.image || "",
          currentToken,
        )}
        <span className="text-white text-xs">{currentToken}</span>
        {tabs.length > 1 && (
          <ChevronUpDown width={16} height={16} className="stroke-white" />
        )}
      </DropdownTrigger>
      <Dropdown
        dropdownKey="big-moves-filters-dropdown"
        setOpen={setOpen}
        open={isOpen}
        initial={false}
        animate={{
          bottom: isOpen ? -8 : 0,
        }}
        transition={{
          top: { duration: 1, type: "spring", bounce: 0.2 },
        }}
        style={{ willChange: "transform" }}
        className={cn(
          "left-0 w-[190px] translate-y-full transition-opacity right-1/2 -translate-x-1/2",
          isOpen ? "z-[26] opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <Tabs
          tabs={tabs}
          selectedTabLabel={currentToken}
          className="flex flex-col items-start space-y-3 max-h-[100px] overflow-y-scroll"
          onSelect={setCurrentToken}
          Tab={renderTab}
        />
      </Dropdown>
    </DropdownContainer>
  );
};
