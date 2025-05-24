import { Button, Icon, Stack, StackProps, Text } from '@chakra-ui/react';

import RefreshIcon from 'public/line/refresh.svg';

interface ButtonTryAgainProps {
  isFetching: boolean;
  refetch: () => void;
  variant?: StackProps;
}

export default ({ isFetching, refetch, variant }: ButtonTryAgainProps) => {
  return (
    <Stack spacing={4} py={4} alignItems="center" {...variant}>
      <Text fontWeight="medium" fontSize="lg" color="shader.a.100">
        Nothing to see here.
      </Text>

      <Button
        variant="dark"
        width="fit-content"
        bg="shader.a.700"
        loadingText="Try again"
        leftIcon={<Icon as={RefreshIcon} width={4} height={4} />}
        isLoading={isFetching}
        onClick={refetch}
      >
        Try again
      </Button>
    </Stack>
  );
};
