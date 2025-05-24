import { Text, TextProps } from '@chakra-ui/react';

interface CardNFTTokenIDProps {
  tokenID: string;
  variant?: TextProps;
}
export default ({ tokenID, variant }: CardNFTTokenIDProps) => {
  return (
    <Text color="shader.a.100" {...variant}>
      #{tokenID}
    </Text>
  );
};
