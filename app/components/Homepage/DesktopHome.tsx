import React from "react";
import { Transaction } from "@/app/utils/types";
import { User } from "@privy-io/react-auth";
import { Greeting } from "./Greeting";
import { FeedNav } from "./FeedNav";
import { CastmoneyWallet } from "../CastmoneyWallet";
import { HottestTokens } from "./HottestTokens";
import { Leaderboard } from "./Leaderboard";
import { TransactionList } from "./Transactions";

interface DesktopHomeProps {
  user: User | null;
  activeTab: "home" | "latest" | "big moves" | "";
  setActiveTab: (tab: "home" | "latest" | "big moves" | "") => void;
  authenticated: boolean;
  isPending: boolean;
  data: Transaction[];
  handleLoadMore: () => Promise<void>;
  loading: boolean;
  fetching: boolean;
  hasNextPage: boolean;
  onCashIn: (txn: Transaction) => void;
  setOpenFiltersModal: (open: boolean) => void;
}

const DesktopHome: React.FC<DesktopHomeProps> = ({
  user,
  activeTab,
  setActiveTab,
  authenticated,
  isPending,
  data,
  handleLoadMore,
  loading,
  fetching,
  hasNextPage,
  onCashIn,
  setOpenFiltersModal,
}) => {
  return (
    <div className="w-full flex flex-col items-center overflow-y-clip">
      <Greeting user={user} className="mb-9" />
      <div className="w-full flex justify-between">
        {user?.wallet?.address && (
          <CastmoneyWallet
            address={user.wallet.address}
            className="hidden lg:block max-w-[296px] w-1/4"
          />
        )}
        <div className="max-w-[520px] w-5/12 overflow-y-auto max-h-[calc(100vh-200px)] no-scrollbar pr-4">
          <FeedNav
            currentFeedTab={activeTab}
            setCurrentFeedTab={(tab: string) =>
              setActiveTab(tab as "home" | "latest" | "big moves")
            }
            onFilterModalOpen={() => setOpenFiltersModal(true)}
            className="mb-4"
          />
          {authenticated && (
            <TransactionList
              transactions={data}
              onLoadMore={handleLoadMore}
              loading={loading || isPending}
              fetching={fetching}
              hasMore={hasNextPage}
              onCashIn={onCashIn}
            />
          )}
        </div>
        <div className="hidden lg:block max-w-[460px] w-1/3 overflow-y-auto max-h-[calc(100vh-240px)] no-scrollbar overflow-x-clip">
          {user?.farcaster?.fid && (
            <Leaderboard
              authenticated={authenticated}
              fid={user?.farcaster?.fid.toString()}
              isMobile={false}
              className="mb-6 pr-4"
            />
          )}
          <HottestTokens className="pr-4" />
        </div>
      </div>
    </div>
  );
};

export default DesktopHome;
