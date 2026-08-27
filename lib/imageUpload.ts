import { createClient } from '@supabase/supabase-js'

const BUCKET = 'gift-images'

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local')
  }
  return createClient(url, key)
}

/** Ensure the bucket exists — creates it if missing */
async function ensureBucket() {
  const supabase = getSupabaseAdmin()

  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) throw new Error(`Could not list buckets: ${listError.message}`)

  const exists = buckets?.some((b) => b.name === BUCKET)
  if (!exists) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB per file
    })
    if (createError) throw new Error(`Could not create bucket: ${createError.message}`)
    console.log(`Created Supabase Storage bucket: ${BUCKET}`)
  }
}

export interface UploadedImage {
  url: string
  public_id: string
  width: number
  height: number
}

/**
 * Upload a single image buffer to Supabase Storage.
 * Returns the public CDN URL.
 */
export async function uploadImageToSupabase(
  buffer: Buffer,
  giftId: string,
  fileName: string,
  index: number
): Promise<UploadedImage> {
  const supabase = getSupabaseAdmin()

  const ext = fileName.split('.').pop()?.toLowerCase() ?? 'jpg'
  const storagePath = `${giftId}/photo_${index}.${ext}`

  const contentType =
    ext === 'png' ? 'image/png' :
    ext === 'webp' ? 'image/webp' :
    ext === 'gif' ? 'image/gif' :
    'image/jpeg'

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType, upsert: true })

  if (error) throw new Error(`Supabase upload failed: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

  return {
    url: data.publicUrl,
    public_id: storagePath,
    width: 0,
    height: 0,
  }
}

/**
 * Upload multiple images to Supabase Storage.
 * Auto-creates the bucket if it doesn't exist.
 */
export async function uploadImages(
  files: { buffer: Buffer; name: string }[],
  giftId: string
): Promise<UploadedImage[]> {
  await ensureBucket()

  const results: UploadedImage[] = []
  for (let i = 0; i < files.length; i++) {
    const result = await uploadImageToSupabase(files[i].buffer, giftId, files[i].name, i)
    results.push(result)
  }
  return results
}
