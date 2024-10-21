import { useDeviceType } from "@/app/hooks/useDeviceType";
import useFeedData from "@/app/hooks/useFeedData";
import { usePrivy } from "@privy-io/react-auth";
import { useMemo, useReducer, useState } from "react";
import { initialState, inputReducer } from "./utils";
import { Transaction } from "@/app/utils/types";
import { Layout } from "../Layout";
import DesktopHome from "./DesktopHome";
import CashInPopup from "../CashInPopup/CashInPopup";
import { MobileHome } from "./MobileHome";
import FiltersModal from "./FiltersModal";
import { SignInButton } from "../Navbar/SignInButton";
import { Content } from "../LandingPage/Content";
import { HeroImage } from "../LandingPage/HeroImage";
import { Footer } from "../LandingPage/Footer";

export const HomePage = () => {
  const { ready, authenticated, user, logout, login } = usePrivy();
  const [inputs, dispatch] = useReducer(inputReducer, initialState);
  const [openCashInModal, setOpenCashInModal] = useState(false);
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const [activeFeedTab, setActiveFeedTab] = useState<
    "big moves" | "latest" | "home" | ""
  >("big moves");
  const [activeComponentTab, setActiveComponentTab] = useState<
    "leaderboard" | "hottest tokens" | ""
  >("");
  const [selectedTxn, setSelectedTxn] = useState<Transaction | undefined>(
    undefined,
  );
  const [mobileTab, setMobileTab] = useState("home");
  const device = useDeviceType();
  const isDesktop = device === "desktop";
  const {
    data,
    isPending,
    fetchNextPage,
    status,
    hasNextPage,
    isFetchingNextPage,
  } = useFeedData({
    fids: inputs.fids.length
      ? inputs.fids.map((fid) => fid.toString()).join(",")
      : undefined,
    chainId: inputs.chainId ? inputs.chainId : undefined,
    followingFid:
      activeFeedTab === "home" ? user?.farcaster?.fid?.toString() : undefined,
    minAmount:
      activeFeedTab === "big moves"
        ? "500"
        : inputs.minAmount
          ? inputs.minAmount
          : undefined,
    tokenAddress: inputs.tokenAddress ? inputs.tokenAddress : undefined,
    authenticated,
    // isLiked: activeFeedTab === "home" ? true : undefined,
  });

  const loading = status === "pending";
  const fetching = hasNextPage && isFetchingNextPage;

  const memoizedFilters = useMemo(() => inputs, [inputs]);

  const handleLoadMore = async () => {
    await fetchNextPage();
  };

  const onCashIn = (txn: Transaction) => {
    setOpenCashInModal(true);
    setSelectedTxn(txn);
  };

  if (!ready) {
    return <div>Loading...</div>;
  }
  if (!authenticated) {
    return (
      <Layout mobileTab={mobileTab} setMobileTab={setMobileTab}>
        <main className="font-work-sans flex flex-row justify-center w-full">
          <div className="w-full flex flex-row relative justify-between">
            <Content />
            <HeroImage />
            <Footer />
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout mobileTab={mobileTab} setMobileTab={setMobileTab}>
      {selectedTxn && (
        <CashInPopup
          transaction={selectedTxn}
          setOpen={setOpenCashInModal}
          onClose={() => setOpenCashInModal(false)}
          open={openCashInModal}
        />
      )}
      <FiltersModal
        open={openFiltersModal}
        setOpen={setOpenFiltersModal}
        handleEnter={dispatch}
        state={memoizedFilters}
      />
      {isDesktop ? (
        <DesktopHome
          user={user}
          activeTab={activeFeedTab}
          setActiveTab={setActiveFeedTab}
          authenticated={authenticated}
          isPending={isPending}
          data={data}
          handleLoadMore={handleLoadMore}
          loading={loading}
          fetching={fetching}
          hasNextPage={hasNextPage}
          onCashIn={onCashIn}
          setOpenFiltersModal={setOpenFiltersModal}
        />
      ) : (
        <MobileHome
          user={user}
          activeFeedTab={activeFeedTab}
          setActiveFeedTab={setActiveFeedTab}
          activeComponentTab={activeComponentTab}
          setActiveComponentTab={setActiveComponentTab}
          authenticated={authenticated}
          isPending={isPending}
          data={data}
          handleLoadMore={handleLoadMore}
          loading={loading}
          fetching={fetching}
          hasNextPage={hasNextPage}
          onCashIn={onCashIn}
          setOpenFiltersModal={setOpenFiltersModal}
          mobileTab={mobileTab}
          logOut={logout}
        />
      )}
    </Layout>
  );
};
