import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchV1 } from "@/app/utils/functions";

export const transactionsQueryKey = (searchParams: string) => [
  "feed",
  searchParams,
];

const useFeedQuery = <R extends { global_counter: string }[]>({
  searchParams,
  enabled,
}: {
  searchParams: Record<string, string | boolean | number | undefined>;
  enabled: boolean;
}) => {
  const searchParamsString = useMemo(() => {
    const filteredSearchParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== undefined),
    );
    return new URLSearchParams(
      filteredSearchParams as Record<string, string>,
    ).toString();
  }, [searchParams]);

  const { data, ...query } = useInfiniteQuery<R>({
    queryKey: transactionsQueryKey(searchParamsString),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchV1(
        `/api/transactions?page=${pageParam}&${searchParamsString}&limit=20`,
      );
      return response as R;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: enabled,
  });

  const flattenedData = useMemo(() => {
    if (!data) return [];
    const allPagesData = data.pages.flat();
    const uniqueTxns = Array.from(
      new Map(allPagesData.map((item) => [item.global_counter, item])).values(),
    );
    return uniqueTxns;
  }, [data]);

  return { data: flattenedData, ...query };
};

export default useFeedQuery;
