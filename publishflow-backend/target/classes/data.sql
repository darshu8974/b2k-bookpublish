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

-- ── QC Checklist Items ───────────────────────────────────────────────────────
MERGE INTO qc_checklist_items (id, label, category, sort_order, is_active, created_at)
KEY(id)
VALUES
  ('qci-001', 'All headings follow the correct hierarchy (H1 > H2 > H3)', 'Structure',  1,  TRUE, NOW()),
  ('qci-002', 'Figure captions are present and numbered correctly',         'Figures',    2,  TRUE, NOW()),
  ('qci-003', 'Table captions are present and numbered correctly',          'Tables',     3,  TRUE, NOW()),
  ('qci-004', 'All cross-references are resolved (no missing refs)',        'References', 4,  TRUE, NOW()),
  ('qci-005', 'Bibliography / references section is complete',              'References', 5,  TRUE, NOW()),
  ('qci-006', 'Running headers and footers are correct',                    'Layout',     6,  TRUE, NOW()),
  ('qci-007', 'Page numbers are sequential and correct',                    'Layout',     7,  TRUE, NOW()),
  ('qci-008', 'Fonts are consistent throughout the document',               'Typography', 8,  TRUE, NOW()),
  ('qci-009', 'Spacing and margins match the template',                     'Layout',     9,  TRUE, NOW()),
  ('qci-010', 'Equations are formatted and numbered correctly',             'Content',    10, TRUE, NOW()),
  ('qci-011', 'No orphaned or widowed lines',                               'Typography', 11, TRUE, NOW()),
  ('qci-012', 'All images are high resolution (minimum 300 DPI)',           'Figures',    12, TRUE, NOW()),
  ('qci-013', 'Copyright permissions obtained for all third-party figures', 'Legal',      13, TRUE, NOW()),
  ('qci-014', 'Author affiliations and contact details are correct',        'Metadata',   14, TRUE, NOW()),
  ('qci-015', 'Abstract matches the final content',                         'Metadata',   15, TRUE, NOW());
