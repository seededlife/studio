import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginPage from '@/components/auth/login-page';

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return <LoginPage />;
}
