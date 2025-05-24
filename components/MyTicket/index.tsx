import { Center, Text } from '@chakra-ui/react';

interface MyTicketProps {
  amount: number;
}

export default ({ amount }: MyTicketProps) => {
  return (
    <Center
      justifyContent="space-between"
      bg="shader.a.900"
      padding={4}
      borderRadius="xl"
    >
      <Text color="white" fontWeight="medium" fontSize="lg">
        Balance
      </Text>

      <Text color="accents.green" fontWeight="medium">
        {amount} Tickets
      </Text>
    </Center>
  );
};
