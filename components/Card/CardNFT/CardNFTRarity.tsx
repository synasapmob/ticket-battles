import { Box, TextProps } from '@chakra-ui/react';

import { getColorOfRarity, getNameOfRarity } from 'utils';

interface CardNFTRarityProps {
  tokenId: number;
  variant?: TextProps;
}
export default ({ tokenId, variant }: CardNFTRarityProps) => {
  return (
    <Box
      py={1}
      px={3}
      width="fit-content"
      borderRadius="lg"
      bg={getColorOfRarity(tokenId)}
      {...variant}
    >
      {getNameOfRarity(tokenId)}
    </Box>
  );
};
