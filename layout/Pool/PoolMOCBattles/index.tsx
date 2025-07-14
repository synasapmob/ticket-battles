import { Box, Center, HStack, Icon, Stack, Text } from '@chakra-ui/react';

import PoolTicket from '../PoolTicket';

import Attention from 'components/Attention';
import { useAccountContext } from 'components/Context/ContextAccount';
import IdentifyLinearBody from 'components/IdentifyLinear/IdentifyLinearBody';
import IdentifyLinearOverlay from 'components/IdentifyLinear/IdentifyLinearOverlay';
import IdentifyLinearYield from 'components/IdentifyLinear/IdentifyLinearYield';
import PlayerFill from 'public/fill/player.svg';
import { TypePoolEventPool } from 'types/types.pool';
import { shorten } from 'utils';

interface PoolMOCBattlesProps {
  getEnoughParticipants: number;
  pools: TypePoolEventPool[];
}

export default ({ getEnoughParticipants, pools }: PoolMOCBattlesProps) => {
  const { account } = useAccountContext();

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
            Total Player
          </Text>

          <HStack spacing={1.5} color="accents.green">
            <Icon as={PlayerFill} width={5} height={5} />

            <Text fontWeight="semibold">{pools.length}</Text>
          </HStack>
        </Center>

        <Attention>
          Please wait until there are {getEnoughParticipants} users. The pool
          will start after that.
        </Attention>
      </Stack>

      <Stack>
        {pools[0].participants.map(participant => {
          const isYou = participant === account;

          return (
            <Center
              key={participant}
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
                  {isYou ? 'You' : shorten(participant)}
                </IdentifyLinearYield>

                <HStack spacing={1.5}>
                  <PoolTicket
                    variant={{
                      width: 8,
                      height: 8,
                    }}
                  />

                  <IdentifyLinearYield
                    linear={(function () {
                      if (isYou) return 'green';

                      return 'shader';
                    })()}
                  >
                    1x
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
