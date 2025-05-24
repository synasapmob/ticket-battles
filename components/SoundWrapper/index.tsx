import { Box, BoxProps } from '@chakra-ui/react';

import { useAudioContext } from 'components/Context/ContextVolume';
import useAudio from 'hook/useAudio';
import ClickWAV from 'public/sound/click.wav';
import HoverWAV from 'public/sound/hover.wav';

export default (props?: BoxProps) => {
  const { isVolume } = useAudioContext();

  const AudioHoverWAV = useAudio(HoverWAV, {
    volume: 0.3,
  });
  const AudioClickWAV = useAudio(ClickWAV, {
    volume: 0.3,
  });

  return (
    <Box
      width="full"
      height="full"
      {...props}
      onMouseEnter={event => {
        if (isVolume && AudioHoverWAV) {
          AudioHoverWAV.currentTime = 0; // reset time before hover
          AudioHoverWAV.play();
        }

        if (props?.onMouseEnter) props.onMouseEnter(event);
      }}
      onMouseLeave={event => {
        if (isVolume && AudioHoverWAV) {
          AudioHoverWAV.pause();
        }

        if (props?.onMouseLeave) props.onMouseLeave(event);
      }}
      onClick={event => {
        if (isVolume && AudioClickWAV) {
          AudioClickWAV.currentTime = 0; // reset time before hover
          AudioClickWAV.play();
        }

        if (props?.onClick) props.onClick(event);
      }}
    >
      {props?.children}
    </Box>
  );
};
