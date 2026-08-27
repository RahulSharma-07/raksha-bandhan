'use client'

import { useState } from 'react'

interface ReportButtonProps {
  giftId: string
}

export default function ReportButton({ giftId }: ReportButtonProps) {
  const [reported, setReported] = useState(false)
  const [reporting, setReporting] = useState(false)

  const handleReport = async () => {
    if (reported) return
    const confirmed = window.confirm(
      'Report this page? Our team will review it and take action if it violates our guidelines.'
    )
    if (!confirmed) return

    setReporting(true)
    try {
      await fetch(`/api/report/${giftId}`, { method: 'POST' })
      setReported(true)
    } catch {
      // Fail silently — don't expose internals
    } finally {
      setReporting(false)
    }
  }

  return (
    <div className="flex justify-center py-4" style={{ background: '#FFF8F0' }}>
      <button
        onClick={handleReport}
        disabled={reported || reporting}
        className="text-xs text-[#8A7863] hover:text-[#5A4433] transition-colors disabled:opacity-50"
        style={{ fontFamily: 'Nunito, sans-serif' }}
        aria-label="Report this page"
      >
        {reported ? '✓ Reported — thank you' : reporting ? 'Reporting…' : 'Report this page'}
      </button>
    </div>
  )
}
