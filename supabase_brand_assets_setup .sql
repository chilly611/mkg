-- =====================================================================
-- THE KNOWLEDGE GARDENS — BRAND ASSETS SUPABASE SETUP
-- =====================================================================
-- Purpose: Provision the shared `brand-assets` Storage bucket and the
-- `brand_assets` metadata table so every garden frontend (OKG / BKG /
-- HKG / TKG / MKG / Garden Wars) can reference umbrella visual assets
-- by canonical CDN URL.
--
-- Run order:
--   1. This entire script in the Supabase SQL Editor (browser)
--   2. Then upload assets to the bucket from /home/claude/assets/
--      via Supabase CLI / Studio / your CI pipeline
--   3. Then run the INSERTs at the bottom to register metadata
--
-- Apply via Supabase SQL Editor, NOT JS client (DDL constraint).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. STORAGE BUCKET
-- ---------------------------------------------------------------------
-- Public read, authenticated write. Brand assets are not secret.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brand-assets',
  'brand-assets',
  true,                                        -- public read
  104857600,                                   -- 100 MB per file ceiling (motion files can be large)
  ARRAY['image/png','image/jpeg','image/webp','image/svg+xml','video/mp4','video/webm']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ---------------------------------------------------------------------
-- 2. STORAGE RLS POLICIES
-- ---------------------------------------------------------------------
-- Public read, authenticated write/update/delete.

DROP POLICY IF EXISTS "brand_assets_public_read" ON storage.objects;
CREATE POLICY "brand_assets_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'brand-assets');

DROP POLICY IF EXISTS "brand_assets_authenticated_write" ON storage.objects;
CREATE POLICY "brand_assets_authenticated_write"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'brand-assets' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "brand_assets_authenticated_update" ON storage.objects;
CREATE POLICY "brand_assets_authenticated_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'brand-assets' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "brand_assets_authenticated_delete" ON storage.objects;
CREATE POLICY "brand_assets_authenticated_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'brand-assets' AND auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- 3. METADATA TABLE
-- ---------------------------------------------------------------------
-- One row per asset. Captures provenance, semantic intent, garden scope,
-- generation prompt (so we can iterate later in Midjourney with cref).

CREATE TABLE IF NOT EXISTS public.brand_assets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Storage reference
  bucket          text NOT NULL DEFAULT 'brand-assets',
  storage_path    text NOT NULL UNIQUE,            -- e.g. 'umbrella/tree-symmetric-redroot.png'
  filename        text NOT NULL,
  mime_type       text NOT NULL,
  file_size_bytes bigint,

  -- Semantic identity
  slug            text NOT NULL UNIQUE,            -- e.g. 'tree-symmetric-redroot'
  title           text NOT NULL,
  description     text,                            -- one-paragraph human description
  asset_type      text NOT NULL,                   -- 'plate' | 'motion' | 'mark' | 'icon'
  garden_scope    text NOT NULL,                   -- 'umbrella' | 'okg' | 'bkg' | 'hkg' | 'tkg' | 'mkg' | 'observation' | 'cross-cutting'
  intended_use    text[],                          -- e.g. {'investor-deck','homepage-hero','brand-guidelines'}

  -- Production / iteration metadata
  status          text NOT NULL DEFAULT 'working', -- 'working' | 'approved' | 'archived' | 'final'
  midjourney_prompt text,                          -- the prompt that generated this (for future iteration via cref)
  midjourney_job_id text,                          -- for re-running / variants
  parent_asset_id uuid REFERENCES public.brand_assets(id), -- if this is a variant of another asset

  -- Versioning
  version         integer NOT NULL DEFAULT 1,
  approved_for_production boolean NOT NULL DEFAULT false,

  -- Audit
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_by      text,                            -- 'chilly' | 'john' | 'claude' | etc.
  notes           text
);

CREATE INDEX IF NOT EXISTS idx_brand_assets_garden_scope ON public.brand_assets (garden_scope);
CREATE INDEX IF NOT EXISTS idx_brand_assets_asset_type   ON public.brand_assets (asset_type);
CREATE INDEX IF NOT EXISTS idx_brand_assets_status       ON public.brand_assets (status);
CREATE INDEX IF NOT EXISTS idx_brand_assets_intended_use ON public.brand_assets USING GIN (intended_use);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_brand_assets_updated_at ON public.brand_assets;
CREATE TRIGGER update_brand_assets_updated_at
  BEFORE UPDATE ON public.brand_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------
