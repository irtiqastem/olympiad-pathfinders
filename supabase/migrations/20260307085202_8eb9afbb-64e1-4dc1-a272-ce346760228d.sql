
-- Fix: Drop the overly permissive "Public profiles viewable" policy
-- that exposes all user data to unauthenticated visitors
DROP POLICY IF EXISTS "Public profiles viewable" ON public.profiles;

-- Replace with a policy that only allows authenticated users to view profiles
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (true);
