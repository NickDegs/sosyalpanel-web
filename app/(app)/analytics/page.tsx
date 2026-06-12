import { createClient } from '@/lib/supabase/server'
import AnalyticsClient from '@/components/analytics/AnalyticsClient'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: accounts } = await supabase
    .from('tracked_accounts')
    .select('*, metric_snapshots(id, followers, following, captured_at)')
    .order('sort_order', { ascending: true })

  return <AnalyticsClient initialAccounts={accounts ?? []} />
}
