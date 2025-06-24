import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';

import PoolModalHeader from './PoolModalHeader';

import Button3D from 'components/Button/Button3D';
import Radial from 'components/Radial';

interface PoolModalProps {
  winner: string;
  onClose: () => void;
}

export default ({ winner, onClose }: PoolModalProps) => {
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
            <PoolModalHeader winner={winner} />

            <HStack justifyContent="center">
              <Button3D shape="green" px={6} onClick={onClose}>
                Play again
              </Button3D>

              <Button3D shape="black" px={6} onClick={onClose}>
                Close
              </Button3D>
            </HStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
