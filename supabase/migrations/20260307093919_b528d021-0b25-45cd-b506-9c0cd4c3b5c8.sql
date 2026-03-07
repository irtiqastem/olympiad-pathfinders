DROP POLICY "Users can submit" ON public.submissions;
CREATE POLICY "Users can submit"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');