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

type IconProps = { size?: number; className?: string }
const base = (p: IconProps) => ({
  viewBox: '0 0 24 24', width: p.size ?? 18, height: p.size ?? 18,
  fill: 'none' as const, stroke: 'currentColor', strokeWidth: 1.6,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className: p.className,
})

export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
export const BulbIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0012 3z" /></svg>
)
export const HashIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 9h14M5 15h14M9 4l-2 16M17 4l-2 16" /></svg>
)
export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /></svg>
)
