import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchV1 } from "@/app/utils/functions";

export const leaderboardQueryKey = (searchParams: string) => [
  "leaderboard",
  searchParams,
];

const useLeaderboardQuery = <R>({
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

  const query = useQuery<R>({
    queryKey: leaderboardQueryKey(searchParamsString),
    queryFn: async () => {
      const response = await fetchV1(`/api/leaderboard?${searchParamsString}`);
      return response as R;
    },
    enabled: enabled,
  });

  return query;
};

export default useLeaderboardQuery;
