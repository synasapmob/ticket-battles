import { useCallback, useEffect, useRef } from 'react';

interface useObjserverProps {
  hasNextPage?: boolean;
  fetchNextPage: () => void;
}

export default ({ hasNextPage, fetchNextPage }: useObjserverProps) => {
  const objserverRef = useRef<IntersectionObserver>();
  const elementRef = useRef<HTMLDivElement | HTMLAnchorElement>();

  const objserverStart = useCallback(
    (ref: HTMLDivElement | HTMLAnchorElement | null) => {
      // if objserverRef existed we need clear memory
      if (objserverRef.current) objserverRef.current.disconnect();

      // initial "Intersection" for objserverRef
      objserverRef.current = new IntersectionObserver(entry => {
        if (entry[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      // maybe ref don't have so need to check
      if (ref) {
        objserverRef.current.observe(ref);
        elementRef.current = ref;
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const onScroll = () => {
      if (elementRef.current && objserverRef.current) {
        if (objserverRef.current) objserverRef.current.disconnect();

        objserverRef.current.observe(elementRef.current);
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return {
    objserverStart,
    elementRef,
  };
};
