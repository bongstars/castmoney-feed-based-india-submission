import { Transaction } from "@/app/utils/types";
import { User } from "@privy-io/react-auth";
import { FC, useEffect, useState } from "react";
import Panel from "../ui/Panel";
import { FeedNav } from "./FeedNav";
import { Greeting } from "./Greeting";
import { CastmoneyWallet } from "../CastmoneyWallet";
import { Profile } from "./Profile";
import { HottestTokens } from "./HottestTokens";
import { Leaderboard } from "./Leaderboard";
import { TransactionList } from "./Transactions";

interface MobileHomeProps {
  user: User | null;
  activeFeedTab: "big moves" | "latest" | "home" | "";
  setActiveFeedTab: (tab: "big moves" | "latest" | "home" | "") => void;
  activeComponentTab: "leaderboard" | "hottest tokens" | "";
  setActiveComponentTab: (tab: "leaderboard" | "hottest tokens" | "") => void;
  authenticated: boolean;
  isPending: boolean;
  data: Transaction[];
  handleLoadMore: () => Promise<void>;
  loading: boolean;
  fetching: boolean;
  hasNextPage: boolean;
  onCashIn: (txn: Transaction) => void;
  setOpenFiltersModal: (open: boolean) => void;
  mobileTab: string;
  logOut: () => void;
}

export const MobileHome: FC<MobileHomeProps> = ({
  user,
  activeFeedTab,
  setActiveFeedTab,
  activeComponentTab,
  setActiveComponentTab,
  authenticated,
  isPending,
  data,
  handleLoadMore,
  loading,
  fetching,
  hasNextPage,
  onCashIn,
  setOpenFiltersModal,
  mobileTab,
  logOut,
}) => {
  const [showSubPage, setShowSubPage] = useState(false);
  console.log("active feed tab", activeFeedTab);
  useEffect(() => {
    setActiveComponentTab("hottest tokens");
    setActiveFeedTab("big moves");
  }, [setActiveComponentTab, setActiveFeedTab]);
  return (
    <>
      <Panel
        open={mobileTab === "home"}
        className="h-[calc(100vh-62px)] overflow-y-scroll p-5"
      >
        <Greeting
          user={user}
          className="mb-5"
          currentComponentTab={activeComponentTab}
          setShowSubPage={setShowSubPage}
          showSubPage={showSubPage}
        />
        <FeedNav
          currentFeedTab={activeFeedTab}
          setCurrentFeedTab={(tab: string) => {
            setActiveFeedTab(tab as "home" | "latest" | "big moves");
            setShowSubPage(false);
          }}
          currentComponentTab={activeComponentTab}
          setCurrentComponentTab={(tab: string) => {
            setActiveComponentTab(tab as "leaderboard" | "hottest tokens");
            setShowSubPage(true);
          }}
          onFilterModalOpen={() => setOpenFiltersModal(true)}
          showSubPage={showSubPage}
          className="mb-4"
        />
        {authenticated && activeFeedTab && !showSubPage && (
          <TransactionList
            transactions={data}
            onLoadMore={handleLoadMore}
            loading={loading || isPending}
            fetching={fetching}
            hasMore={hasNextPage}
            onCashIn={onCashIn}
          />
        )}
        {authenticated &&
          activeComponentTab === "hottest tokens" &&
          showSubPage && <HottestTokens showHeading={false} />}
        {authenticated &&
          user?.farcaster?.fid &&
          activeComponentTab === "leaderboard" &&
          showSubPage && (
            <Leaderboard
              fid={user.farcaster.fid.toString()}
              authenticated={authenticated}
              showHeading={false}
              isMobile={true}
            />
          )}
      </Panel>
      <Panel
        open={mobileTab === "wallet"}
        className="h-[calc(100vh-62px)] overflow-y-scroll p-5"
      >
        {user?.wallet?.address && (
          <CastmoneyWallet address={user.wallet.address} />
        )}
      </Panel>
      <Panel
        open={mobileTab === "profile"}
        className="h-[calc(100vh-62px)] overflow-y-scroll"
      >
        <Profile user={user} logout={logOut} />
      </Panel>
    </>
  );
};
