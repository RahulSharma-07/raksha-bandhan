import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id || typeof id !== 'string' || id.length < 8) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  try {
    await query(
      "UPDATE gifts SET status = 'flagged' WHERE id = $1 AND status = 'active'",
      [id]
    )
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Report error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
