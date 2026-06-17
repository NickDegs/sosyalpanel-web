// Editorial UI glyph'leri — emoji yerine ince çizgili SVG ikonlar.

export function ChartGlyph({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth={1.4} className={className}
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 40h32" />
      <path d="M8 40V8" />
      <path d="M14 40V28" />
      <path d="M22 40V20" />
      <path d="M30 40V24" />
      <path d="M38 40V14" />
      <path d="M13 24l8-8 6 4 9-12" opacity="0.55" />
    </svg>
  )
}

export function CloseIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth={1.8} className={className}
      strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function CheckIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth={2.4} className={className}
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}
