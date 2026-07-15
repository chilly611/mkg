-- ============================================================================
-- SCHEMA-MIGRATION-004-seed.sql
-- CRM demo seed: organizations + contacts + deals for The Marketing Architect.
--
-- Target: Supabase project `rojpjtyjiapqpsxdeovk` (Marketing Knowledge Garden)
-- Apply via SQL Editor AFTER Cycle 004 schema additions are live:
--   * public.organizations new columns (industry, size_employees, hq_city,
--     hq_country, account_status, linkedin_url, owner_email, pitch_notes,
--     source)
--   * public.contacts (new table)
--   * public.deals (new table)
--
-- Idempotent — safe to re-run. Uses ON CONFLICT DO NOTHING on natural keys
-- (org.slug, contact email-per-org, deal title-per-org).
--
-- Demo persona: B2B healthcare-tech wedge accounts for The Marketing
-- Architect. ~9 orgs spanning prospect -> customer -> churned. Names are
-- INVENTED — none should map to a real company. Dates use NOW() - INTERVAL
-- so the workspace looks freshly worked when Chilly demos it.
--
-- Two owners only:
--   bou@theknowledgegardens.com  — John's network / introductions
--   chillyd@gmail.com            — Chilly's direct outreach / inbound
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. ORGANIZATIONS (9 accounts, mixed stages, healthcare-tech wedge)
-- ----------------------------------------------------------------------------
-- Stage mix:
--   prospect  : Cedarway Credentialing, Lighthouse Lab Ops, Verdant Care Networks
--   qualified : Aurora Credentialing, Beacon Health RCM, Tideline Clinical,
--               Pivotal Behavioral Care
--   customer  : Northwind Point-of-Care, Helix Value Health
--   churned   : Solstice Patient Comms
-- ----------------------------------------------------------------------------

insert into public.organizations (
  slug, name, website_url, plan_tier, stripe_customer_id,
  industry, size_employees, hq_city, hq_country, account_status,
  linkedin_url, owner_email, pitch_notes, source, metadata
) values

-- --- Prospects (top of funnel, not yet worked deeply) ----------------------
(
  'cedarway-credentialing',
  'Cedarway Credentialing',
  'https://cedarway.example.com',
  'free', null,
  'healthcare-credentialing', 42, 'Madison', 'US', 'prospect',
  'https://www.linkedin.com/company/cedarway-credentialing-demo/',
  'bou@theknowledgegardens.com',
  'Series A credentialing platform for ambulatory networks. Found via John''s '
  'old Epic contact. No marketing hire yet — founder doing it all. Likely '
  'memo-first.',
  'john_network',
  '{"vertical_focus":"ambulatory","arr_estimate":"3.2M"}'::jsonb
),
(
  'lighthouse-lab-ops',
  'Lighthouse Lab Ops',
  'https://lighthouselabops.example.com',
  'free', null,
  'lab-operations-software', 78, 'Research Triangle', 'US', 'prospect',
  'https://www.linkedin.com/company/lighthouse-lab-ops-demo/',
  'chillyd@gmail.com',
  'Inbound via the "ground truth marketing AI cites" post. CMO downloaded '
  'the HKG memo template. Worth a teardown pitch.',
  'inbound',
  '{"signal":"downloaded_memo_template","intent":"warm"}'::jsonb
),
(
  'verdant-care-networks',
  'Verdant Care Networks',
  'https://verdantcare.example.com',
  'free', null,
  'value-based-care-platform', 130, 'Denver', 'US', 'prospect',
  'https://www.linkedin.com/company/verdant-care-networks-demo/',
  'bou@theknowledgegardens.com',
  'VBC enablement layer; Series B rumored Q3. Met their VP Marketing at '
  'HLTH last year. Cold-warm — waiting for them to close round before push.',
  'event',
  '{"event":"HLTH 2025","warmth":"cold-warm"}'::jsonb
),

