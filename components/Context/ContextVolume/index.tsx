'use client';

import { HStack, Icon, IconButton, Text } from '@chakra-ui/react';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import useAudio from 'hook/useAudio';
import OffFill from 'public/fill/off.svg';
import OnFill from 'public/fill/on.svg';
import WithinTheShadowsMP3 from 'public/sound/within_the_shadows.mp3';
import utilsConstants from 'utils/utils.constants';
import { getCookie, setCookie } from 'utils/utils.cookie';

interface VolumeContextProps {
  isVolume: boolean;
  setIsVolume: Dispatch<SetStateAction<boolean>>;
}

const VolumeContext = createContext<VolumeContextProps>({
  isVolume: false,
  setIsVolume: () => {},
});

export default ({ children }: PropsWithChildren) => {
  const [isVolume, setIsVolume] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const audioShadowns = useAudio(WithinTheShadowsMP3, {
    loop: true,
    volume: 0.4,
  });

  useEffect(() => {
    if (!isClicked) {
      const getSoundEnable = getCookie(utilsConstants.SOUND_ENABLE_GLOBAL);

      const subscribe = () => {
        // default always enable
        if (!getSoundEnable?.length && audioShadowns) {
          audioShadowns.play();
          setIsVolume(true);
        }

        // the next time, we'll check again
        if (getSoundEnable === 'true' && audioShadowns) {
          audioShadowns.play();
          setIsVolume(true);
        }

        // marked window clicked
        setIsClicked(true);
      };

      window.addEventListener('click', subscribe);

      return () => {
        window.removeEventListener('click', subscribe);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClicked]);

  useEffect(() => {
    if (isVolume && audioShadowns) audioShadowns.play();

    if (!isVolume && audioShadowns) audioShadowns.pause();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVolume]);

  return (
    <VolumeContext.Provider
      value={{
        isVolume,
        setIsVolume,
      }}
    >
      <HStack
        position="fixed"
        inset="auto 0 0 auto"
        zIndex="dropdown"
        margin={4}
      >
        <Text
          color="shader.a.300"
          fontSize="sm"
          fontWeight="semibold"
          hidden={isClicked}
        >
          Click anywhere to enable sound.
        </Text>

        <IconButton
          width={9}
          height={9}
          aria-label="volume"
          icon={<Icon as={isVolume ? OnFill : OffFill} width={9} height={9} />}
          onClick={() => {
            setIsVolume(prev => {
              const isToggle = !prev;

              setCookie({
                key: utilsConstants.SOUND_ENABLE_GLOBAL,
                value: String(isToggle),
              });

              return isToggle;
            });
          }}
        />
      </HStack>

      {children}
    </VolumeContext.Provider>
  );
};
export const useAudioContext = () => {
  const { isVolume, setIsVolume } = useContext(VolumeContext);

  return {
    isVolume,
    setIsVolume,
  };
};
