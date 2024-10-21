import { FilterOutline } from "@/app/icons";
import { FC } from "react"

interface FilterButtonProps {
  onFilterModalOpen: () => void;
}

export const FilterButton: FC<FilterButtonProps> = ({
  onFilterModalOpen
}) => {
  return (
    <button onClick={onFilterModalOpen}>
      <FilterOutline
        width={18}
        height={18}
        className="stroke-white"
      />
    </button>
  )
}
