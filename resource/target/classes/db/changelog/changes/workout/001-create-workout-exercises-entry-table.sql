--liquibase formatted sql

--changeset fwiecha:001-create-workout-exercises-entry
CREATE TABLE workout_exercises_entry (

    id UUID PRIMARY KEY,
    actual_sets INT NOT NULL,
    actual_reps INT NOT NULL,

    workout_id UUID NOT NULL,
    exercise_id UUID NOT NULL,

    FOREIGN KEY(workout_id) REFERENCES workouts(id),
    FOREIGN KEY(exercise_id) REFERENCES exercises(id),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--rollback DROP TABLE workout_exercises_entry;