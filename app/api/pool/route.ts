import fs from 'fs';

import { NextRequest, NextResponse } from 'next/server';

import { TypePoolEventPool } from 'types/types.pool';

const STORAGE_POOL_PATH = '/tmp/pool_cache.json';

export async function POST(req: NextRequest) {
  const participants: TypePoolEventPool = await req.json();

  fs.writeFileSync(STORAGE_POOL_PATH, JSON.stringify(participants, null, 2));

  return NextResponse.json(participants);
}

export async function GET() {
  if (fs.existsSync(STORAGE_POOL_PATH)) {
    const participants = fs.readFileSync(STORAGE_POOL_PATH).toString();

    return NextResponse.json(JSON.parse(participants));
  }

  return NextResponse.json(null);
}

export async function DELETE() {
  if (fs.existsSync(STORAGE_POOL_PATH)) {
    fs.rmdirSync(STORAGE_POOL_PATH);

    return NextResponse.json(true);
  }

  return NextResponse.json(false);
}
