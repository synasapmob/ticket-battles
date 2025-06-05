import { InfiniteData } from '@tanstack/query-core';
import { BigNumber } from 'bignumber.js';

import utilsConstants from './utils.constants';
import getQueryClient from './utils.queryClient';

import colors from 'theme/colors';
import { IPFSDataType } from 'types';

/** 
  @function convertHex(color: string, opacity: number)
    - Ex: input = "#ffffff"
          opacity = 0.5
    - https://stackoverflow.com/a/7018987/16151303
    - summary:
        get position elements necessary 
        convert to 'base 16'
        the latest adding alpha  
*/
export const convertHex = (color: string, opacity: number) => {
  const hexColorToRGBA = `${parseInt(color.substring(1, 3), 16)}, ${parseInt(
    color.substring(3, 5),
    16
  )}, ${parseInt(color.substring(5, 7), 16)}, ${opacity}`;

  return `rgba(${hexColorToRGBA})`;
};

/** 
  @function shorten(hash: string, length: number)
    - Ex: hash = 6 (123n to 6) 
          length = 2

    - summary:
      get length of input (hash)
      slice hash point start 0 that number will reviced 12 by input (hash)
      identifying where middle it needs "..." string now we've 12...
      step end slice at point last with recipe "123456".slice(-length) result should to be 56,
      right now, compound we will have result equal 12..56
*/
export const shorten = (hash: string, length = 6) => {
  const prefix = hash.slice(0, length);
  const middle = '...';
  const suffixed = hash.slice(-length);

  return prefix + middle + suffixed;
};

// handler throw error that'll easier to debug
export const throwError = (url: string, argument: Record<string, any>) => {
  for (const [key, value] of Object.entries(argument)) {
    if (!value) {
      if (process.env.NODE_ENV === 'development') {
        return `you need pass conditional ${key} to do this in ${url}`;
      }

      return `you need pass conditional ${key} to do this`;
    }
  }
};

// handler format number to be SI
export const formatUnitSI = (number: number) => {
  const digitsLowerBound = 1e3;

  /* 
    Explain number -1:
      we just format when number is more than 1M
      meaning 1M = 1,000,000 and else is 999,999....
  */
  const digitsBeFormat = 1e3 - 1;

  const map = new Map([
    ['K', 1e6],
    ['M', 1e9],
    ['B', 1e12],
    ['T', 1e15],
    ['E', 1e18],
    ['Z', 1e21],
  ]);

  // @ts-ignore
  for (const [key, value] of map) {
    if (number < value && number > digitsBeFormat) {
      const format = ((digitsLowerBound * number) / value)
        .toFixed(3)
        .replace(/\.0+$/, '');

      return `${format}${key}`;
    }
  }

  return number;
};

// handler format 1000 to be 1.000
export const formatNumber = (
  number: number,
  option?: Parameters<typeof Intl.NumberFormat>[1]
) => {
  const isFloat = number < 0.009;

  if (isFloat) return number;

  return new Intl.NumberFormat('en-US', option).format(number);
};

export const formatNumberDecimal = (number: number | string) => {
  const decimal = 10 ** 8;

  return BigNumber(number).dividedBy(decimal).toNumber();
};

// handler catch message
export const catchMessage = (error: any) => {
  console.log('catch error', error);

  // Nightly/Backpack throw
  if (typeof error?.error?.message === 'string') return error?.error?.message;
  if (typeof error?.error === 'string') return error?.error;
  if (typeof error?.name === 'string') return error?.name;

  if (error instanceof Error && error?.message?.length) {
    return error.message;
  }

  return error;
};

// handler check mobile
export const isMobile = () => {
  const regex = /iPhone|iPad|iPod|Android/i;

  return regex.test(navigator.userAgent);
};

