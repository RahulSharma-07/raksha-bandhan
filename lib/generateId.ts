import { nanoid } from 'nanoid'

/**
 * Generates a cryptographically random, URL-safe ID (21 chars by default, using 16+).
 * Uses nanoid which relies on crypto.getRandomValues — truly unguessable.
 */
export function generateGiftId(): string {
  return nanoid(21)
}
