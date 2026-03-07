-- Create resources table for uploaded PDFs/files
CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'math',
  type text NOT NULL DEFAULT 'worksheet',
  file_url text,
  file_name text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Public can view resources
CREATE POLICY "Resources are publicly viewable"
  ON public.resources FOR SELECT
  USING (true);

-- Admins can manage resources
CREATE POLICY "Admins can manage resources"
  ON public.resources FOR ALL
  USING (has_role('admin'::app_role));

-- Create storage bucket for resource files
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true);

-- Storage policies: anyone can read, admins can upload/delete
CREATE POLICY "Public read access on resources bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resources');

CREATE POLICY "Admin upload to resources bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resources' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete from resources bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'resources' AND auth.role() = 'authenticated');