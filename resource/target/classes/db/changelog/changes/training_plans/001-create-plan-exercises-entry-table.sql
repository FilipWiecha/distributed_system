--liquibase formatted sql

--changeset fwiecha:001-create-plan-exercises-entry
CREATE TABLE plan_exercises_entry (

    id UUID PRIMARY KEY,
    target_sets INT NOT NULL,
    target_reps INT NOT NULL,

    training_plan_id UUID NOT NULL,
    exercise_id UUID NOT NULL,

    FOREIGN KEY(training_plan_id) REFERENCES training_plans(id),
    FOREIGN KEY(exercise_id) REFERENCES exercises(id),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--rollback DROP TABLE plan_exercises_entry;