-- 4. RLS for the metadata table
-- ---------------------------------------------------------------------
ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "brand_assets_public_read"      ON public.brand_assets;
DROP POLICY IF EXISTS "brand_assets_auth_insert"      ON public.brand_assets;
DROP POLICY IF EXISTS "brand_assets_auth_update"      ON public.brand_assets;
DROP POLICY IF EXISTS "brand_assets_auth_delete"      ON public.brand_assets;

CREATE POLICY "brand_assets_public_read" ON public.brand_assets
  FOR SELECT USING (true);

CREATE POLICY "brand_assets_auth_insert" ON public.brand_assets
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "brand_assets_auth_update" ON public.brand_assets
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "brand_assets_auth_delete" ON public.brand_assets
  FOR DELETE USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- 5. CONVENIENCE VIEW — public CDN URL per asset
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW public.brand_assets_with_url AS
SELECT
  b.*,
  format(
    'https://%s.supabase.co/storage/v1/object/public/%s/%s',
    current_setting('app.settings.supabase_project_ref', true),
    b.bucket,
    b.storage_path
  ) AS public_url_template, -- replace project_ref settings if you want this baked in
  -- Hardcoded URL using the known TKG/OKG project ref. Update if needed.
  format(
    'https://vlezoyalutexenbnzzui.supabase.co/storage/v1/object/public/%s/%s',
    b.bucket,
    b.storage_path
  ) AS public_url
FROM public.brand_assets b;

-- ---------------------------------------------------------------------
-- 6. ASSET METADATA INSERTS
-- ---------------------------------------------------------------------
-- Run AFTER uploading the corresponding files to the bucket.
-- Storage paths match the folder layout under /home/claude/assets/.

-- ============= UMBRELLA TREE MARKS (4 static + 2 motion) =============

INSERT INTO public.brand_assets
  (storage_path, filename, mime_type, slug, title, description, asset_type, garden_scope, intended_use, status, created_by)
VALUES
  ('umbrella/tree-orchard-fruits-roots.png',
   'tree-orchard-fruits-roots.png',
   'image/png',
   'tree-orchard-fruits-roots',
   'Tree — Orchard, Fruits, Mesh Roots',
   'Blue-canopied tree bearing hanging fruits, supported by copper mesh and crimson root system, with gear ornaments and dimension annotations. Represents the full umbrella: knowledge bears fruit (entities, products), supported by both the curated root network (copper) and the unstructured raw data layer (crimson).',
   'plate',
   'umbrella',
   ARRAY['investor-deck','hero-plate','slide-background'],
   'working',
   'chilly'),

  ('umbrella/tree-prism-foundation.png',
   'tree-prism-foundation.png',
   'image/png',
   'tree-prism-foundation',
   'Tree — Inverted Prism Foundation',
   'Blue-canopied tree atop an inverted blue triangular prism with a red-and-bronze keystone. Represents the platform-as-foundation framing: the architecture beneath the gardens.',
   'plate',
   'umbrella',
   ARRAY['architecture-doc','technical-deck'],
   'working',
   'chilly'),

  ('umbrella/tree-symmetric-redroot.png',
   'tree-symmetric-redroot.png',
   'image/png',
   'tree-symmetric-redroot',
   'Tree — Symmetric Canopy with Crimson Roots',
   'Symmetric blue canopy with deep, fibrous crimson root system below. Cleanest umbrella mark candidate. Knowledge above / data below in the most balanced composition.',
   'plate',
   'umbrella',
   ARRAY['umbrella-mark-primary-candidate','favicon-source','brand-guidelines'],
   'working',
   'chilly'),

  ('umbrella/tree-strata-cross-section.png',
   'tree-strata-cross-section.png',
   'image/png',
   'tree-strata-cross-section',
   'Tree — Strata Cross-Section',
   'Tree above a cutaway showing strata-cut roots descending into a red core. Represents the depth of the data and RSI ingestion reaching all the way down.',
   'plate',
   'umbrella',
   ARRAY['data-architecture','rsi-heartbeat-doc'],
   'working',
   'chilly'),

  ('umbrella/tree-umbrella-mark-motion-a.mp4',
   'tree-umbrella-mark-motion-a.mp4',
   'video/mp4',
   'tree-umbrella-mark-motion-a',
   'Tree Umbrella Mark — Motion A',
   'Animated motion of the tree-with-roots umbrella mark. Variant A. For video, web hero, Garden Wars intro.',
   'motion',
   'umbrella',
   ARRAY['investor-video','homepage-hero','garden-wars-intro'],
   'working',
   'chilly'),

  ('umbrella/tree-umbrella-mark-motion-b.mp4',
   'tree-umbrella-mark-motion-b.mp4',
   'video/mp4',
   'tree-umbrella-mark-motion-b',
   'Tree Umbrella Mark — Motion B',
   'Animated motion of the tree-with-roots umbrella mark. Variant B. Alternate for A/B selection, fallback.',
   'motion',
   'umbrella',
   ARRAY['investor-video-alt','fallback'],
   'working',
   'chilly')
