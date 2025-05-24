import { Text, TextProps } from '@chakra-ui/react';

interface CardNFTNameProps {
  name: string;
  variant?: TextProps;
}
export default ({ name, variant }: CardNFTNameProps) => {
  return (
    <Text color="shader.a.300" fontWeight="medium" noOfLines={2} {...variant}>
      {name}
    </Text>
  );
};
