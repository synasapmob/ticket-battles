import { ThemeOverride, ThemeTypings } from '@chakra-ui/react';

import colors from './colors';

import { convertHex } from 'utils';

const base: ThemeOverride = {
  colors,

  space: {
    11: '2.75rem',
  },

  sizes: {
    11: '2.75rem',
  },

  styles: {
    global: {
      body: {
        lineHeight: 'normal',

        '--chakra-colors-chakra-body-bg': colors.shader.a[900],
        '--chakra-colors-chakra-body-text': 'white',
      },

      '::-webkit-scrollbar-thumb': {
        bg: 'shader.a.400',
        borderRadius: '2rem',
      },

      '::-webkit-scrollbar': {
        bg: 'transparent',
        width: 1.5,
        height: 1.5,
      },

      '&::-webkit-scrollbar-corner': {
        width: 0,
        height: 0,
      },

      '#nprogress .bar': {
        bg: colors.accents.green,
        zIndex: 'tooltip',
      },
    },
  },

  components: {
    Button: {
      baseStyle: {
        justifyContent: 'flex-start',

        fontSize: 'sm',
        fontWeight: 'semibold',
        borderRadius: 'lg',

        color: 'white',
        height: 10,

        _disabled: {
          opacity: 0.35,
        },
      },

      variants: {
        dark: {
          width: 'full',
          px: 4,
          transitionDuration: 'slow',

          _hover: {
            bg: 'shader.a.500',
          },
        },
      },
    },

    NumberInput: {
      variants: {
        solid: {
          root: {
            display: 'flex',
            bg: 'shader.a.600',

            borderRadius: 'xl',
            border: '0.0625rem solid',
            borderColor: 'shader.a.500',
          },

          field: {
            height: 11,
            bg: 'transparent',

            color: 'white',
            fontWeight: 'semibold',
            textAlign: 'center',

            paddingRight: 2,
            paddingLeft: 2,
          },

          stepper: {
            bg: 'transparent',
            border: 'unset',

            minWidth: 11,
            height: 11,

            _first: {
              borderRadius: 'unset',
              borderRight: '0.0625rem solid',
              borderColor: 'shader.a.500',
            },

            _last: {
              borderRadius: 'unset',
              borderLeft: '0.0625rem solid',
              borderColor: 'shader.a.500',
            },

            svg: {
              width: 5,
              height: 5,
              color: 'white',
            },
          },
        },
      },
    },

    Modal: {
      baseStyle: {
        dialog: {
          mx: 4,
        },

        closeButton: {
          width: 5,
          height: 5,

          color: 'white',

          svg: {
            width: 2.5,
            height: 2.5,
          },
        },
      },

      variants: {
        blur: {
          overlay: {
            backdropFilter: 'blur(3.125rem)',
            bg: convertHex('#000000', 0.65),
          },

          dialog: {
            bg: 'transparent',
          },
        },

        shadow: {
          dialog: {
            maxWidth: 96,
            boxShadow: `0px 0px 20px 0px ${convertHex('#000000', 0.15)}`,
            bg: colors.shader.a[800],

            borderRadius: 'lg-2',
            border: '0.0625rem solid',
            borderColor: 'shader.a.500',

            overflow: 'hidden',
            position: 'relative',
          },
        },
      },
    },

    Skeleton: {
      baseStyle: {
        borderRadius: 'lg',
        '--skeleton-start-color': colors.shader.a[500],
        '--skeleton-end-color': convertHex(colors.shader.a[400], 0.35),
      },
    },
  },

  fonts: {
    heading: `'Red Rose Variable', system-ui`,
    body: `'Red Rose Variable', system-ui`,
  },
};

export default base as ThemeOverride<ThemeTypings>;