ON CONFLICT (slug) DO NOTHING;

-- ============= HKG (heart + caduceus) =============

INSERT INTO public.brand_assets
  (storage_path, filename, mime_type, slug, title, description, asset_type, garden_scope, intended_use, status, created_by)
VALUES
  ('hkg/heart-arterial-roots.png',
   'heart-arterial-roots.png',
   'image/png',
   'hkg-heart-arterial-roots',
   'HKG — Anatomical Heart with Arterial Roots',
   'Anatomical heart in deep ink blue with arterial-network roots descending into urban / regional small maps below. The heart is the body; the arterial roots reach into the population (Patient Lane gravity well).',
   'plate',
   'hkg',
   ARRAY['hkg-hero-plate','patient-lane','pitch-deck'],
   'working',
   'chilly'),

  ('hkg/caduceus-teal-ink-motion.mp4',
   'caduceus-teal-ink-motion.mp4',
   'video/mp4',
   'hkg-caduceus-teal-ink-motion',
   'HKG — Teal-Ink Caduceus Motion',
   'Animated teal-ink caduceus. HKG branded motion mark.',
   'motion',
   'hkg',
   ARRAY['hkg-brand-motion','pitch-deck-transition'],
   'working',
   'chilly')
ON CONFLICT (slug) DO NOTHING;

-- ============= TKG (vessels + apparatus + 6-stage lifecycle) =============

INSERT INTO public.brand_assets
  (storage_path, filename, mime_type, slug, title, description, asset_type, garden_scope, intended_use, status, created_by)
VALUES
  ('tkg/vessels-three-states.png',
   'vessels-three-states.png',
   'image/png',
   'tkg-vessels-three-states',
   'TKG — Three Vessels (Compound States)',
   'Three watercolor cylinder vessels showing teal/red liquid in three configurations. The compound through three states of dose / exposure / response.',
   'plate',
   'tkg',
   ARRAY['tkg-hero-plate','compound-page','pitch-deck'],
   'working',
   'chilly'),

  ('tkg/distillation-apparatus.png',
   'distillation-apparatus.png',
   'image/png',
   'tkg-distillation-apparatus',
   'TKG — Industrial Distillation Apparatus',
   'Industrial distillation funnels with teal and red separation. The "purification" of toxicological data through the platform.',
   'plate',
   'tkg',
   ARRAY['tkg-secondary-plate','data-pipeline-doc'],
   'working',
   'chilly'),

  ('tkg/stage-1-identify.mp4',
   'stage-1-identify.mp4',
   'video/mp4',
   'tkg-stage-1-identify',
   'TKG Lifecycle Stage 1 — Identify',
   'Motion graphic for stage 1 of the TKG case lifecycle: Identify the exposure / substance.',
   'motion',
   'tkg',
   ARRAY['tkg-case-lifecycle','case-management-ui'],
   'working',
   'chilly'),

  ('tkg/stage-2-assess.mp4',
   'stage-2-assess.mp4',
   'video/mp4',
   'tkg-stage-2-assess',
   'TKG Lifecycle Stage 2 — Assess',
   'Motion graphic for stage 2 of the TKG case lifecycle: Assess severity / dose / vector.',
   'motion',
   'tkg',
   ARRAY['tkg-case-lifecycle','case-management-ui'],
   'working',
   'chilly'),

  ('tkg/stage-3-plan.mp4',
   'stage-3-plan.mp4',
   'video/mp4',
   'tkg-stage-3-plan',
   'TKG Lifecycle Stage 3 — Plan',
   'Motion graphic for stage 3 of the TKG case lifecycle: Plan treatment / response / remediation.',
   'motion',
   'tkg',
   ARRAY['tkg-case-lifecycle','case-management-ui'],
   'working',
   'chilly'),

  ('tkg/stage-4-act.mp4',
   'stage-4-act.mp4',
   'video/mp4',
   'tkg-stage-4-act',
   'TKG Lifecycle Stage 4 — Act',
   'Motion graphic for stage 4 of the TKG case lifecycle: Act — execute the plan.',
   'motion',
   'tkg',
   ARRAY['tkg-case-lifecycle','case-management-ui'],
   'working',
   'chilly'),

  ('tkg/stage-5-adapt.mp4',
   'stage-5-adapt.mp4',
   'video/mp4',
   'tkg-stage-5-adapt',
   'TKG Lifecycle Stage 5 — Adapt',
   'Motion graphic for stage 5 of the TKG case lifecycle: Adapt — revise against observed outcome.',
   'motion',
   'tkg',
   ARRAY['tkg-case-lifecycle','case-management-ui'],
   'working',
   'chilly'),

  ('tkg/stage-6-resolve.mp4',
   'stage-6-resolve.mp4',
   'video/mp4',
   'tkg-stage-6-resolve',
   'TKG Lifecycle Stage 6 — Resolve',
   'Motion graphic for stage 6 of the TKG case lifecycle: Resolve — closure / settlement / retrospective.',
   'motion',
   'tkg',
   ARRAY['tkg-case-lifecycle','case-management-ui'],
   'working',
   'chilly')
