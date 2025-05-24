import { AspectRatio, AspectRatioProps } from '@chakra-ui/layout';
import Image from 'next/image';

import TicketJPG from 'public/icon/ticket.jpg';

interface PoolTicketProps {
  variant?: AspectRatioProps;
}

export default ({ variant }: PoolTicketProps) => {
  return (
    <AspectRatio
      width="12.5rem"
      height="12.5rem"
      borderRadius="3xl"
      overflow="hidden"
      border="0.0125rem solid"
      borderColor="shader.a.500"
      {...variant}
    >
      <Image src={TicketJPG.src} alt={TicketJPG.src} fill />
    </AspectRatio>
  );
};