-- --- Qualified (briefed, conversation in motion) ---------------------------
(
  'aurora-credentialing',
  'Aurora Credentialing',
  'https://auroracred.example.com',
  'free', null,
  'healthcare-credentialing', 56, 'Minneapolis', 'US', 'qualified',
  'https://www.linkedin.com/company/aurora-credentialing-demo/',
  'bou@theknowledgegardens.com',
  'CMO Priya Raman is sharp; wants a positioning teardown before they '
  'rebuild category page. Discovery call scheduled. Likely teardown -> embedded.',
  'john_network',
  '{"next_step":"teardown_scoping","priority":"high"}'::jsonb
),
(
  'beacon-health-rcm',
  'Beacon Health RCM',
  'https://beaconrcm.example.com',
  'free', null,
  'revenue-cycle-management', 210, 'Nashville', 'US', 'qualified',
  'https://www.linkedin.com/company/beacon-health-rcm-demo/',
  'chillyd@gmail.com',
  'Referral from a former colleague. Head of Growth burned out, asked for '
  'audit-style engagement. Budget approved for a teardown — needs SOW.',
  'referral',
  '{"budget":"approved","stage":"sow_pending"}'::jsonb
),
(
  'tideline-clinical',
  'Tideline Clinical',
  'https://tideline.example.com',
  'free', null,
  'clinical-communications', 95, 'Boston', 'US', 'qualified',
  'https://www.linkedin.com/company/tideline-clinical-demo/',
  'bou@theknowledgegardens.com',
  'Clinical comms / secure-messaging for IDNs. Founder thinks they''re a '
  'product company but their churn says positioning. Memo delivered, '
  'awaiting feedback before teardown pitch.',
  'john_network',
  '{"memo_delivered":true,"awaiting_response":true}'::jsonb
),
(
  'pivotal-behavioral-care',
  'Pivotal Behavioral Care',
  'https://pivotalbehavioral.example.com',
  'free', null,
  'behavioral-health-platform', 64, 'Austin', 'US', 'qualified',
  'https://www.linkedin.com/company/pivotal-behavioral-care-demo/',
  'chillyd@gmail.com',
  'Behavioral health measurement-based care SaaS. Wedge: payer-side buyers '
  'don''t understand their differentiation. Audit in scoping.',
  'inbound',
  '{"buyer_persona_mismatch":true}'::jsonb
),

-- --- Customers (closed-won, currently paying) ------------------------------
(
  'northwind-point-of-care',
  'Northwind Point-of-Care',
  'https://northwindpoc.example.com',
  'pro', 'cus_test_NW1northwindpoc',
  'point-of-care-diagnostics', 180, 'Seattle', 'US', 'customer',
  'https://www.linkedin.com/company/northwind-point-of-care-demo/',
  'bou@theknowledgegardens.com',
  'Embedded engagement, Q2-Q3. Rebuilt their ICP doc and category page. '
  'Renewal conversation in ~6 weeks. Reference customer.',
  'john_network',
  '{"reference_customer":true,"renewal_window":"6w"}'::jsonb
),
(
  'helix-value-health',
  'Helix Value Health',
  'https://helixvalue.example.com',
  'pro', 'cus_test_HX9helixvaluehealth',
  'value-based-care-analytics', 110, 'Brooklyn', 'US', 'customer',
  'https://www.linkedin.com/company/helix-value-health-demo/',
  'chillyd@gmail.com',
  'Started as a memo, expanded to teardown, now embedded one-day-a-week. '
  'Best logo in the portfolio for inbound social proof.',
  'inbound',
  '{"expansion_path":"memo->teardown->embedded","logo_use_ok":true}'::jsonb
),

-- --- Churned (post-mortem on file) ----------------------------------------
(
  'solstice-patient-comms',
  'Solstice Patient Comms',
  'https://solsticepatient.example.com',
  'free', 'cus_test_SL3solsticechurned',
  'patient-engagement', 38, 'Portland', 'US', 'churned',
  'https://www.linkedin.com/company/solstice-patient-comms-demo/',
  'bou@theknowledgegardens.com',
  'One-off teardown delivered Q4 last year. Founder pivoted product before '
  'recommendations could land. Polite churn — keep warm for the v2.',
  'john_network',
  '{"churn_reason":"product_pivot","warm_relationship":true}'::jsonb
)

on conflict (slug) do nothing;


-- ----------------------------------------------------------------------------
-- 2. CONTACTS (15 contacts across the 9 orgs; one primary per org)
-- ----------------------------------------------------------------------------
-- Convention: deterministic email pattern keeps re-runs idempotent.
--             We rely on a unique index on (organization_id, lower(email)).
--             If the index isn't in place yet, the inserts still succeed —
--             they'll just duplicate on re-run, so consider adding:
--               create unique index if not exists contacts_org_email_key
--                 on public.contacts (organization_id, lower(email));
-- ----------------------------------------------------------------------------