ON CONFLICT (slug) DO NOTHING;

-- ============= CROSS-CUTTING / OBSERVATION =============

INSERT INTO public.brand_assets
  (storage_path, filename, mime_type, slug, title, description, asset_type, garden_scope, intended_use, status, created_by)
VALUES
  ('observation/anatomical-eye.png',
   'anatomical-eye.png',
   'image/png',
   'observation-anatomical-eye',
   'Anatomical Eye — Cross-Cutting Observation Motif',
   'Anatomical eye with deep blue iris, dimension lines, and callout annotations. Cross-cutting "observation" motif. Use for any garden''s observation lane (iNaturalist data in OKG, case observation in TKG, patient symptom in HKG, jobsite-photo in BKG). Also a strong umbrella-level "we see what others can''t" plate.',
   'plate',
   'cross-cutting',
   ARRAY['observation-lane','umbrella-secondary','pitch-deck'],
   'working',
   'chilly')
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------
-- 7. VERIFICATION QUERIES
-- ---------------------------------------------------------------------
-- Run these after upload + insert to verify everything is registered.

-- Count by garden scope
-- SELECT garden_scope, COUNT(*) FROM public.brand_assets GROUP BY garden_scope ORDER BY garden_scope;

-- Get all umbrella marks with public URLs
-- SELECT slug, title, public_url FROM public.brand_assets_with_url WHERE garden_scope = 'umbrella' ORDER BY asset_type, slug;

-- Get TKG case lifecycle motion (in stage order)
-- SELECT slug, title, public_url FROM public.brand_assets_with_url WHERE garden_scope = 'tkg' AND asset_type = 'motion' ORDER BY slug;

-- =====================================================================
-- POST-MIGRATION ACTION ITEMS
-- =====================================================================
--
-- 1. Upload the 17 files in /home/claude/assets/ to the bucket using
--    the Supabase CLI:
--
--      supabase storage cp -r /home/claude/assets/umbrella/    ss:///brand-assets/umbrella/
--      supabase storage cp -r /home/claude/assets/hkg/         ss:///brand-assets/hkg/
--      supabase storage cp -r /home/claude/assets/tkg/         ss:///brand-assets/tkg/
--      supabase storage cp -r /home/claude/assets/observation/ ss:///brand-assets/observation/
--
--    Or use the Supabase Studio drag-and-drop interface.
--
-- 2. After upload, run the verification queries above. All 17 assets
--    should appear and resolve to working public URLs.
--
-- 3. Reference assets in any garden frontend via:
--      const { data, error } = await supabase
--        .from('brand_assets_with_url')
--        .select('public_url, title, description')
--        .eq('slug', 'tree-symmetric-redroot');
--
-- 4. When generating new variants in Midjourney, use the winning umbrella
--    mark as `cref` and INSERT a new row with parent_asset_id pointing
--    to the original. Keep the lineage.
-- =====================================================================
