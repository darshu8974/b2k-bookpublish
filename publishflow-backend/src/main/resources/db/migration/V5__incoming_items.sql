-- ============================================================
-- Incoming Items (attachments imported from incoming email)
-- ============================================================

CREATE TABLE incoming_items (
    id                VARCHAR(36)   NOT NULL PRIMARY KEY,
    sender            VARCHAR(255)  NULL,
    subject           VARCHAR(1000) NULL,
    message_id        VARCHAR(500)  NULL,
    received_at       TIMESTAMP     NULL,
    original_filename VARCHAR(500)  NOT NULL,
    stored_filename   VARCHAR(500)  NOT NULL UNIQUE,
    file_size         BIGINT        NULL,
    content_type      VARCHAR(200)  NULL,
    storage_path      TEXT          NOT NULL,
    is_handled        BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP     NOT NULL DEFAULT NOW(),
    deleted_at        TIMESTAMP     NULL
);

CREATE INDEX idx_incoming_created_at ON incoming_items(created_at);
CREATE INDEX idx_incoming_message_id ON incoming_items(message_id);
