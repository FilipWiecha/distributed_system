--liquibase formatted sql

--changeset fwiecha:001-create-user_sessions
CREATE TABLE user_sessions (

    session_id              UUID NOT NULL,
    user_id                 UUID NOT NULL,
    platform                VARCHAR(16) NOT NULL,

    current_token_hash      BYTEA NOT NULL,
    previous_token_hash     BYTEA NULL,
    revoked                 BOOLEAN NOT NULL DEFAULT FALSE,

    rotation_counter        INTEGER NOT NULL DEFAULT 1,

    rotated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at              TIMESTAMPTZ NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    ip_address              INET NULL,
    user_agent              TEXT NULL,


    CONSTRAINT pk_user_sessions PRIMARY KEY (session_id)
)WITH (fillfactor = 80);

--rollback DROP TABLE user_sessions;

--changeset fwiecha:002-create-user-sessions-user-index
CREATE INDEX idx_user_sessions_user_id ON user_sessions (user_id);
--rollback DROP INDEX idx_user_sessions_user_id;