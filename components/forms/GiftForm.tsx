'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { giftFormSchema, type GiftFormValues } from '@/lib/validation'
import ImageUploader from './ImageUploader'
import Spinner from '@/components/ui/Spinner'

export default function GiftForm() {
  const router = useRouter()
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imageError, setImageError] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string>('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GiftFormValues>({
    resolver: zodResolver(giftFormSchema),
  })

  const messageValue = watch('message', '')

  const onSubmit = async (data: GiftFormValues) => {
    setImageError('')
    setServerError('')

    if (imageFiles.length === 0) {
      setImageError('Please upload at least 1 photo.')
      return
    }
    if (imageFiles.length > 5) {
      setImageError('Maximum 5 photos allowed.')
      return
    }

    setSubmitting(true)

    const formData = new FormData()
    formData.append('sisterName', data.sisterName)
    formData.append('brotherName', data.brotherName)
    formData.append('message', data.message)
    imageFiles.forEach((f) => formData.append('images', f))

    try {
      const res = await fetch('/api/gifts', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok) {
        setServerError(json.error ?? 'Something went wrong — please try again.')
        return
      }

      router.push(`/success/${json.id}`)
    } catch {
      setServerError('Something went wrong — please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">
      {/* Sister's Name */}
      <div>
        <label
          htmlFor="sisterName"
          className="block text-xl font-semibold mb-2"
          style={{ fontFamily: 'Playfair Display, serif', color: '#4A2C1D' }}
        >
          Sister&apos;s Name
        </label>
        <input
          id="sisterName"
          type="text"
          placeholder="Enter her beautiful name…"
          className={`gift-input ${errors.sisterName ? 'error' : ''}`}
          aria-describedby={errors.sisterName ? 'sisterName-error' : undefined}
          {...register('sisterName')}
        />
        {errors.sisterName && (
          <p id="sisterName-error" className="mt-1 text-sm text-[#B5544B]" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {errors.sisterName.message}
          </p>
        )}
      </div>

      {/* Your Name */}
      <div>
        <label
          htmlFor="brotherName"
          className="block text-xl font-semibold mb-2"
          style={{ fontFamily: 'Playfair Display, serif', color: '#4A2C1D' }}
        >
          Your Name
        </label>
        <input
          id="brotherName"
          type="text"
          placeholder="How she calls you…"
          className={`gift-input ${errors.brotherName ? 'error' : ''}`}
          aria-describedby={errors.brotherName ? 'brotherName-error' : undefined}
          {...register('brotherName')}
        />
        {errors.brotherName && (
          <p id="brotherName-error" className="mt-1 text-sm text-[#B5544B]" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {errors.brotherName.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <label
            htmlFor="message"
            className="block text-xl font-semibold"
            style={{ fontFamily: 'Playfair Display, serif', color: '#4A2C1D' }}
          >
            Your Heartfelt Message
          </label>
          <span className="text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: '#8A7863' }}>
            {messageValue.length}/1000
          </span>
        </div>
        <textarea
          id="message"
          rows={6}
          placeholder="Write a note that speaks from the heart…"
          className={`gift-input resize-y min-h-[140px] ${errors.message ? 'error' : ''}`}
          aria-describedby={errors.message ? 'message-error' : undefined}
          style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', lineHeight: '1.6' }}
          {...register('message')}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-[#B5544B]" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Photo Upload */}
      <div>
        <label
          className="block text-xl font-semibold mb-1"
          style={{ fontFamily: 'Playfair Display, serif', color: '#4A2C1D' }}
        >
          Memory Gallery
        </label>
        <p className="text-sm mb-3" style={{ fontFamily: 'Poppins, sans-serif', color: '#8A7863' }}>
          Add 1–5 favourite photos that tell your story together.
        </p>
        <ImageUploader
          files={imageFiles}
          onChange={setImageFiles}
          error={imageError}
        />
      </div>

      {/* Server error */}
      {serverError && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            background: 'rgba(181,84,75,0.08)',
            border: '1px solid rgba(181,84,75,0.3)',
            color: '#B5544B',
            fontFamily: 'Nunito, sans-serif',
          }}
          role="alert"
        >
          {serverError}
        </div>
      )}

      {/* Submit */}
      <div className="pt-2 text-center">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full sm:w-auto sm:min-w-[220px]"
          aria-busy={submitting}
        >
          {submitting ? (
            <>
              <Spinner size="sm" className="text-white" />
              Creating your gift…
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create My Gift
            </>
          )}
        </button>
      </div>
    </form>
  )
}
