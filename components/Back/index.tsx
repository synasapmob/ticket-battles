import { Button, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import ArrowLine from 'public/line/arrow.svg';

export default () => {
  const router = useRouter();

  return (
    <Button
      height="unset"
      width="fit-content"
      color="white"
      fontWeight="medium"
      iconSpacing={1}
      leftIcon={<Icon as={ArrowLine} width={4} height={4} />}
      onClick={() => router.back()}
    >
      Back
    </Button>
  );
};
