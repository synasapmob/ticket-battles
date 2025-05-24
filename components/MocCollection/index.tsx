import { Button, Icon } from '@chakra-ui/react';

import ArrowLine from 'public/line/arrow.svg';

export default () => {
  return (
    <Button
      color="accents.green"
      fontWeight="medium"
      height="fit-content"
      iconSpacing={1}
      rightIcon={
        <Icon as={ArrowLine} width={5} height={5} transform="rotate(180deg)" />
      }
    >
      MOC Collection
    </Button>
  );
};
