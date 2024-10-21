import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const formatDuration = (refDate: Date, includeSuffix = true) => {
  const now = Date.now();
  const diffInSeconds = Math.abs((now - refDate.getTime()) / 1000);
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;
  const diffInMonths = diffInDays / 30.44; // Average number of days in a month
  const diffInYears = diffInDays / 365.25; // Average number of days in a year

  const isFuture = now < refDate.getTime() ? "away" : "ago";
  const suffix = includeSuffix ? ` ${isFuture}` : "";

  if (diffInYears >= 1) {
    return `${Math.round(diffInYears)}y${suffix}`;
  } else if (diffInMonths >= 1) {
    return `${Math.round(diffInMonths)}m${suffix}`;
  } else if (diffInDays >= 1) {
    return `${Math.round(diffInDays)}d${suffix}`;
  } else if (diffInHours >= 1) {
    return `${Math.round(diffInHours)}h${suffix}`;
  } else if (diffInMinutes >= 1) {
    return `${Math.round(diffInMinutes)}min${suffix}`;
  } else {
    return `${Math.round(diffInSeconds)}s${suffix}`;
  }
};

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const formatAddress = (
  address: `0x${string}`,
  startCharactersLength = 4,
  endCharactersLength = 4
): string => {
  return (
    address.slice(0, startCharactersLength) +
    "..." +
    address.slice(-endCharactersLength)
  );
};

const formatNumber = (
  value: number,
  currency = false,
  maxDecimals?: number
) => {
  value = Math.abs(value);
  let result: number;
  let suffix = "";

  if (value < 1e-6 && value !== 0) {
    return "~0";
  } else if (value < 1e-2) {
    result = value;
  } else if (value < 1e3) {
    result = value;
  } else if (value >= 1e3 && value < 1e6) {
    result = value / 1e3;
    suffix = "K";
  } else if (value >= 1e6 && value < 1e9) {
    result = value / 1e6;
    suffix = "M";
  } else if (value >= 1e9 && value < 1e12) {
    result = value / 1e9;
    suffix = "B";
  } else if (value >= 1e12) {
    result = value / 1e12;
    suffix = "T";
  } else {
    result = value;
  }

  // Remove trailing zeros
  let [whole, decimal] = result
    .toFixed(
      value < 1
        ? maxDecimals
          ? maxDecimals
          : 6
        : maxDecimals
          ? maxDecimals
          : 2
    )
    .split(".");
  if (decimal) {
    decimal = decimal.replace(/0+$/, "");
  }
  return decimal !== ""
    ? `${whole}.${decimal}${suffix}`
    : `${whole}${suffix}${value < 1e3 && currency ? ".00" : ""}`;
};

const formatUSD = (amount: number) => {
  const formattedNumber = formatNumber(amount, true);
  return formattedNumber.startsWith("~")
    ? `~$${formattedNumber.slice(1)}`
    : `$${formattedNumber}`;
};

const formatPercentage = (percentage: number) => {
  return `${formatNumber(percentage, false, 1)}%`;
};

const linkify = (text: string) => {
  const urlPattern =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return text.replace(
    urlPattern,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-castmoney-brand ttext-opacity-100 underline">${url}</a>`
  );
};

const fetchV1 = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result?.detail ?? "something went wrong");
  }
  return response.json();
};

const getChainExplorerLink = (chainId: string, txHash: string) => {
  switch (chainId) {
    case "1":
      return `https://etherscan.io/tx/${txHash}`;
    case "8453":
      return `https://basescan.org/tx/${txHash}`;
    // Add more cases for other chains as needed
    default:
      return "#";
  }
};

const copyToClipboard = (text: string, onCopy?: (text: string) => void) => {
  navigator.clipboard.writeText(text);
  if (!onCopy) return;
  onCopy(text);
};

export { 
  formatDuration,
  cn,
  formatAddress,
  formatNumber,
  formatUSD,
  formatPercentage,
  linkify,
  fetchV1,
  getChainExplorerLink,
  copyToClipboard
};
