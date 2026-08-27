import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic']

/** Text field schema for names */
export const nameSchema = z
  .string()
  .min(1, 'This field is required')
  .max(100, 'Name must be under 100 characters')
  .trim()

/** Personal message schema */
export const messageSchema = z
  .string()
  .min(1, 'Please write a message')
  .max(1000, 'Message must be under 1000 characters')
  .trim()

/** Client-side file validation schema (used with File objects) */
export const imageFileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= MAX_FILE_SIZE, 'Each photo must be under 5MB')
  .refine(
    (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
    'Only image files are supported (JPEG, PNG, WebP, GIF, HEIC)'
  )

/** Full form schema for client-side validation */
export const giftFormSchema = z.object({
  sisterName: nameSchema,
  brotherName: nameSchema,
  message: messageSchema,
})

export type GiftFormValues = z.infer<typeof giftFormSchema>

/** Server-side MIME type check (checks actual content type from buffer signature) */
export const VALID_IMAGE_MIME_TYPES = new Set(ACCEPTED_IMAGE_TYPES)

export const MAX_IMAGES = 5
export const MIN_IMAGES = 1
export const MAX_TEXT_LENGTH = 1000
export const MAX_NAME_LENGTH = 100
