import { cn, formatNumber } from '@/app/utils/functions';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

interface TokenInputProps {
  variant: 'pay' | 'receive';
  className?: string;
  amount: string;
  setAmount?: Dispatch<SetStateAction<string>>;
  symbol: string;
}

export const TokenInput: React.FC<TokenInputProps> = ({ 
  variant,
  className,
  amount,
  setAmount,
  symbol
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const resizeInput = (el: HTMLInputElement, factor: number) => {
      const int = Number(factor) || 7.7;
      const resize = () => {
        const newWidth = ((el.value.length + 1) * int);
        el.style.width = newWidth > 200 ? '200px' : `${newWidth}px`;
      };
      const events = ['keyup', 'keypress', 'focus', 'blur', 'change'];
      events.forEach(event => el.addEventListener(event, resize, false));
      resize();
    };

    if (inputRef.current) {
      resizeInput(inputRef.current, 7);
    }
  }, [amount]);

  return (
    <>
      {variant === 'pay' && setAmount ? (
        <div className={cn('flex items-center space-x-1 max-w-full', className)}>
          <input
            ref={inputRef}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="outline-none text-center text-white text-lg font-medium max-w-[200px] overflow-x-auto castmoney-scrollbar bg-transparent no-spinner"
          />
          <span className='shrink-0 text-white text-lg font-medium'>{symbol}</span>
        </div>
      ) : (
        <div className={cn('flex items-center space-x-1 max-w-full shrink-0', className)}>
          <span className='text-white text-lg font-medium'>{formatNumber(parseFloat(amount))}</span>
          <span className='shrink-0 text-white text-lg font-medium'>{symbol}</span>
        </div>
      )}
    </>
  );
}
