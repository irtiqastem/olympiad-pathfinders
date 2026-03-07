-- Drop and recreate has_role to use auth.uid() internally
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = _role
  )
$$;

-- Update all RLS policies that call has_role with two args to use one arg

DROP POLICY IF EXISTS "Admins can manage posts" ON public.blog_posts;
CREATE POLICY "Admins can manage posts" ON public.blog_posts FOR ALL USING (has_role('admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage problems" ON public.problems;
CREATE POLICY "Admins can manage problems" ON public.problems FOR ALL USING (has_role('admin'::app_role));

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (has_role('admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage scholarships" ON public.scholarships;
CREATE POLICY "Admins can manage scholarships" ON public.scholarships FOR ALL USING (has_role('admin'::app_role));

DROP POLICY IF EXISTS "Admins can view all submissions" ON public.submissions;
CREATE POLICY "Admins can view all submissions" ON public.submissions FOR SELECT USING (has_role('admin'::app_role));

DROP POLICY IF EXISTS "Admins can update submissions" ON public.submissions;
CREATE POLICY "Admins can update submissions" ON public.submissions FOR UPDATE USING (has_role('admin'::app_role));