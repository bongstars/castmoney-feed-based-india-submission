// export const formatAmount = (amount: string, decimals: string): string => {
//   return (parseFloat(amount) / Math.pow(10, parseInt(decimals))).toFixed(4);
// };

export const formatTokenAmount = (amount: string, decimals: string): string => {
  const value = parseFloat(amount) / Math.pow(10, parseInt(decimals));
  return value.toFixed(4);
};
export const filterReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_FOLLOWING_FID":
      return { ...state, followingFid: action.payload };
    case "SET_FIDS":
      return { ...state, fids: action.payload };
    case "SET_MIN_AMOUNT":
      return { ...state, minAmount: action.payload };
    case "SET_TOKEN_ADDRESS":
      return { ...state, tokenAddress: action.payload };
    case "SET_CHAIN_ID":
      return { ...state, chainId: action.payload };

    default:
      return state;
  }
};
