import {
  useState,
  useEffect,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";

interface VirtualizationOptions {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  onEndReached?: () => void;
}

interface VirtualizationResult {
  startIndex: number;
  endIndex: number;
  containerRef: React.RefObject<HTMLDivElement>;
  handleScroll: () => void;
  isAtEnd: boolean;
  endRef: React.RefObject<HTMLDivElement>;
  setEndCallbackCompleted: Dispatch<SetStateAction<boolean>>;
}

export const useVirtualization = ({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5,
  onEndReached,
}: VirtualizationOptions): VirtualizationResult => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [endCallbackCompleted, setEndCallbackCompleted] = useState(false);

  const calculateRange = useCallback(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      const end = Math.min(
        itemCount - 1,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
      );
      setStartIndex(start);
      setEndIndex(end);
      setIsAtEnd(end >= itemCount - 1);
    }
  }, [itemCount, itemHeight, containerHeight, overscan]);

  useEffect(() => {
    calculateRange();
  }, [calculateRange]);

  const handleScroll = () => {
    calculateRange();
  };

  useEffect(() => {
    if (endRef.current && onEndReached) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !endCallbackCompleted) {
            setEndCallbackCompleted(true);
            onEndReached();
          }
        },
        { root: containerRef.current, threshold: 1.0 }
      );
      observer.observe(endRef.current);
      return () => observer.disconnect();
    }
  }, [onEndReached, endCallbackCompleted]);

  return {
    startIndex,
    endIndex,
    containerRef,
    handleScroll,
    isAtEnd,
    endRef,
    setEndCallbackCompleted,
  };
};
