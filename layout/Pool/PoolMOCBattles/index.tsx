import { Box, Center, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';

import PoolTicket from '../PoolTicket';

import Attention from 'components/Attention';
import IdentifyLinearBody from 'components/IdentifyLinear/IdentifyLinearBody';
import IdentifyLinearOverlay from 'components/IdentifyLinear/IdentifyLinearOverlay';
import IdentifyLinearYield from 'components/IdentifyLinear/IdentifyLinearYield';
import PlayerFill from 'public/fill/player.svg';
import TicketJPG from 'public/icon/ticket.jpg';

export default () => {
  const random = Math.floor(Math.random() * 6);

  return (
    <Stack
      spacing={6}
      padding={4}
      paddingBottom="3.625rem"
      bg="shader.a.800"
      borderRadius="2xl"
      boxShadow="0px 0px 15px 0px #00000026"
    >
      <Stack>
        <Center
          padding={4}
          bg="shader.a.900"
          borderRadius="xl"
          justifyContent="space-between"
        >
          <Text color="white" fontSize="lg" fontWeight="medium">
            Mooners
          </Text>

          <HStack spacing={1.5} color="accents.green">
            <Icon as={PlayerFill} width={5} height={5} />

            <Text fontWeight="semibold">4</Text>
          </HStack>
        </Center>

        <Attention />
      </Stack>

      <Stack>
        {['1', '2', '3', '4', '5'].map((meta, index) => {
          const isYou = index === random;

          return (
            <Center
              key={meta}
              justifyContent="space-between"
              height="4.25rem"
              overflow="hidden"
              borderRadius="xl"
            >
              <Box position="relative">
                <PoolTicket
                  variant={{
                    width: '100%',
                    height: '100%',
                  }}
                />

                <IdentifyLinearOverlay
                  linear={(function () {
                    if (isYou) return 'green';

                    return 'black';
                  })()}
                />
              </Box>

              <IdentifyLinearBody
                linear={(function () {
                  if (isYou) return 'green';

                  return 'black';
                })()}
              >
                <IdentifyLinearYield
                  linear={(function () {
                    if (isYou) return 'green';

                    return 'white';
                  })()}
                >
                  {isYou ? 'You' : `0x1eeB...Be1a${index}`}
                </IdentifyLinearYield>

                <HStack spacing={1.5}>
                  <Image
                    src={TicketJPG.src}
                    alt={TicketJPG.src}
                    width={8}
                    height={8}
                  />

                  <IdentifyLinearYield
                    linear={(function () {
                      if (isYou) return 'green';

                      return 'shader';
                    })()}
                  >
                    {index}x
                  </IdentifyLinearYield>
                </HStack>
              </IdentifyLinearBody>
            </Center>
          );
        })}
      </Stack>
    </Stack>
  );
};
