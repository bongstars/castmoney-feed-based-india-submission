import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Transaction, FilterState } from "../utils/types";

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  filterState: FilterState;
}

type TransactionAction =
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_FILTER"; payload: Partial<FilterState> };

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  filterState: {
    followingFid: "",
    fids: [],
    minAmount: "",
    tokenAddress: "",
    chainId: "",
  },
};

const TransactionContext = createContext<
  | {
      state: TransactionState;
      dispatch: React.Dispatch<TransactionAction>;
    }
  | undefined
>(undefined);

function transactionReducer(
  state: TransactionState,
  action: TransactionAction,
): TransactionState {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_FILTER":
      return {
        ...state,
        filterState: { ...state.filterState, ...action.payload },
      };
    default:
      return state;
  }
}

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider",
    );
  }
  return context;
}
