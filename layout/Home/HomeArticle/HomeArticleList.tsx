import { Box, HStack, Icon, Image, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';

import SoundWrapper from 'components/SoundWrapper';
import Banner1WEBP from 'public/banner/banner_1.webp';
import Banner2WEBP from 'public/banner/banner_2.webp';
import Banner3WEBP from 'public/banner/banner_3.webp';
import BattleFill from 'public/fill/battle.svg';
import FoundryFill from 'public/fill/foundry.svg';
import NFTFill from 'public/fill/nft.svg';
import PlayFill from 'public/fill/play.svg';

interface ListHomeProps {
  heading: string;
  body: string;
  bottom: string;
  href: string;

  variant: {
    color: string;
    icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    banner: string;
    linear: {
      default: string;
      hover: string;
    };
  };
}

interface HomeArticleListProps {
  hover: number | undefined;
  setHover: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default ({ hover, setHover }: HomeArticleListProps) => {
  const ListHome: ListHomeProps[] = [
    {
      heading: 'Foundry',
      body: `Swap your ticket to receive an NFT.
      This is your main reward exchange zone.
      Don't miss your chance to forge something rare!`,
      bottom: 'Get Started',
      href: '/foundry',
      variant: {
        color: 'accents.green',
        icon: FoundryFill,
        banner: Banner1WEBP.src,
        linear: {
          default:
            'linear-gradient(-270deg, rgba(137, 233, 97, 0.1) 0%, rgba(137, 233, 97, 0) 100%)',
          hover:
            'linear-gradient(-270deg, rgba(137, 233, 97, 0.25) 0%, rgba(137, 233, 97, 0) 100%)',
        },
      },
    },
    {
      heading: 'Battles',
      body: `Join fun, randomized games to win NFTs.
      Each battle gives you a shot at something cool.
      It’s luck, strategy — and a little chaos.`,
      bottom: 'Get Started',
      href: '/pool',

      variant: {
        color: 'accents.pink',
        icon: BattleFill,
        banner: Banner2WEBP.src,
        linear: {
          default:
            'linear-gradient(-270deg, rgba(219, 174, 255, 0.1) 0%, rgba(219, 174, 255, 0) 100%)',
          hover:
            'linear-gradient(-270deg, rgba(219, 174, 255, 0.25) 0%, rgba(219, 174, 255, 0) 100%)',
        },
      },
    },
    {
      heading: 'Discover NFTs',
      body: `View your unlocked and locked NFTs.
      Check the rarity: Common, Rare, Epic, or more.
      A quick way to explore what you’ve collected.`,
      bottom: 'Discover now',
      href: '/discover',

      variant: {
        color: 'accents.cyan',
        icon: NFTFill,
        banner: Banner3WEBP.src,
        linear: {
          default:
            'linear-gradient(-270deg, rgba(139, 171, 220, 0.1) 0%, rgba(219, 174, 255, 0) 100%)',
          hover:
            'linear-gradient(-270deg, rgba(139, 171, 220, 0.25) 0%, rgba(139, 171, 220, 0) 100%)',
        },
      },
    },
  ];

  return (
    <Stack
      spacing={4}
      flexBasis={{
        lg: '40%',
      }}
    >
      {ListHome.map((meta, index) => (
        <Link key={meta.heading} href={meta.href} prefetch={true}>
          <SoundWrapper
            display="flex"
            bg="shader.a.800"
            borderRadius="xl"
            boxShadow="0px 4px 15px 0px #00000026"
            position="relative"
            overflow="hidden"
            role="group"
            transitionDuration="faster"
            borderLeft={`0 solid`}
            borderColor={meta.variant.color}
            flexDirection={{
              base: 'column',
              sm: 'row',
            }}
            _hover={{
              borderLeftWidth: '0.25rem',
            }}
            onMouseOver={() => {
              if (index !== hover) setHover(index);
            }}
            onMouseLeave={() => {
              setHover(undefined);
            }}
          >
            <Stack
              padding={6}
              paddingRight={5}
              spacing={4}
              flex={1}
              position="relative"
            >
              <Box
                pr={5}
                inset={0}
                position="absolute"
                pointerEvents="none"
                transitionDuration="normal"
                bg={meta.variant.linear.default}
                _groupHover={{
                  bg: meta.variant.linear.hover,
                }}
              />

              <Stack>
                <HStack flexWrap="wrap" color={meta.variant.color}>
                  <Icon as={meta.variant.icon} width={5} height={5} />

                  <Text fontSize="xl" fontWeight="bold">
                    {meta.heading}
                  </Text>
                </HStack>

                <Text color="shader.a.200">{meta.body}</Text>
              </Stack>

              <HStack spacing={1} color="white">
                <Icon
                  as={PlayFill}
                  width={0}
                  height={4}
                  transitionDuration="normal"
                  _groupHover={{
                    width: 4,
                  }}
                />

                <Text fontWeight="medium">{meta.bottom}</Text>
              </HStack>
            </Stack>

            <Box position="relative" overflow="hidden">
              <Box
                bg="linear-gradient(270deg, rgba(23, 24, 28, 0) 0%, #17181C 100%)"
                position="absolute"
                width="50%"
                height="full"
                zIndex="docked"
              />

              <Image
                src={meta.variant.banner}
                alt={meta.variant.banner}
                objectFit="cover"
                height="full"
                width={{
                  base: '100%',
                  sm: '12.5rem',
                }}
              />
            </Box>
          </SoundWrapper>
        </Link>
      ))}
    </Stack>
  );
};
