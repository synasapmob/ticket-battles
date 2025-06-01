import fs from 'fs';

import { NextRequest, NextResponse } from 'next/server';

import { ticket_routes_remove_quantity } from '../ticket/route';

import { TypeNFTMetadata } from 'types/types.nft';
import { TypeTicketMetadata } from 'types/types.ticket';

const folder = 'data/nft';

// Generate a non-duplicate tokenId between 0–24
export function nft_routes_random_tokenId(tokenId?: number[]) {
  // Step 1: Create a Set of used tokenIds
  const usedTokenIds = new Set<number>(tokenId);

  // Step 2: Build a list of available tokenIds (0–24)
  const MAX_ID = 24;
  const availableIds = [];

  for (let i = 0; i <= MAX_ID; i++) {
    if (!usedTokenIds.has(i)) {
      availableIds.push(i);
    }
  }

  // Step 4: Pick a random available ID
  const randomIndex = Math.floor(Math.random() * availableIds.length);
  return availableIds[randomIndex];
}

export const nft_routes_readFile = async () => {
  if (!fs.existsSync(`${folder}/data.json`)) {
    return [];
  }

  const readFile: TypeNFTMetadata[] = JSON.parse(
    fs.readFileSync(`${folder}/data.json`).toString()
  );

  return readFile;
};

export const nft_routes_addFile = async (params: TypeNFTMetadata[]) => {
  // create folders
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  fs.writeFileSync(`${folder}/data.json`, JSON.stringify(params, null, 2));

  return params;
};

export async function POST(req: NextRequest) {
  const { owner, quantity } = await req.json();

  // remove my ticket
  ticket_routes_remove_quantity(owner, quantity);

  // just append
  for (let i = 0; i < quantity; i++) {
    if (fs.existsSync(`${folder}/data.json`)) {
      const readFile = await nft_routes_readFile();

      const newTokenId = nft_routes_random_tokenId(
        readFile.map(arg => arg.tokenId)
      );

      await nft_routes_addFile([
        ...readFile,
        {
          owner,
          tokenId: newTokenId,
          createdAt: new Date().toISOString(),
        },
      ]);
    } else {
      await nft_routes_addFile([
        {
          owner,
          tokenId: nft_routes_random_tokenId(),
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }

  return NextResponse.json({
    success: true,
  });
}

export async function GET() {
  if (!fs.existsSync(folder)) {
    return NextResponse.json([]);
  }

  const readFile: TypeTicketMetadata[] = JSON.parse(
    fs.readFileSync(`${folder}/data.json`).toString()
  );

  return NextResponse.json(readFile);
}

export async function PUT(req: NextRequest) {
  const { owner } = await req.json();

  if (!fs.existsSync(folder)) {
    return NextResponse.json(null);
  }

  const readFile: TypeTicketMetadata[] = JSON.parse(
    fs.readFileSync(`${folder}/data.json`).toString()
  );

  return NextResponse.json(readFile.find(arg => arg.owner === owner));
}
