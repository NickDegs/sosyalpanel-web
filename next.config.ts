import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Capacitor static export: set output: 'export'
  // PWA / Vercel: leave unset
  env: {
    NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL      ?? '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  },
};

export default nextConfig;
