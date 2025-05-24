import { useMemo } from 'react';

export default (
  src: string,
  option?: Partial<{
    loop: boolean;
    muted: boolean;
    volume: number; // range 0 - 1
  }>
) => {
  const audio = useMemo(() => {
    if (typeof Window !== 'undefined') {
      const argument = new Audio(src);

      if (option) {
        for (const [key, value] of Object.entries(option)) {
          // @ts-ignore
          argument[key] = value;
        }
      }

      return argument;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return audio;
};
