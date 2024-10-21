import { useMemo } from "react";
import useLeaderboardQuery from "./queries/leaderboard";
import { LeaderboardData } from "../components/Homepage/utils";

const useLeaderboardData = ({
  fid,
  authenticated,
}: {
  fid?: string;
  authenticated: boolean;
}) => {
  const { data, ...query } = useLeaderboardQuery<LeaderboardData>({
    searchParams: {
      fid,
    },
    enabled: authenticated,
  });

  const parsedData = useMemo(() => {
    if (!data) return undefined;
    return data;
  }, [data]);

  return { data: parsedData, ...query };
};

export default useLeaderboardData;
