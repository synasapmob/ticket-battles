import { IconButton, IconButtonProps, useClipboard } from '@chakra-ui/react';

import CheckIcon from 'public/line/check.svg';
import CopyIcon from 'public/line/copy.svg';

interface ButtonCopyProps {
  value: string;
  sx?: Partial<IconButtonProps>;
}

export default function ButtonCopy({ value, sx }: ButtonCopyProps) {
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <IconButton
      aria-label="button-copy"
      color="primary.a.400"
      icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
      onClick={onCopy}
      sx={{
        svg: {
          width: 5,
          height: 5,
        },
      }}
      {...sx}
    />
  );
}
