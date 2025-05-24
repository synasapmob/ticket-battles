import {
  differenceInMilliseconds,
  Duration,
  intervalToDuration,
} from 'date-fns';
import { useEffect, useState } from 'react';

interface useCounterProps {
  date: Date | number | string;
  isCounter?: boolean;
  onSuccess?: () => void;
}

export default ({ date, isCounter = true, onSuccess }: useCounterProps) => {
  const initial = {
    start: new Date(),
    end: new Date(date),
  };

  const [counter, setCounter] = useState<Duration>(intervalToDuration(initial));

  useEffect(() => {
    const timer = setInterval(() => {
      const endTime = differenceInMilliseconds(new Date(), new Date(date));

      // clear because don't need counter
      if (!isCounter) {
        clearInterval(timer);
      }

      // this behaviour to stop counter
      if (endTime >= 0 && onSuccess) {
        onSuccess();
        clearInterval(timer);
      }

      setCounter(intervalToDuration(initial));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter, isCounter]);

  return {
    duration: counter,
    display: `${counter.days}d ${counter.hours}h ${counter.minutes}m ${counter.seconds}s`,
  };
};