-- Cedarway Credentialing (prospect — founder-led, single contact)
insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Marcus Halbrook', 'marcus@cedarway.example.com', 'Founder & CEO',
  'https://www.linkedin.com/in/marcus-halbrook-demo/', true,
  'Doing marketing himself. Open to memo if framed as "founder positioning".'
from public.organizations where slug = 'cedarway-credentialing'
on conflict do nothing;

-- Lighthouse Lab Ops (prospect — CMO + demand gen)
insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Renata Okonjo', 'renata@lighthouselabops.example.com', 'CMO',
  'https://www.linkedin.com/in/renata-okonjo-demo/', true,
  'Downloaded the HKG memo template. Replied to follow-up — wants intro call.'
from public.organizations where slug = 'lighthouse-lab-ops'
on conflict do nothing;

insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Devon Whitaker', 'devon@lighthouselabops.example.com',
  'Director of Demand Gen',
  'https://www.linkedin.com/in/devon-whitaker-demo/', false,
  'CMO''s deputy. Will be in the room for any pitch.'
from public.organizations where slug = 'lighthouse-lab-ops'
on conflict do nothing;

-- Verdant Care Networks (prospect — single warm contact from event)
insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Sasha Lindgren', 'sasha@verdantcare.example.com', 'VP Marketing',
  'https://www.linkedin.com/in/sasha-lindgren-demo/', true,
  'Met at HLTH. Asked us to circle back after their Series B closes.'
from public.organizations where slug = 'verdant-care-networks'
on conflict do nothing;

-- Aurora Credentialing (qualified — CMO + Head of Growth)
insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Priya Raman', 'priya@auroracred.example.com', 'CMO',
  'https://www.linkedin.com/in/priya-raman-demo/', true,
  'Decision maker. Wants positioning teardown before category page rebuild.'
from public.organizations where slug = 'aurora-credentialing'
on conflict do nothing;

insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Jonah Ellsberg', 'jonah@auroracred.example.com',
  'Head of Growth',
  'https://www.linkedin.com/in/jonah-ellsberg-demo/', false,
  'Reports to Priya. Will own implementation of teardown recommendations.'
from public.organizations where slug = 'aurora-credentialing'
on conflict do nothing;

-- Beacon Health RCM (qualified — Head of Growth + Founder)
insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Theo Markland', 'theo@beaconrcm.example.com', 'Head of Growth',
  'https://www.linkedin.com/in/theo-markland-demo/', true,
  'Burned out, asked for audit-style engagement. Has signing authority up to $5k.'
from public.organizations where slug = 'beacon-health-rcm'
on conflict do nothing;

insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Amelia Foxworth', 'amelia@beaconrcm.example.com', 'Founder & CEO',
  'https://www.linkedin.com/in/amelia-foxworth-demo/', false,
  'Loops in for anything above $10k. Brief and decisive.'
from public.organizations where slug = 'beacon-health-rcm'
on conflict do nothing;

-- Tideline Clinical (qualified — Founder primary, VP Marketing secondary)
insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Idris Calloway', 'idris@tideline.example.com', 'Founder & CEO',
  'https://www.linkedin.com/in/idris-calloway-demo/', true,
  'Believes the product story; doesn''t see the positioning gap. Memo first.'
from public.organizations where slug = 'tideline-clinical'
on conflict do nothing;

insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Hana Voss', 'hana@tideline.example.com', 'VP Marketing',
  'https://www.linkedin.com/in/hana-voss-demo/', false,
  'Internal champion. Forwarded the memo deck to the exec team unprompted.'
from public.organizations where slug = 'tideline-clinical'
on conflict do nothing;

-- Pivotal Behavioral Care (qualified — Director of Demand Gen primary)
insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Cory Westerfield', 'cory@pivotalbehavioral.example.com',
  'Director of Demand Gen',
  'https://www.linkedin.com/in/cory-westerfield-demo/', true,
  'Initiated the inbound. Needs internal cover before booking the audit.'
from public.organizations where slug = 'pivotal-behavioral-care'
on conflict do nothing;

-- Northwind Point-of-Care (customer — CMO + VP Marketing)
insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Linnea Sorensen', 'linnea@northwindpoc.example.com', 'CMO',
  'https://www.linkedin.com/in/linnea-sorensen-demo/', true,
  'Embedded engagement sponsor. Renewal yes/no comes from her in ~6 weeks.'
