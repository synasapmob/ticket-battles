import { Box, Image, Text } from '@chakra-ui/react';

export default () => {
  return (
    <>
      <Image
        alt="chest-image"
        borderWidth="0.0625rem 0.0625rem 0.125rem 0.0625rem"
        borderRadius="lg"
        borderStyle="solid"
        borderColor="accents.green"
        boxShadow="0px 0px 8px 0px #89E96140"
        width={20}
        height={20}
      />

      <Box>
        <Text color="white" fontSize="2xl" fontWeight="bold">
          Congatz, Mooner!
        </Text>

        <Text color="shader.a.200">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </Text>
      </Box>
    </>
  );
};