// handler meta for @remix-run
export const parseMetadata = (
  params: Record<
    'openGraph' | 'twitter',
    {
      title: string;
      description: string;
      image?: {
        url: string;
        width?: number | string;
        height?: number | string;
      };
    }
  > &
    Partial<{
      title: string;
      description: string;
      icon: string;
    }>
) => {
  const mergeMetas = [];

  if (params?.title) {
    mergeMetas.push({
      title: params.title,
    });
  }

  if (params?.description) {
    mergeMetas.push({
      name: 'description',
      content: params.description,
    });
  }

  if (params?.icon) {
    mergeMetas.push({
      tagName: 'link',
      rel: 'icon',
      href: params.icon,
    });
  }

  if (params.twitter?.title) {
    mergeMetas.push({
      property: 'twitter:title',
      content: params.twitter.title,
    });
  }

  if (params.twitter?.description) {
    mergeMetas.push({
      property: 'twitter:description',
      content: params.twitter.description,
    });
  }

  if (params.twitter?.image?.url) {
    /* 
      Used with summary, summary_large_image, player cards......
      https://developer.x.com/en/docs/x-for-websites/cards/overview/markup 
    */
    mergeMetas.push(
      ...[
        {
          property: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          property: 'twitter:image',
          content: params.twitter.image.url,
        },
      ]
    );
  }

  if (params.twitter?.image?.width) {
    mergeMetas.push({
      property: 'twitter:image:width',
      content: params.twitter.image.width,
    });
  }

  if (params.twitter?.image?.height) {
    mergeMetas.push({
      property: 'twitter:image:height',
      content: params.twitter.image.height,
    });
  }

  if (params.openGraph?.title) {
    mergeMetas.push({
      property: 'og:title',
      content: params.openGraph.title,
    });
  }

  if (params.openGraph?.description) {
    mergeMetas.push({
      property: 'og:description',
      content: params.openGraph.description,
    });
  }

  if (params.openGraph?.image?.url) {
    mergeMetas.push({
      property: 'og:image',
      content: params.openGraph.image.url,
    });
  }

  if (params.openGraph?.image?.width) {
    mergeMetas.push({
      property: 'og:image:width',
      content: params.openGraph.image.width,
    });
  }

  if (params.openGraph?.image?.height) {
    mergeMetas.push({
      property: 'og:image:height',
      content: params.openGraph.image.height,
    });
  }

  return mergeMetas;
};

export const getNFTsByIPFS = async () => {
  const result: IPFSDataType[] = [];

  const lengBase = getQueryClient
    .getQueryData<InfiniteData<IPFSDataType>>(['create_nft_base'])
    ?.pages.flatMap(page => page).length;

  for (let i = 0; i < 10; i++) {
    try {
      /*
        should start with number + N to avoid dpulicate
        E.g:
          before: 1, 2, 3....
          after:  4, 5, 6...
      */
      const count = (lengBase || 0) + i;

      const request = await fetch(
        `${utilsConstants.IPFS_GATEWAY}${utilsConstants.IPFS_ENDPOINT}/${count}`
      );

      const parse: IPFSDataType = await request.json();

      // sabotages maybe make your application error when they're uploaded incorrect
      if (parse?.image) result.push(parse);
    } catch (error) {
      break;
    }
  }

  return result;
};

export const getColorOfRarity = (rarity: number) => {
  if (rarity >= 21) return convertHex(colors.accents.red, 0.15);

  if (rarity >= 16) return convertHex(colors.accents.yellow, 0.15);

  if (rarity >= 11) return convertHex(colors.accents.pink, 0.15);

  if (rarity >= 6) return convertHex(colors.accents.green, 0.15);

  return convertHex(colors.accents.cyan, 0.15);
};

export const getNameOfRarity = (rarity: number) => {
  if (rarity >= 21) return 'Legend';
  if (rarity >= 16) return 'Epic';
  if (rarity >= 11) return 'Rare';
  if (rarity >= 6) return 'Uncommon';

  return 'Common';
};

/* 
  - get sum of array and return total number 
    result [1, 2, 3] // 6
*/
export const sumNumber = (numbers: number[]) => {
  const NOT_NaN = 0;

  const instance = numbers.reduce(
    (prev, current) => (prev || NOT_NaN) + (current || NOT_NaN),
    NOT_NaN
  );

  return instance;
};

// handler refetch or do something but need wait for seconds
export const waitForSeconds = async (cb: () => void, seconds?: number) => {
  await new Promise(resolve => {
    setTimeout(() => {
      resolve('done');

      cb();
    }, seconds || 2000);
  });
};
