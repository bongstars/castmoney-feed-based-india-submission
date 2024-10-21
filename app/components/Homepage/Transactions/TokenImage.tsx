import Image from "next/image";
import { FC } from "react";

interface TokenImageProps {
  imageUri?: string;
  symbol: string;
}

export const TokenImage: FC<TokenImageProps> = ({
  imageUri,
  symbol
}) => {
  if (imageUri && imageUri.startsWith("http")) {
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
