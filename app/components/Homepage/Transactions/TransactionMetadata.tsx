import { Copy } from "@/app/icons"
import { cn, copyToClipboard, formatDuration, getChainExplorerLink } from "@/app/utils/functions"
import { Transaction } from "@/app/utils/types"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
import toast from "react-hot-toast"

interface TransactionMetadataProps {
  transaction: Transaction;
  className?: string;
}

export const TransactionMetadata: FC<TransactionMetadataProps> = ({
  transaction,
  className
}) => {
  return (
    <div className={cn("flex items-start justify-between", className)}>
      <div className="flex items-center space-x-1">
        <Image
          src={
            transaction.profile?.profile_picture || "/default-avatar.png"
          }
          alt={transaction.profile?.username || "User"}
          className="w-6 h-6 rounded-full"
          height={24}
          width={24}
        />
        <Link
          href={`https://warpcast.com/${transaction.profile?.username || "unknown"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-medium hover:text-purple-400"
        >
          {transaction.profile?.username || "Anonymous User"}
        </Link>
        <button
          onClick={() => {
            copyToClipboard(transaction.txn_originator, () => {
              toast.success('Address successfully copied!', {
                position: 'bottom-right',
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
              });
            })
          }}
          className="opacity-60 hover:opacity-80"
          title="Copy address"
        >
          <Copy height={16} width={16} className="fill-[#E8EAED]" />
        </button>
      </div>
      <div className="flex items-center space-x-2 text-white">
        <Link
          href={getChainExplorerLink(
            transaction.chain_id,
            transaction.txn_hash,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={transaction.chain_image || "/default-avatar.png"}
            alt={transaction.profile?.username || "User"}
            className="w-4 h-4 rounded-full"
            height={16}
            width={16}
          />
        </Link>
        <span className="text-[#343433]">&bull;</span>
        <Image
          src={transaction.dex_image || "/default-avatar.png"}
          alt={transaction.profile?.display_name || "User"}
          className="w-4 h-4 rounded-full"
          height={16}
          width={16}
        />
        <span className="text-[#343433]">&bull;</span>
        <span className="text-[#F9F8FD] opacity-60 text-sm">
          {formatDuration(
            new Date(parseInt(transaction.block_timestamp) * 1000),
            false
          )}
        </span>
      </div>
    </div>
  )
}
