'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { InstallBanner } from '@/components/pwa/InstallBanner'

const NAV = [
  { href: '/dashboard',  label: 'Genel',    icon: GridIcon    },
  { href: '/analytics',  label: 'Analiz',   icon: ChartIcon   },
  { href: '/compose',    label: 'Paylaş',   icon: PenIcon     },
  { href: '/tips',       label: 'Öneriler', icon: LightIcon   },
  { href: '/settings',   label: 'Ayarlar',  icon: GearIcon    },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()

  return (
    <div className="min-h-screen flex" style={{ background: '#06030F' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 50% at 15% 10%, rgba(124,58,237,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 80%, rgba(29,78,216,0.14) 0%, transparent 60%)'
        }} />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen border-r border-white/[0.06] glass fixed top-0 left-0 bottom-0 z-30">
        {/* Logo */}
        <div className="px-5 py-6 flex items-center gap-3 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #A855F7, #3B82F6)' }}>
            <span className="text-white font-black text-sm">SP</span>
          </div>
          <span className="text-white font-semibold text-[15px]">Social Panel</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path === href || path.startsWith(href + '/')
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                }`}>
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${active ? 'text-violet-400' : 'group-hover:text-white/70'}`} />
                <span className="text-[14px] font-medium">{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-6 text-[11px] text-white/20 text-center">
          realvirtuality.app
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-60 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      <InstallBanner />

      {/* Mobile Tab Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 safe-bottom glass border-t border-white/[0.06]">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path === href || path.startsWith(href + '/')
            return (
              <Link key={href} href={href}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-150"
              >
                <Icon className={`w-6 h-6 transition-colors ${active ? 'text-violet-400' : 'text-white/40'}`} />
                <span className={`text-[10px] font-medium transition-colors ${active ? 'text-violet-400' : 'text-white/40'}`}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

function GridIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
}
function ChartIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M3 20h18M6 20V10m4 10V6m4 14v-4m4 4V3"/></svg>
}
function PenIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
}
function LightIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
}
function GearIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
}
