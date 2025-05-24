import { Center, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default () => {
  return (
    <Center textAlign="center">
      <Text color="white" fontWeight="semibold">
        A minting event is live&nbsp;
        <Link href="/mint">
          <Text as="span" color="primary.a.300">
            click here
          </Text>
        </Link>
        &nbsp;to join!
      </Text>
    </Center>
  );
};
