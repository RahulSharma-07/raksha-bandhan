import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import type { GiftPageData } from '@/types/gift'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Basic format check — never expose which IDs exist vs. don't
  if (!id || typeof id !== 'string' || id.length < 8 || id.length > 64) {
    return NextResponse.json({ error: 'Gift not found.' }, { status: 404 })
  }

  try {
    const gift = await queryOne<{
      id: string
      sister_name: string
      brother_name: string
      message: string
      theme: string
      status: string
    }>('SELECT id, sister_name, brother_name, message, theme, status FROM gifts WHERE id = $1', [id])

    if (!gift || gift.status !== 'active') {
      return NextResponse.json({ error: 'Gift not found.' }, { status: 404 })
    }

    const images = await query<{ image_url: string; sort_order: number }>(
      'SELECT image_url, sort_order FROM gift_images WHERE gift_id = $1 ORDER BY sort_order ASC',
      [id]
    )

    // Increment view count (fire-and-forget, don't block response)
    query('UPDATE gifts SET view_count = view_count + 1 WHERE id = $1', [id]).catch(() => {})

    const data: GiftPageData = {
      id: gift.id,
      sister_name: gift.sister_name,
      brother_name: gift.brother_name,
      message: gift.message,
      theme: gift.theme,
      images,
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error('Gift retrieval error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
