import { Icon } from '@chakra-ui/react';

import Button3D from 'components/Button/Button3D';
import NotificationIcon from 'public/fill/notification.svg';

export default () => {
  return (
    <Button3D
      shape="black"
      borderRadius="full"
      minWidth={10}
      width={10}
      height={10}
      justifyContent="center"
    >
      <Icon as={NotificationIcon} width={5} height={5} color="white" />
    </Button3D>
  );
};