from public.organizations where slug = 'northwind-point-of-care'
on conflict do nothing;

insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Rashid Patel', 'rashid@northwindpoc.example.com', 'VP Marketing',
  'https://www.linkedin.com/in/rashid-patel-demo/', false,
  'Day-to-day collaborator on the embedded weekly. Strong reference material.'
from public.organizations where slug = 'northwind-point-of-care'
on conflict do nothing;

-- Helix Value Health (customer — Founder primary, Head of Growth secondary)
insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Estelle Quartermaine', 'estelle@helixvalue.example.com',
  'Founder & CEO',
  'https://www.linkedin.com/in/estelle-quartermaine-demo/', true,
  'Original buyer. Champions the engagement internally. Logo use approved.'
from public.organizations where slug = 'helix-value-health'
on conflict do nothing;

insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Marc Delacroix', 'marc@helixvalue.example.com', 'Head of Growth',
  'https://www.linkedin.com/in/marc-delacroix-demo/', false,
  'Operationalizes the work. Asked about an additional brand sprint next quarter.'
from public.organizations where slug = 'helix-value-health'
on conflict do nothing;

-- Solstice Patient Comms (churned — keep one warm contact on file)
insert into public.contacts (organization_id, name, email, role_title,
  linkedin_url, is_primary_contact, notes)
select id, 'Naomi Berriman', 'naomi@solsticepatient.example.com', 'Founder',
  'https://www.linkedin.com/in/naomi-berriman-demo/', true,
  'Polite churn after product pivot. Still on the holiday list — re-engage in 6mo.'
from public.organizations where slug = 'solstice-patient-comms'
on conflict do nothing;


-- ----------------------------------------------------------------------------
-- 3. DEALS (13 deals across the 9 orgs; mixed kinds and stages)
-- ----------------------------------------------------------------------------
-- Kind pricing reference:
--   memo      $249
--   teardown  $1499
--   embedded  $8000 / quarter
--   audit     custom (using $3500 as the demo standard)
--   custom    one-off (varies)
--
-- Idempotency: assumes a unique index on (organization_id, title).
-- If not yet present, add:
--   create unique index if not exists deals_org_title_key
--     on public.deals (organization_id, title);
-- ----------------------------------------------------------------------------

-- Cedarway Credentialing — memo, briefed
insert into public.deals (organization_id, title, kind, stage, value_usd,
  owner_email, expected_close_date, created_at)
select id, 'Cedarway founder positioning memo', 'memo', 'briefed', 249,
  'bou@theknowledgegardens.com',
  (now() + interval '10 days')::date,
  now() - interval '4 days'
from public.organizations where slug = 'cedarway-credentialing'
on conflict do nothing;

-- Lighthouse Lab Ops — teardown, new
insert into public.deals (organization_id, title, kind, stage, value_usd,
  owner_email, expected_close_date, created_at)
select id, 'Lighthouse category page teardown', 'teardown', 'new', 1499,
  'chillyd@gmail.com',
  (now() + interval '21 days')::date,
  now() - interval '2 days'
from public.organizations where slug = 'lighthouse-lab-ops'
on conflict do nothing;

-- Verdant Care Networks — memo, new (parked until Series B)
insert into public.deals (organization_id, title, kind, stage, value_usd,
  owner_email, expected_close_date, created_at)
select id, 'Verdant ICP memo (post-Series-B)', 'memo', 'new', 249,
  'bou@theknowledgegardens.com',
  (now() + interval '75 days')::date,
  now() - interval '12 days'
from public.organizations where slug = 'verdant-care-networks'
on conflict do nothing;

-- Aurora Credentialing — teardown in progress + embedded follow-on briefed
insert into public.deals (organization_id, title, kind, stage, value_usd,
  owner_email, expected_close_date, created_at)
select id, 'Aurora positioning teardown', 'teardown', 'in_progress', 1499,
  'bou@theknowledgegardens.com',
  (now() + interval '7 days')::date,
  now() - interval '11 days'
from public.organizations where slug = 'aurora-credentialing'
on conflict do nothing;

insert into public.deals (organization_id, title, kind, stage, value_usd,
  owner_email, expected_close_date, created_at)
select id, 'Aurora embedded Q3 (conditional)', 'embedded', 'briefed', 8000,
  'bou@theknowledgegardens.com',
  (now() + interval '35 days')::date,
  now() - interval '6 days'
