-- ProTrack Database Schema (PostgreSQL)

CREATE TABLE users (
    id            VARCHAR(36)  NOT NULL PRIMARY KEY,
    full_name     VARCHAR(200) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    version       BIGINT       NOT NULL DEFAULT 0,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMP    NULL
);

CREATE TABLE refresh_tokens (
    id          VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id     VARCHAR(36) NOT NULL,
    token_hash  VARCHAR(64) NOT NULL UNIQUE,
    expires_at  TIMESTAMP   NOT NULL,
    revoked_at  TIMESTAMP   NULL,
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE customers (
    id            VARCHAR(36)  NOT NULL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NULL,
    contact_phone VARCHAR(50)  NULL,
    address       TEXT         NULL,
    created_by    VARCHAR(36)  NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMP    NULL,
    CONSTRAINT fk_cust_user FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE projects (
    id                 VARCHAR(36)  NOT NULL PRIMARY KEY,
    project_code       VARCHAR(50)  NOT NULL UNIQUE,
    title              VARCHAR(500) NOT NULL,
    description        TEXT         NULL,
    customer_id        VARCHAR(36)  NULL,
    project_manager_id VARCHAR(36)  NULL,
    created_by         VARCHAR(36)  NULL,
    current_stage      VARCHAR(30)  NOT NULL DEFAULT 'CUSTOMER_INPUT',
    status             VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    priority           VARCHAR(10)  NOT NULL DEFAULT 'MEDIUM',
    due_date           DATE         NULL,
    started_at         TIMESTAMP    NULL,
    completed_at       TIMESTAMP    NULL,
    version            BIGINT       NOT NULL DEFAULT 0,
    created_at         TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMP    NOT NULL DEFAULT NOW(),
    deleted_at         TIMESTAMP    NULL,
    CONSTRAINT fk_proj_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_proj_manager  FOREIGN KEY (project_manager_id) REFERENCES users(id),
    CONSTRAINT fk_proj_creator  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE workflow_stages (
    id           VARCHAR(36) NOT NULL PRIMARY KEY,
    project_id   VARCHAR(36) NOT NULL,
    stage_name   VARCHAR(30) NOT NULL,
    stage_order  INT         NOT NULL,
    status       VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    assigned_to  VARCHAR(36) NULL,
    remarks      TEXT        NULL,
    started_at   TIMESTAMP   NULL,
    completed_at TIMESTAMP   NULL,
    created_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMP   NULL,
    CONSTRAINT fk_ws_project  FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT fk_ws_assignee FOREIGN KEY (assigned_to) REFERENCES users(id),
    CONSTRAINT uq_ws_project_stage UNIQUE (project_id, stage_name)
);

CREATE TABLE comments (
    id         VARCHAR(36) NOT NULL PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    author_id  VARCHAR(36) NOT NULL,
    content    TEXT        NOT NULL,
    parent_id  VARCHAR(36) NULL,
    created_at TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP   NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP   NULL,
    CONSTRAINT fk_comment_project FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT fk_comment_author  FOREIGN KEY (author_id)  REFERENCES users(id),
    CONSTRAINT fk_comment_parent  FOREIGN KEY (parent_id)  REFERENCES comments(id)
);

CREATE TABLE file_uploads (
    id                VARCHAR(36)  NOT NULL PRIMARY KEY,
    project_id        VARCHAR(36)  NOT NULL,
    uploaded_by       VARCHAR(36)  NOT NULL,
    original_filename VARCHAR(500) NOT NULL,
    stored_filename   VARCHAR(500) NOT NULL UNIQUE,
    file_size         BIGINT       NULL,
    content_type      VARCHAR(100) NULL,
    category          VARCHAR(20)  NOT NULL DEFAULT 'OTHER',
    storage_path      TEXT         NOT NULL,
    created_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    deleted_at        TIMESTAMP    NULL,
    CONSTRAINT fk_file_project  FOREIGN KEY (project_id)  REFERENCES projects(id),
    CONSTRAINT fk_file_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE TABLE audit_logs (
    id          VARCHAR(36)  NOT NULL PRIMARY KEY,
    actor_id    VARCHAR(36)  NULL,
    actor_name  VARCHAR(200) NULL,
    action      VARCHAR(40)  NOT NULL,
    entity_type VARCHAR(50)  NULL,
    entity_id   VARCHAR(36)  NULL,
    details     TEXT         NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id           VARCHAR(36)  NOT NULL PRIMARY KEY,
    recipient_id VARCHAR(36)  NOT NULL,
    type         VARCHAR(30)  NOT NULL,
    title        VARCHAR(255) NOT NULL,
    message      TEXT         NULL,
    entity_type  VARCHAR(50)  NULL,
    entity_id    VARCHAR(36)  NULL,
    is_read      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMP    NULL,
    CONSTRAINT fk_notif_recipient FOREIGN KEY (recipient_id) REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_projects_status        ON projects(status);
CREATE INDEX idx_projects_current_stage ON projects(current_stage);
CREATE INDEX idx_projects_deleted_at    ON projects(deleted_at);
CREATE INDEX idx_ws_project_id          ON workflow_stages(project_id);
CREATE INDEX idx_ws_assigned_to         ON workflow_stages(assigned_to);
CREATE INDEX idx_comments_project_id    ON comments(project_id);
CREATE INDEX idx_files_project_id       ON file_uploads(project_id);
CREATE INDEX idx_audit_actor_id         ON audit_logs(actor_id);
CREATE INDEX idx_audit_entity           ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_notif_recipient        ON notifications(recipient_id, is_read);
