import {
  Box,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';

import PoolModalHeader from './PoolModalHeader';

import Button3D from 'components/Button/Button3D';
import IdentifyLinearBody from 'components/IdentifyLinear/IdentifyLinearBody';
import IdentifyLinearContainer from 'components/IdentifyLinear/IdentifyLinearContainer';
import IdentifyLinearOverlay from 'components/IdentifyLinear/IdentifyLinearOverlay';
import IdentifyLinearYield from 'components/IdentifyLinear/IdentifyLinearYield';
import MocCollection from 'components/MocCollection';
import Radial from 'components/Radial';

interface PoolModalProps {
  onClose: () => void;
}

export default ({ onClose }: PoolModalProps) => {
  const random = Math.floor(Math.random() * 6);

  return (
    <Modal variant="blur" isOpen={true} onClose={onClose}>
      <ModalOverlay />

      <ModalContent maxWidth="550px">
        <ModalBody
          px={4}
          py={6}
          position="relative"
          bg="shader.a.800"
          boxShadow="0px 0px 15px 0px #00000026"
          borderRadius="2xl"
        >
          <Radial
            bg="radial-gradient(50% 100% at 50% 100%, rgba(137, 233, 97, 0.1) 0%, rgba(137, 233, 97, 0) 100%)"
            transform="rotate(180deg)"
            top={0}
          />

          <Stack spacing={4} textAlign="center" alignItems="center">
            <PoolModalHeader />

            <Stack width="full">
              {['1', '2', '3', '4', '5'].map((meta, index) => {
                const isYou = index === 0;
                const isWin = index === random;

                return (
                  <IdentifyLinearContainer key={meta}>
                    <Box position="relative">
                      <Image
                        alt="ticket-image"
                        minWidth="4.25rem"
                        height="full"
                        objectFit="cover"
                      />

                      <IdentifyLinearOverlay
                        linear={(function () {
                          if (isYou && isWin) return 'green';

                          if (isYou && !isWin) return 'red';

                          return 'black';
                        })()}
                      />
                    </Box>

                    <IdentifyLinearBody
                      linear={(function () {
                        if (isYou && isWin) return 'green';

                        if (isYou && !isWin) return 'red';

                        return 'black';
                      })()}
                    >
                      <IdentifyLinearYield
                        linear={(function () {
                          if (isYou && isWin) return 'green';

                          if (isYou && !isWin) return 'red';

                          return 'white';
                        })()}
                      >
                        {isYou ? 'You' : `0x1eeB...Be1a${index}`}
                      </IdentifyLinearYield>

                      {isWin && (
                        <HStack>
                          <Image
                            // src={ChestWEBP.src}
                            alt="chest-image"
                            borderRadius="lg"
                            borderWidth="0.025rem 0.025rem 0.005rem 0.025rem"
                            borderStyle="solid"
                            borderColor="accents.green"
                            boxShadow="0px 0px 0.2rem 0px #89E96140"
                            width={10}
                            height={10}
                          />

                          <IdentifyLinearYield
                            linear={(function () {
                              if (isYou && isWin) return 'green';

                              if (isYou && !isWin) return 'red';

                              return 'green';
                            })()}
                          >
                            X1 Chest
                          </IdentifyLinearYield>
                        </HStack>
                      )}

                      {!isWin && (
                        <IdentifyLinearYield
                          linear={(function () {
                            if (isYou && isWin) return 'green';

                            if (isYou && !isWin) return 'red';

                            return 'shader';
                          })()}
                        >
                          + 0.0015 ETH
                        </IdentifyLinearYield>
                      )}
                    </IdentifyLinearBody>
                  </IdentifyLinearContainer>
                );
              })}
            </Stack>

            <HStack justifyContent="center">
              <Button3D shape="green" px={6} onClick={onClose}>
                Play again
              </Button3D>

              <Button3D shape="black" px={6} onClick={onClose}>
                Close
              </Button3D>
            </HStack>

            <MocCollection />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
