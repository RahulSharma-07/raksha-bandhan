import { NextRequest, NextResponse } from 'next/server'
import { generateGiftId } from '@/lib/generateId'
import { sanitizeText } from '@/lib/sanitize'
import { uploadImages } from '@/lib/imageUpload'
import { query } from '@/lib/db'
import { checkRateLimit } from '@/lib/rateLimit'
import {
  VALID_IMAGE_MIME_TYPES,
  MAX_IMAGES,
  MIN_IMAGES,
  MAX_TEXT_LENGTH,
  MAX_NAME_LENGTH,
} from '@/lib/validation'

// Max body size: 5 images × 5MB + form fields
export const maxDuration = 30

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}

export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const ip = getClientIp(req)
  const rateLimitResult = await checkRateLimit(ip)
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "You're creating gifts a little too fast — please wait a few minutes and try again." },
      { status: 429 }
    )
  }

  // 2. Parse multipart form data
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  const sisterName = formData.get('sisterName') as string | null
  const brotherName = formData.get('brotherName') as string | null
  const message = formData.get('message') as string | null
  const imageFiles = formData.getAll('images') as File[]

  // 3. Validate text fields
  if (!sisterName?.trim()) {
    return NextResponse.json({ error: "Sister's name is required." }, { status: 400 })
  }
  if (!brotherName?.trim()) {
    return NextResponse.json({ error: "Your name is required." }, { status: 400 })
  }
  if (!message?.trim()) {
    return NextResponse.json({ error: "Please write a message." }, { status: 400 })
  }
  if (sisterName.trim().length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: "Name must be under 100 characters." }, { status: 400 })
  }
  if (brotherName.trim().length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: "Name must be under 100 characters." }, { status: 400 })
  }
  if (message.trim().length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: "Message must be under 1000 characters." }, { status: 400 })
  }

  // 4. Validate images
  if (!imageFiles || imageFiles.length < MIN_IMAGES) {
    return NextResponse.json(
      { error: 'Please upload at least 1 photo.' },
      { status: 400 }
    )
  }
  if (imageFiles.length > MAX_IMAGES) {
    return NextResponse.json(
      { error: 'You can upload a maximum of 5 photos.' },
      { status: 400 }
    )
  }

  // 5. Server-side file type validation (MIME type, not just extension)
  const MAX_FILE_SIZE = 5 * 1024 * 1024
  const fileBuffers: { buffer: Buffer; name: string }[] = []

  for (const file of imageFiles) {
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `"${file.name}" is too large. Each photo must be under 5MB.` },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Check actual file signature (magic bytes) for common image formats
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50
    const isGif = buffer[0] === 0x47 && buffer[1] === 0x49
    const isWebp = buffer[8] === 0x57 && buffer[9] === 0x45 // "WE" in WEBP header

    if (!isJpeg && !isPng && !isGif && !isWebp && !VALID_IMAGE_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `"${file.name}" is not a supported image type.` },
        { status: 400 }
      )
    }

    fileBuffers.push({ buffer, name: file.name })
  }

  // 6. Sanitize text inputs
  const cleanSisterName = sanitizeText(sisterName.trim())
  const cleanBrotherName = sanitizeText(brotherName.trim())
  const cleanMessage = sanitizeText(message.trim())

  // 7. Generate unique ID (with collision retry)
  let giftId = generateGiftId()
  let retries = 0
  while (retries < 3) {
    const existing = await query('SELECT id FROM gifts WHERE id = $1', [giftId])
    if (existing.length === 0) break
    giftId = generateGiftId()
    retries++
  }

  // 8. Upload images to Supabase Storage
  let uploadedImages
  try {
    uploadedImages = await uploadImages(fileBuffers, giftId)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Image upload error:', message)
    return NextResponse.json(
      { error: `Photo upload failed: ${message}` },
      { status: 502 }
    )
  }

  // 9. Save gift + images to database (in a transaction)
  try {
    await query(
      `INSERT INTO gifts (id, sister_name, brother_name, message, theme, status)
       VALUES ($1, $2, $3, $4, 'brown', 'active')`,
      [giftId, cleanSisterName, cleanBrotherName, cleanMessage]
    )

    for (let i = 0; i < uploadedImages.length; i++) {
      await query(
        `INSERT INTO gift_images (gift_id, image_url, sort_order)
         VALUES ($1, $2, $3)`,
        [giftId, uploadedImages[i].url, i]
      )
    }
  } catch (err) {
    console.error('Database error:', err)
    return NextResponse.json(
      { error: 'Something went wrong — please try again.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ id: giftId, success: true }, { status: 201 })
}
