import { Box, Text } from '@chakra-ui/react';

export default () => {
  return (
    <>
      {/* <Image
        alt="chest-image"
        borderWidth="0.0625rem 0.0625rem 0.125rem 0.0625rem"
        borderRadius="lg"
        borderStyle="solid"
        borderColor="accents.green"
        boxShadow="0px 0px 8px 0px #89E96140"
        width={20}
        height={20}
      /> */}

      <Box pt={14} pb={8}>
        <Text color="white" fontSize="2xl" fontWeight="bold">
          Congratulation
        </Text>

        <Text color="shader.a.200">
          Congratulations! You’ve successfully received an NFT.
        </Text>
      </Box>
    </>
  );
};
