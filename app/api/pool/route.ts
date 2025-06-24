import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

import { TypePoolEventPool } from 'types/types.pool';

const PATH_POOL = path.resolve('.next/pool');
const PATH_CACHE = 'cache.json';

export async function POST(req: NextRequest) {
  const participants: TypePoolEventPool = await req.json();

  if (!fs.existsSync(PATH_POOL)) fs.mkdirSync(PATH_POOL);

  fs.writeFileSync(
    `${PATH_POOL}/${PATH_CACHE}`,
    JSON.stringify(participants, null, 2)
  );

  return NextResponse.json(participants);
}

export async function GET() {
  if (fs.existsSync(`${PATH_POOL}/${PATH_CACHE}`)) {
    const participants = fs
      .readFileSync(`${PATH_POOL}/${PATH_CACHE}`)
      .toString();

    return NextResponse.json(JSON.parse(participants));
  }

  return NextResponse.json(null);
}

export async function DELETE() {
  fs.rm(
    PATH_POOL,
    {
      recursive: true,
      force: true,
    },
    () => {}
  );

  return NextResponse.json(true);
}
