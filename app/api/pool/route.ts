import fs from 'fs';

import { NextRequest, NextResponse } from 'next/server';

import {
  nft_routes_addFile,
  nft_routes_random_tokenId,
  nft_routes_readFile,
} from '../nft/route';

import { TypePoolMetadata } from 'types/types.pool';

const folder = 'data/pool';

export async function POST(req: NextRequest) {
  const { owner } = await req.json();

  // create folders
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, {
      recursive: true,
    });
  }

  // just append
  if (fs.existsSync(`${folder}/data.json`)) {
    const readFile: TypePoolMetadata[] = [
      ...JSON.parse(fs.readFileSync(`${folder}/data.json`).toString()),
      {
        owner,
      },
    ];

    // check if owner already to play
    const ENOUGH_CONDITION_PLAY = 1;

    if (readFile.length - 1 >= ENOUGH_CONDITION_PLAY) {
      const random = Math.floor(Math.random() * ENOUGH_CONDITION_PLAY);

      const who_win = readFile[random].owner;
      const get_nfts = await nft_routes_readFile();
      const random_nfts = nft_routes_random_tokenId(
        get_nfts.map(arg => arg.tokenId)
      );

      await nft_routes_addFile([
        ...get_nfts,
        {
          owner: who_win,
          tokenId: random_nfts,
          createdAt: new Date().toISOString(),
        },
      ]);

      fs.rmdirSync(folder, {
        recursive: true,
      });

      return NextResponse.json({
        success: true,
        winner: who_win,
      });
    }

    fs.writeFileSync(`${folder}/data.json`, JSON.stringify(readFile, null, 2));
  } else {
    // append new files
    fs.writeFileSync(
      `${folder}/data.json`,
      JSON.stringify([{ owner }], null, 2)
    );
  }

  return NextResponse.json({
    success: true,
  });
}

export async function GET() {
  if (!fs.existsSync(folder)) {
    return NextResponse.json([]);
  }

  const readFile: TypePoolMetadata[] = JSON.parse(
    fs.readFileSync(`${folder}/data.json`).toString()
  );

  return NextResponse.json(readFile);
}
