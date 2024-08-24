import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getAuthenticatedUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error('Error fetching user:', error);
    return null;
  }

  return user;
};
