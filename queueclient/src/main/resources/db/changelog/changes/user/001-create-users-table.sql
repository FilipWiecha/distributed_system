--liquibase formatted sql

--changeset fwiecha:001-create-users
CREATE TABLE users (

    id UUID                 PRIMARY KEY,
    username                VARCHAR(50) NOT NULL UNIQUE,
    password                VARCHAR(255) NOT NULL,
    first_name              VARCHAR(255) NOT NULL,
    last_name               VARCHAR(255) NOT NULL,
    email                   VARCHAR(255) NOT NULL UNIQUE,
    birth_date              DATE NOT NULL,
    totp_secret             VARCHAR(64),
    is_totp_enabled         BOOLEAN NOT NULL DEFAULT FALSE,

    roles                   VARCHAR(255) NOT NULL DEFAULT 'ROLE_USER',
    account_expired         BOOLEAN NOT NULL DEFAULT FALSE,
    account_locked          BOOLEAN NOT NULL DEFAULT FALSE,
    credentials_expired     BOOLEAN NOT NULL DEFAULT FALSE,
    enabled                 BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ DEFAULT NOW()
);

--rollback DROP TABLE users;