from public.organizations where slug = 'aurora-credentialing'
on conflict do nothing;

-- Beacon Health RCM — teardown, briefed (SOW pending)
insert into public.deals (organization_id, title, kind, stage, value_usd,
  owner_email, expected_close_date, created_at)
select id, 'Beacon RCM teardown (SOW pending)', 'teardown', 'briefed', 1499,
  'chillyd@gmail.com',
  (now() + interval '14 days')::date,
  now() - interval '5 days'
from public.organizations where slug = 'beacon-health-rcm'
on conflict do nothing;

-- Tideline Clinical — memo delivered, teardown in review
insert into public.deals (organization_id, title, kind, stage, value_usd,
  owner_email, expected_close_date, created_at)
select id, 'Tideline founder positioning memo', 'memo', 'delivered', 249,
  'bou@theknowledgegardens.com',
  (now() - interval '3 days')::date,
  now() - interval '24 days'
from public.organizations where slug = 'tideline-clinical'
on conflict do nothing;

insert into public.deals (organization_id, title, kind, stage, value_usd,
  owner_email, expected_close_date, created_at)
select id, 'Tideline positioning teardown', 'teardown', 'review', 1499,
  'bou@theknowledgegardens.com',
  (now() + interval '5 days')::date,
  now() - interval '8 days'
from public.organizations where slug = 'tideline-clinical'
on conflict do nothing;

-- Pivotal Behavioral Care — audit in progress
insert into public.deals (organization_id, title, kind, stage, value_usd,
  owner_email, expected_close_date, created_at)
select id, 'Pivotal payer-buyer positioning audit', 'audit', 'in_progress',
  3500,
  'chillyd@gmail.com',
  (now() + interval '12 days')::date,
  now() - interval '9 days'
from public.organizations where slug = 'pivotal-behavioral-care'
on conflict do nothing;

-- Northwind Point-of-Care — embedded WON (current customer)
insert into public.deals (organization_id, title, kind, stage, value_usd,
  owner_email, expected_close_date, created_at)
select id, 'Northwind embedded Q2-Q3', 'embedded', 'won', 16000,
  'bou@theknowledgegardens.com',
  (now() - interval '40 days')::date,
  now() - interval '70 days'
from public.organizations where slug = 'northwind-point-of-care'
on conflict do nothing;

insert into public.deals (organization_id, title, kind, stage, value_usd,
  owner_email, expected_close_date, created_at)
select id, 'Northwind embedded Q4 renewal', 'embedded', 'in_progress', 8000,
  'bou@theknowledgegardens.com',
  (now() + interval '42 days')::date,
  now() - interval '7 days'
from public.organizations where slug = 'northwind-point-of-care'
on conflict do nothing;

-- Helix Value Health — embedded WON + custom brand sprint briefed
insert into public.deals (organization_id, title, kind, stage, value_usd,
  owner_email, expected_close_date, created_at)
select id, 'Helix embedded one-day-a-week', 'embedded', 'won', 8000,
  'chillyd@gmail.com',
  (now() - interval '22 days')::date,
  now() - interval '55 days'
from public.organizations where slug = 'helix-value-health'
on conflict do nothing;

insert into public.deals (organization_id, title, kind, stage, value_usd,
  owner_email, expected_close_date, created_at)
select id, 'Helix brand sprint (custom)', 'custom', 'briefed', 5500,
  'chillyd@gmail.com',
  (now() + interval '28 days')::date,
  now() - interval '3 days'
from public.organizations where slug = 'helix-value-health'
on conflict do nothing;

-- Solstice Patient Comms — historic teardown, LOST
insert into public.deals (organization_id, title, kind, stage, value_usd,
  owner_email, expected_close_date, created_at)
select id, 'Solstice positioning teardown (historic)', 'teardown', 'lost',
  1499,
  'bou@theknowledgegardens.com',
  (now() - interval '120 days')::date,
  now() - interval '160 days'
from public.organizations where slug = 'solstice-patient-comms'
on conflict do nothing;


-- ============================================================================
-- End of SCHEMA-MIGRATION-004-seed.sql
-- After applying, sanity check with:
--   select account_status, count(*) from public.organizations group by 1;
--   select stage, count(*), sum(value_usd) from public.deals group by 1;
--   select o.name, count(c.*) as contacts
--     from public.organizations o
--     left join public.contacts c on c.organization_id = o.id
--     group by o.name order by contacts desc;
-- ============================================================================
