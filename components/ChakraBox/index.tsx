import { ChakraComponent, chakra, shouldForwardProp } from '@chakra-ui/react';
import {
  ForwardRefComponent,
  HTMLMotionProps,
  Transition,
  isValidMotionProp,
  motion,
} from 'framer-motion';

const ChakraBox: ChakraComponent<
  ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>,
  {
    transition?: Transition;
  }
> = chakra(motion.div, {
  /**
   * Allow motion props and non-Chakra props to be forwarded.
   */
  shouldForwardProp: prop => isValidMotionProp(prop) || shouldForwardProp(prop),
});

export default ChakraBox;
