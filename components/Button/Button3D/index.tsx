import {
  Box,
  Button,
  ButtonProps,
  forwardRef,
  Spinner,
} from '@chakra-ui/react';

import colors from 'theme/colors';

interface Button3DProps extends Partial<ButtonProps> {
  shape: 'green' | 'sky' | 'black' | 'purple';
}

export default forwardRef<Button3DProps, 'button'>((props, ref) => {
  const GetVariant = {
    green: [
      'linear-gradient(180deg, #FFFFFB 0%, #443D24 100%)',
      'linear-gradient(180deg, #89E961 0%, #004009 100%)',
      'linear-gradient(180deg, #228729 0%, #006016 50%, #228729 100%)',
    ],

    sky: [
      'linear-gradient(180deg, #FFFFFB 0%, #443D24 100%)',
      'linear-gradient(180deg, #80E7FF 0%, #006BA8 100%)',
      'linear-gradient(180deg, #00B4DB 0%, #0080A8 50%, #00B4DB 100%)',
    ],

    black: [
      'linear-gradient(180deg, #FFFFFB 0%, #443D24 100%)',
      'linear-gradient(180deg, #717285 0%, #17181C 100%)',
      colors.shader.a[500],
    ],

    purple: [
      'linear-gradient(180deg, #FFFFFB 0%, #443D24 100%)',
      'linear-gradient(180deg, #DBAEFF 0%, #6C00FA 100%)',
      'linear-gradient(180deg, #9747FF 0%, #6C00FA 50%, #9747FF 100%)',
    ],
  };

  const GetBoxGradient = () => {
    return [...Array(3)].map((_, index) => (
      <Box
        key={index}
        zIndex={index}
        bg={GetVariant[props.shape][index]}
        position="absolute"
        borderRadius="inherit"
        inset={0}
        margin={(function () {
          if (index === 1) return '0.09375rem';
          if (index === 2) return '0.3125rem';

          return undefined;
        })()}
      />
    ));
  };

  const INDEX_ELEMENT = 3;

  return (
    <Button
      ref={ref}
      px={4}
      borderRadius="3xl"
      position="relative"
      transitionDuration="slow"
      _hover={{
        opacity: 0.65,
      }}
      _loading={{
        '.chakra-button__spinner': {
          margin: 'unset',
          position: 'absolute',
          borderRadius: 'inherit',
          inset: 0,
        },
      }}
      spinner={
        <>
          <GetBoxGradient />

          <Spinner width={4} height={4} zIndex={INDEX_ELEMENT} margin="auto" />
        </>
      }
      {...props}
    >
      <GetBoxGradient />

      <Box position="relative" zIndex={INDEX_ELEMENT}>
        {props?.children}
      </Box>
    </Button>
  );
});
