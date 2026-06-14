import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size } = await params
  const s = Math.min(Math.max(parseInt(size) || 512, 16), 1024)
  const r = Math.round(s * 0.22)
  const fs = Math.round(s * 0.42)

  return new ImageResponse(
    (
      <div
        style={{
          width: s,
          height: s,
          background: 'linear-gradient(135deg, #A855F7 0%, #3B82F6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: r,
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: fs,
            fontWeight: 900,
            letterSpacing: '-2px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          SP
        </span>
      </div>
    ),
    { width: s, height: s }
  )
}
