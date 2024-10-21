import { FC, useMemo } from "react";
import { Spinner } from "../../ui/Spinner";
import {
  Table,
  TableContainer,
  TableDataProps,
  TableHeading,
  TableHeadingProps,
} from "../../ui/Table";
import { LeaderboardEntry } from "../utils";
import { DefaultTableHeading } from "../../DefaultTableHeading";
import { DataCol } from "../../DataCol";
import { TraderDataCol } from "../TraderDataCol";
import { DataColWithSubText } from "../../DataColWithSubText";
import { cn, formatUSD } from "@/app/utils/functions";

interface LeaderboardTableProps {
  className?: string;
  data: LeaderboardEntry[];
  containerClassName?: string;
  loading: boolean;
}

type HeadingContentProps = TableHeadingProps<TableHeading>;
type DataContentProps = TableDataProps<LeaderboardEntry>;

function renderDataContent({
  fieldKey,
  netBoughtUsd,
  netSoldUsd,
  noOfBuyTxns,
  noOfSellTxns,
  profilePicture,
  rollingPnl24hrs,
  username,
}: DataContentProps) {
  switch (fieldKey) {
    case "trader":
      return (
        <TraderDataCol
          name={username}
          profileImage={profilePicture}
          className="min-w-[120px]"
        />
      );
    case "bought":
      return (
        <DataColWithSubText
          value={formatUSD(netBoughtUsd)}
          subText={`${noOfBuyTxns} txns`}
        />
      );
    case "sold":
      return (
        <DataColWithSubText
          value={formatUSD(netSoldUsd)}
          subText={`${noOfSellTxns} txns`}
        />
      );
    case "pnl":
      return (
        <DataCol
          value={formatUSD(rollingPnl24hrs)}
          className={cn(
            rollingPnl24hrs >= 0 ? "text-[#F1FF6A]" : "text-[#FC9D9D]",
          )}
        />
      );
    default:
      return null;
  }
}

const Heading: FC<HeadingContentProps> = (props) => {
  return <DefaultTableHeading {...props} />;
};

export const LeaderboardTable: FC<LeaderboardTableProps> = ({
  className,
  data,
  loading,
  containerClassName,
}) => {
  const tableHeadings = useMemo(
    () => [
      { label: "trader", headerKey: "trader" },
      { label: "bought", headerKey: "bought" },
      { label: "sold", headerKey: "sold" },
      { label: "pnl", headerKey: "pnl" },
    ],
    [],
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner className="border-t-[#E0ED64]" />
        </div>
      ) : (
        <TableContainer
          className="flex-1 min-h-0"
          containerClassName={cn("h-full overflow-y-auto ", containerClassName)}
        >
          <Table
            headings={tableHeadings}
            data={data}
            HeadingContent={Heading}
            DataContent={renderDataContent}
            rowKey="fid"
            sortPredicates={{
              rank: (a: LeaderboardEntry, b: LeaderboardEntry) =>
                a.rank - b.rank,
            }}
          />
        </TableContainer>
      )}
    </div>
  );
};
