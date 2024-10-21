import { useMemo } from "react";
import { Transaction } from "../utils/types";
import useFeedQuery from "./queries/feed";

const parseResponse = (transactions: Transaction[]) => {
  return transactions.map((tx: Transaction) => ({
    ...tx,
    from_token_image_uri:
      tx.from_token_image_uri && tx.from_token_image_uri.startsWith("https")
        ? tx.from_token_image_uri
        : "",
    to_token_image_uri:
      tx.to_token_image_uri && tx.to_token_image_uri.startsWith("https")
        ? tx.to_token_image_uri
        : "",
  }));
};

const useFeedData = ({
  fids,
  chainId,
  followingFid,
  minAmount,
  tokenAddress,
  authenticated,
  isLiked,
}: {
  fids?: string;
  followingFid?: string;
  minAmount?: string;
  tokenAddress?: string;
  chainId?: string;
  authenticated: boolean;
  isLiked?: boolean;
}) => {
  const { data, ...query } = useFeedQuery<Array<Transaction>>({
    searchParams: {
      fids,
      followingFid,
      minAmount,
      tokenAddress,
      chainId: 8453,
      isLiked: isLiked ? "true" : "false",
    },
    enabled: authenticated,
  });

  const parsedData = useMemo(() => {
    if (!data) return [];
    return parseResponse(data);
  }, [data]);

  return { data: parsedData, ...query };
};

export default useFeedData;
