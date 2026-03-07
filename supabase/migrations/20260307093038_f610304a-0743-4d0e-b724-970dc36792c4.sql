CREATE POLICY "deny_insert_user_roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (false);