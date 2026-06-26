-- ============================================================
-- QC Checklist
-- ============================================================

CREATE TABLE qc_checklist_items (
    id         VARCHAR(36)  NOT NULL PRIMARY KEY,
    label      VARCHAR(500) NOT NULL,
    category   VARCHAR(100) NULL,
    sort_order INT          NOT NULL DEFAULT 0,
    is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE qc_responses (
    id          VARCHAR(36) NOT NULL PRIMARY KEY,
    project_id  VARCHAR(36) NOT NULL,
    item_id     VARCHAR(36) NOT NULL,
    checked     BOOLEAN     NOT NULL DEFAULT FALSE,
    note        TEXT        NULL,
    answered_by VARCHAR(36) NULL,
    answered_at TIMESTAMP   NULL,
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_qcr_project FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT fk_qcr_item    FOREIGN KEY (item_id)    REFERENCES qc_checklist_items(id),
    CONSTRAINT fk_qcr_user    FOREIGN KEY (answered_by) REFERENCES users(id),
    CONSTRAINT uq_qcr_project_item UNIQUE (project_id, item_id)
);

CREATE INDEX idx_qcr_project_id ON qc_responses(project_id);

-- ============================================================
-- Templates
-- ============================================================

CREATE TABLE templates (
    id         VARCHAR(36)  NOT NULL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    type       VARCHAR(50)  NOT NULL DEFAULT 'EMAIL',
    content    TEXT         NOT NULL,
    tags       VARCHAR(500) NULL,
    created_by VARCHAR(36)  NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP    NULL,
    CONSTRAINT fk_tmpl_user FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_templates_type       ON templates(type);
CREATE INDEX idx_templates_deleted_at ON templates(deleted_at);

-- ============================================================
-- Author Tokens (for approve / reject email links)
-- ============================================================

CREATE TABLE author_tokens (
    id           VARCHAR(36)  NOT NULL PRIMARY KEY,
    project_id   VARCHAR(36)  NOT NULL,
    token        VARCHAR(128) NOT NULL UNIQUE,
    author_email VARCHAR(255) NOT NULL,
    author_name  VARCHAR(255) NULL,
    status       VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    decision     VARCHAR(20)  NULL,
    comment      TEXT         NULL,
    expires_at   TIMESTAMP    NOT NULL,
    decided_at   TIMESTAMP    NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_at_project FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE INDEX idx_at_token      ON author_tokens(token);
CREATE INDEX idx_at_project_id ON author_tokens(project_id);
CREATE INDEX idx_at_status     ON author_tokens(status);

-- ============================================================
-- Seed default QC checklist items
-- ============================================================

INSERT INTO qc_checklist_items (id, label, category, sort_order) VALUES
    ('qci-001', 'All headings follow the correct hierarchy (H1 > H2 > H3)', 'Structure', 1),
    ('qci-002', 'Figure captions are present and numbered correctly', 'Figures', 2),
    ('qci-003', 'Table captions are present and numbered correctly', 'Tables', 3),
    ('qci-004', 'All cross-references are resolved (no missing refs)', 'References', 4),
    ('qci-005', 'Bibliography / references section is complete', 'References', 5),
    ('qci-006', 'Running headers and footers are correct', 'Layout', 6),
    ('qci-007', 'Page numbers are sequential and correct', 'Layout', 7),
    ('qci-008', 'Fonts are consistent throughout the document', 'Typography', 8),
    ('qci-009', 'Spacing and margins match the template', 'Layout', 9),
    ('qci-010', 'Equations are formatted and numbered correctly', 'Content', 10),
    ('qci-011', 'No orphaned or widowed lines', 'Typography', 11),
    ('qci-012', 'All images are high resolution (minimum 300 DPI)', 'Figures', 12),
    ('qci-013', 'Copyright permissions obtained for all third-party figures', 'Legal', 13),
    ('qci-014', 'Author affiliations and contact details are correct', 'Metadata', 14),
    ('qci-015', 'Abstract matches the final content', 'Metadata', 15);
