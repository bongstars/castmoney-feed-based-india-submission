import { cn } from "@/app/utils/functions";
import {
  useState,
  useEffect,
  ComponentType,
  FC,
  PropsWithChildren,
  RefObject,
  UIEvent,
  TdHTMLAttributes,
} from "react";

// This interface represents a single table heading
interface TableHeading {
  label: string;
  headerKey: string; // This key will be used to access the corresponding data field
}

interface TableRow {
  [key: string]: any;
}

type TableHeadingProps<T extends TableHeading> = T & {
  onSort?: (key: string, arrangement: "asc" | "desc") => void;
  sortConfig?: { key: string; type: "asc" | "desc" };
};

type TableDataProps<T extends TableRow> = T & {
  fieldKey: string;
};

interface TableProps<T extends TableHeading, U extends TableRow> {
  headings: T[];
  data: U[];
  className?: string;
  headingClassName?: string;
  bodyClassName?: string;
  dataRowClassName?: string;
  HeadingContent: ComponentType<TableHeadingProps<T>>;
  DataContent: ComponentType<TableDataProps<U>>;
  sortPredicates: { [key: string]: (a: U, b: U) => number };
  rowKey: keyof U;
  height?: number;
  rowHeight?: number;
  startIndex?: number;
  endIndex?: number;
  sortConfig?: { key: string; type: "asc" | "desc" };
  setSortConfig?: (config: { key: string; type: "asc" | "desc" }) => void;
}

interface TableContainerProps {
  className?: string;
  containerClassName?: string;
  containerRef?: RefObject<HTMLDivElement>;
  handleScroll?: (event: UIEvent<HTMLDivElement>) => void;
}

interface THProps {
  className?: string;
}

interface TDProps extends TdHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

const TableContainer: FC<PropsWithChildren<TableContainerProps>> = ({
  className,
  containerClassName,
  children,
  containerRef,
  handleScroll,
}) => {
  return (
    <div className={className}>
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto no-scrollbar sm:-mx-6 lg:-mx-8">
          <div
            className={cn(
              "overflow-y-scroll no-scrollbar inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",
              containerClassName
            )}
            ref={containerRef}
            onScroll={handleScroll}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const TH: FC<PropsWithChildren<THProps>> = ({ className, children }) => {
  return (
    <th
      scope="col"
      className={cn(
        "sticky top-0 z-10",
        "shadow-[0_-8px_#131313,0_0px_#131313]",
        className
      )}
    >
      {children}
    </th>
  );
};

const TD: FC<PropsWithChildren<TDProps>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <td className={className} {...props}>
      {children}
    </td>
  );
};

function Table<T extends TableHeading, U extends TableRow>({
  headings,
  data,
  className,
  headingClassName,
  bodyClassName,
  dataRowClassName,
  HeadingContent,
  DataContent,
  sortPredicates,
  rowKey,
  rowHeight,
  startIndex,
  endIndex,
  sortConfig,
  setSortConfig,
}: TableProps<T, U>) {
  const [sortedData, setSortedData] = useState<U[]>(data);

  useEffect(() => {
    const sortData = (data: U[], key: string, type: "asc" | "desc") => {
      return [...data].sort((a, b) => {
        const predicate = sortPredicates[key];
        if (predicate) {
          const comparison = predicate(a, b);
          return type === "asc" ? comparison : -comparison;
        }
        return 0;
      });
    };

    const sortedData = sortConfig
      ? sortData(data, sortConfig.key, sortConfig.type)
      : data;
    setSortedData(sortedData);
  }, [data, sortConfig, sortPredicates]);

  const handleSort = (key: string, arrangement: "asc" | "desc") => {
    if (setSortConfig) setSortConfig({ key, type: arrangement });
  };

  const renderRows = () => {
    if (startIndex !== undefined && endIndex !== undefined) {
      return (
        <>
          <tr style={{ height: startIndex * (rowHeight || 44) }} />
          {/* Spacer row */}
          {sortedData.slice(startIndex, endIndex + 1).map((item) => (
            <tr key={item[rowKey] as string} className={dataRowClassName}>
              {headings.map((heading) => (
                <DataContent
                  {...item}
                  fieldKey={heading.headerKey}
                  key={heading.headerKey}
                />
              ))}
            </tr>
          ))}
          <tr
            style={{
              height: (sortedData.length - endIndex - 1) * (rowHeight || 44),
            }}
          />
          {/* Spacer row */}
        </>
      );
    } else {
      return sortedData.map((item) => (
        <tr key={item[rowKey] as string} className={dataRowClassName}>
          {headings.map((heading) => (
            <DataContent
              {...item}
              fieldKey={heading.headerKey}
              key={heading.headerKey}
            />
          ))}
        </tr>
      ));
    }
  };

  return (
    <table className="min-w-full border-separate border-spacing-0">
      <thead className={headingClassName}>
        <tr>
          {headings.map((heading) => (
            <HeadingContent
              {...heading}
              headerKey={heading.headerKey}
              key={heading.headerKey}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
          ))}
        </tr>
      </thead>
      <tbody className={bodyClassName}>{renderRows()}</tbody>
    </table>
  );
}

export {
  TableContainer,
  TH,
  TD,
  Table,
  type TableHeading,
  type TableHeadingProps,
  type TableDataProps,
};
