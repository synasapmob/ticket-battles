import fs from 'fs';

import { NextRequest, NextResponse } from 'next/server';

import { TypeTicketMetadata } from 'types/types.ticket';

const folder = 'data/ticket';

export const ticket_routes_remove_quantity = (
  owner: string,
  quantity: number
) => {
  const readFile: TypeTicketMetadata[] = JSON.parse(
    fs.readFileSync(`data/ticket/data.json`).toString()
  );

  readFile.map(arg => arg.owner === owner && (arg.quantity -= quantity * 10));

  fs.writeFileSync(`data/ticket/data.json`, JSON.stringify(readFile, null, 2));

  return readFile;
};

export async function POST(req: NextRequest) {
  const { owner, quantity } = await req.json();

  const params: TypeTicketMetadata = {
    owner,
    quantity,
    createdAt: new Date().toISOString(),
  };

  // create folders
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  // just append
  if (fs.existsSync(`${folder}/data.json`)) {
    const readFile: TypeTicketMetadata[] = JSON.parse(
      fs.readFileSync(`${folder}/data.json`).toString()
    );

    const isExisted = readFile.some(arg => arg.owner === owner);
    if (isExisted) {
      readFile.map(arg => arg.owner === owner && (arg.quantity += quantity));
    } else {
      readFile.push(params);
    }

    fs.writeFileSync(`${folder}/data.json`, JSON.stringify(readFile, null, 2));
  } else {
    // append new files
    fs.writeFileSync(`${folder}/data.json`, JSON.stringify([params], null, 2));
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
