-- ── Users ────────────────────────────────────────────────────────────────────
-- password for all = "Admin@1234"  (BCrypt 12 rounds)
MERGE INTO users (id, full_name, email, password_hash, role, is_active, version, created_at, updated_at)
KEY(id)
VALUES
  ('u-admin',  'Admin User',       'admin@protrack.com',      '$2a$12$kHwlJK7PcVzN1NXBd7bpU.1fUv7VAXrxRwCy0UfNO9LsU6WEnQyuC', 'ADMIN',           TRUE, 0, NOW(), NOW()),
  ('u-pm',     'Project Manager',  'pm@protrack.com',         '$2a$12$kHwlJK7PcVzN1NXBd7bpU.1fUv7VAXrxRwCy0UfNO9LsU6WEnQyuC', 'PROJECT_MANAGER', TRUE, 0, NOW(), NOW()),
  ('u-prod',   'Production Staff', 'production@protrack.com', '$2a$12$kHwlJK7PcVzN1NXBd7bpU.1fUv7VAXrxRwCy0UfNO9LsU6WEnQyuC', 'PRODUCTION_TEAM', TRUE, 0, NOW(), NOW()),
  ('u-qc',     'QC Reviewer',      'qc@protrack.com',         '$2a$12$kHwlJK7PcVzN1NXBd7bpU.1fUv7VAXrxRwCy0UfNO9LsU6WEnQyuC', 'QC_TEAM',         TRUE, 0, NOW(), NOW()),
  ('u-prod2',  'Production Staff2','prod2@protrack.com',      '$2a$12$kHwlJK7PcVzN1NXBd7bpU.1fUv7VAXrxRwCy0UfNO9LsU6WEnQyuC', 'PRODUCTION_TEAM', TRUE, 0, NOW(), NOW());

-- ── Customers ────────────────────────────────────────────────────────────────
MERGE INTO customers (id, name, contact_email, created_by, created_at, updated_at)
KEY(id)
VALUES
  ('c-oxford',    'Oxford University Press', 'contact@oup.com',      'u-admin', NOW(), NOW()),
  ('c-pearson',   'Pearson Education',       'contact@pearson.com',  'u-admin', NOW(), NOW()),
  ('c-springer',  'Springer Nature',         'contact@springer.com', 'u-admin', NOW(), NOW()),
  ('c-elsevier',  'Elsevier',                'contact@elsevier.com', 'u-admin', NOW(), NOW()),
  ('c-cambridge', 'Cambridge University',    'contact@cup.com',      'u-admin', NOW(), NOW());

-- ── Phase Checklist Items (grouped by workflow phase) ─────────────────────────
-- Retire the old generic QC items so only the phase-aligned checklist shows
UPDATE qc_checklist_items SET is_active = FALSE WHERE id LIKE 'qci-%';

MERGE INTO qc_checklist_items (id, label, category, sort_order, is_active, created_at)
KEY(id)
VALUES
  -- Phase 1 — Manuscript Intake & Content Prep
  ('chk-p1-01', 'Standardize files (Word to unified format)',          'Phase 1: Manuscript Intake & Content Prep', 101, TRUE, NOW()),
  ('chk-p1-02', 'Text cleaning (quotes, dashes, remove double spaces)', 'Phase 1: Manuscript Intake & Content Prep', 102, TRUE, NOW()),
  ('chk-p1-03', 'Editorial lockdown (text fully edited)',               'Phase 1: Manuscript Intake & Content Prep', 103, TRUE, NOW()),
  -- Phase 2 — Design Template & Geometry Setup
  ('chk-p2-01', 'Define trim size, margins and bleed',                  'Phase 2: Design Template & Geometry Setup', 201, TRUE, NOW()),
  ('chk-p2-02', 'Set baseline grid (align text lines)',                 'Phase 2: Design Template & Geometry Setup', 202, TRUE, NOW()),
  ('chk-p2-03', 'Typography selection (body & heading types)',          'Phase 2: Design Template & Geometry Setup', 203, TRUE, NOW()),
  ('chk-p2-04', 'Master pages (headers, footers, page numbers)',        'Phase 2: Design Template & Geometry Setup', 204, TRUE, NOW()),
  -- Phase 3 — Global Styles Definition
  ('chk-p3-01', 'Paragraph styles (body text, headings 1-3)',           'Phase 3: Global Styles Definition',         301, TRUE, NOW()),
  ('chk-p3-02', 'Character styles (italics, bold, links)',              'Phase 3: Global Styles Definition',         302, TRUE, NOW()),
  ('chk-p3-03', 'Object/table styles (images, tables)',                 'Phase 3: Global Styles Definition',         303, TRUE, NOW()),
  -- Phase 4 — Import & Composition
  ('chk-p4-01', 'Flow text (map styles on import)',                     'Phase 4: Import & Composition',             401, TRUE, NOW()),
  ('chk-p4-02', 'Apply hierarchy (headers, lists, breaks)',             'Phase 4: Import & Composition',             402, TRUE, NOW()),
  ('chk-p4-03', 'Copy-fitting pass (widows, orphans, hyphenation)',     'Phase 4: Import & Composition',             403, TRUE, NOW()),
  -- Phase 5 — Quality Assurance & Export
  ('chk-p5-01', 'Visual proofing (page numbers, running heads, TOC)',   'Phase 5: Quality Assurance & Export',       501, TRUE, NOW()),
  ('chk-p5-02', 'Preflight check (low-res images, missing fonts, overset text)', 'Phase 5: Quality Assurance & Export', 502, TRUE, NOW()),
  ('chk-p5-03', 'Final export (Print PDF CMYK; Digital RGB PDF / ePub)','Phase 5: Quality Assurance & Export',       503, TRUE, NOW());
