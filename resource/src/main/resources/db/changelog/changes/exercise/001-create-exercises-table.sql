--liquibase formatted sql

--changeset fwiecha:001-create-exercises
CREATE TABLE exercises (

    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,

    user_id UUID,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--rollback DROP TABLE exercises;