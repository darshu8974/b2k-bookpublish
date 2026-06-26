-- ============================================================
-- Replace the generic QC checklist with phase-aligned items.
-- Items are grouped by workflow phase via the "category" column.
-- ============================================================

-- Retire the old generic QC items (keep rows for historical responses)
UPDATE qc_checklist_items SET is_active = FALSE WHERE id LIKE 'qci-%';

INSERT INTO qc_checklist_items (id, label, category, sort_order, is_active) VALUES
  ('chk-p1-01', 'Standardize files (Word to unified format)',          'Phase 1: Manuscript Intake & Content Prep', 101, TRUE),
  ('chk-p1-02', 'Text cleaning (quotes, dashes, remove double spaces)', 'Phase 1: Manuscript Intake & Content Prep', 102, TRUE),
  ('chk-p1-03', 'Editorial lockdown (text fully edited)',               'Phase 1: Manuscript Intake & Content Prep', 103, TRUE),
  ('chk-p2-01', 'Define trim size, margins and bleed',                  'Phase 2: Design Template & Geometry Setup', 201, TRUE),
  ('chk-p2-02', 'Set baseline grid (align text lines)',                 'Phase 2: Design Template & Geometry Setup', 202, TRUE),
  ('chk-p2-03', 'Typography selection (body & heading types)',          'Phase 2: Design Template & Geometry Setup', 203, TRUE),
  ('chk-p2-04', 'Master pages (headers, footers, page numbers)',        'Phase 2: Design Template & Geometry Setup', 204, TRUE),
  ('chk-p3-01', 'Paragraph styles (body text, headings 1-3)',           'Phase 3: Global Styles Definition',         301, TRUE),
  ('chk-p3-02', 'Character styles (italics, bold, links)',              'Phase 3: Global Styles Definition',         302, TRUE),
  ('chk-p3-03', 'Object/table styles (images, tables)',                 'Phase 3: Global Styles Definition',         303, TRUE),
  ('chk-p4-01', 'Flow text (map styles on import)',                     'Phase 4: Import & Composition',             401, TRUE),
  ('chk-p4-02', 'Apply hierarchy (headers, lists, breaks)',             'Phase 4: Import & Composition',             402, TRUE),
  ('chk-p4-03', 'Copy-fitting pass (widows, orphans, hyphenation)',     'Phase 4: Import & Composition',             403, TRUE),
  ('chk-p5-01', 'Visual proofing (page numbers, running heads, TOC)',   'Phase 5: Quality Assurance & Export',       501, TRUE),
  ('chk-p5-02', 'Preflight check (low-res images, missing fonts, overset text)', 'Phase 5: Quality Assurance & Export', 502, TRUE),
  ('chk-p5-03', 'Final export (Print PDF CMYK; Digital RGB PDF / ePub)','Phase 5: Quality Assurance & Export',       503, TRUE)
ON CONFLICT (id) DO NOTHING;
