import { useToast } from '@chakra-ui/react';

export default () => {
  const toast = useToast({
    position: 'top-right',
    isClosable: true,
    duration: 3000,
  });

  return toast;
};
