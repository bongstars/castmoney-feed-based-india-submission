import { Dispatch, useState, FC, SetStateAction, useCallback, useEffect } from "react";
import { FilterState } from "@/app/utils/types";
import { Input, InputGroup, InputLabel, InputLabelProps, InputProps } from "../ui/Input";
import { InputAction } from "./utils";
import { FilterOutline } from "@/app/icons";
import { Modal } from "../ui/Modal";
import { X } from "lucide-react";

interface FiltersProps {
  handleEnter: Dispatch<InputAction>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  state: FilterState;
}

const FiltersModal: FC<FiltersProps> = ({ 
  handleEnter,
  open,
  setOpen,
  state
}) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [followingFid, setFollowingFid] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [fids, setFids] = useState('');
  const [chainId, setChainId] = useState('');

  useEffect(() => {
    if (!open) {
      setTokenAddress(state.tokenAddress || '');
      setFollowingFid(state.followingFid || '');
      setMinAmount(state.minAmount || '');
      setFids(state.fids.join(',') || '');
      setChainId(state.chainId || '');
    }
  }, [open, state]);

  const InputLabelComponent = useCallback(
    ({ children }: InputLabelProps) => <InputLabel className="text-white text-xs">{children}</InputLabel>,
    []
  );
  const InputComponent = useCallback(
    (props: InputProps) => <Input className="no-spinner" {...props} />,
    []
  );
  
  return (
    <Modal
      className="w-full max-w-[340px] sm:w-[420px] sm:max-w-[420px]"
      open={open}
      setOpen={setOpen}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-1">
          <FilterOutline
            width={20}
            height={20} 
            className="stroke-white"
          />
          <span className="text-white font-medium">filter</span>
        </div>
        <button 
          className="bg-[#1E2020] p-1 rounded-full"
          onClick={() => setOpen(false)}
        >
          <X 
            width={14}
            height={14}
            className="stroke-white stroke-2" 
          />
        </button>
      </div>
      <div className="space-y-3 mb-5">
        <InputGroup
          name="token-address"
          placeholder="address"
          type="text"
          label="token address"
          InputLabelComponent={InputLabelComponent}
          InputComponent={InputComponent}
          onChange={(e) => setTokenAddress(e.target.value)}
          value={tokenAddress}
        />
        <InputGroup
          name="min-amt"
          placeholder="min amount"
          type="number"
          label="Min. Amount ($)"
          InputLabelComponent={InputLabelComponent}
          InputComponent={InputComponent}
          onChange={(e) => setMinAmount(e.target.value)}
          value={minAmount}
        />
        <InputGroup
          name="following-fid"
          placeholder="fid"
          type="number"
          label="following fid"
          InputLabelComponent={InputLabelComponent}
          InputComponent={InputComponent}
          onChange={(e) => setFollowingFid(e.target.value)}
          value={followingFid}
        />
        <InputGroup 
          name="fids"
          placeholder="FIDs (comma-separated)"
          type="number"
          label="fid's"
          InputLabelComponent={InputLabelComponent}
          InputComponent={InputComponent}
          onChange={(e) => setFids(e.target.value)}
          value={fids}
        />
        <p className="text-xs text-white">chains</p>
        <select
          value={chainId}
          onChange={(e) => setChainId(e.target.value)}
          className="rounded-md w-full bg-[#131313] p-3 text-xs text-white outline-none"
        >
          <option value="">All Chains</option>
          <option value="1">Ethereum</option>
          <option value="8453">Base</option>
        </select>
      </div>
      <button
        onClick={() => {
          handleEnter({
            payload: {
              chainId: chainId,
              fids: fids.split(',').map(fid => {
                return parseFloat(fid.trim())
              }).filter(fid => !Number.isNaN(fid)),
              followingFid: followingFid,
              minAmount: minAmount,
              tokenAddress: tokenAddress
            },
            type: "SET_FILTER"
          });
          setOpen(false);
        }}
        className="w-full bg-white text-[#101114] px-4 py-2 rounded-3xl text-sm font-semibold"
      >
        apply
      </button>
    </Modal>
  );
};

export default FiltersModal;
