import { createClient } from '@/lib/supabase/server'
import DashboardClient from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: accounts } = await supabase
    .from('tracked_accounts')
    .select('*, metric_snapshots(id, followers, following, captured_at)')
    .order('sort_order', { ascending: true })
    .order('added_at', { ascending: true })

  return <DashboardClient initialAccounts={accounts ?? []} />
}
