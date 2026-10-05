-- Read-only, curated view for the student starter repo (dsa-student-starter).
-- Students use the anon key, so this view is the ONLY thing they should be able
-- to read. It exposes a small, public-safe column subset of watch_projects and
-- leaves out source_context, announcement_sources, and every evidence/lease table.
--
-- The view runs with its owner's privileges (no security_invoker), so anon does
-- not need any grant or RLS policy on watch_projects itself.

CREATE OR REPLACE VIEW public.student_projects AS
SELECT
  id,
  canonical_name AS name,
  county,
  city,
  project_status AS status,
  lat,
  lon,
  announced_at
FROM public.watch_projects
WHERE state = 'TX'
  AND site_type = 'data_center'
  AND lat IS NOT NULL
  AND lon IS NOT NULL;

-- Supabase default privileges grant ALL on new public objects to anon and
-- authenticated. Reset to SELECT only.
REVOKE ALL ON public.student_projects FROM anon, authenticated;
GRANT SELECT ON public.student_projects TO anon, authenticated;

COMMENT ON VIEW public.student_projects IS
  'Public read-only project list for the student starter repo. Do not add internal columns.';
