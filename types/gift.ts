export interface Gift {
  id: string
  sister_name: string
  brother_name: string
  message: string
  theme: string
  created_at: string
  expires_at: string | null
  view_count: number
  status: 'active' | 'flagged' | 'removed'
}

export interface GiftImage {
  id: string
  gift_id: string
  image_url: string
  sort_order: number
  created_at: string
}

export interface GiftWithImages extends Gift {
  images: GiftImage[]
}

export interface CreateGiftPayload {
  sisterName: string
  brotherName: string
  message: string
  images: File[]
}

export interface CreateGiftResponse {
  id: string
  success: boolean
}

export interface GiftPageData {
  id: string
  sister_name: string
  brother_name: string
  message: string
  theme: string
  images: { image_url: string; sort_order: number }[]
}
