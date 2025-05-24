import { Image, ImageProps } from '@chakra-ui/react';
import { ForwardedRef, forwardRef } from 'react';

export default forwardRef(
  (props: ImageProps, ref: ForwardedRef<HTMLImageElement>) => (
    <Image
      alt={`avatar-error`}
      fallbackSrc="/fill/image-error.svg"
      fallbackStrategy="onError"
      src="/fill/image-error.svg"
      ref={ref}
      {...props}
    />
  )
);
