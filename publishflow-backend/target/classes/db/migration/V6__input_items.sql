-- ============================================================
-- Input Items (shared, app-wide "Input" repository)
-- ============================================================

CREATE TABLE input_items (
    id                VARCHAR(36)   NOT NULL PRIMARY KEY,
    added_by          VARCHAR(36)   NULL,
    original_filename VARCHAR(500)  NOT NULL,
    stored_filename   VARCHAR(500)  NOT NULL UNIQUE,
    file_size         BIGINT        NULL,
    content_type      VARCHAR(200)  NULL,
    storage_path      TEXT          NOT NULL,
    source            VARCHAR(30)   NOT NULL DEFAULT 'EMAIL',
    created_at        TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP     NOT NULL DEFAULT NOW(),
    deleted_at        TIMESTAMP     NULL,
    CONSTRAINT fk_input_added_by FOREIGN KEY (added_by) REFERENCES users(id)
);

CREATE INDEX idx_input_created_at ON input_items(created_at);
