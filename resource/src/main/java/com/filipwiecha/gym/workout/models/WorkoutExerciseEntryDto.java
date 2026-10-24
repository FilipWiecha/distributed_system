package com.filipwiecha.gym.workout.models;

import java.util.List;
import java.util.UUID;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class WorkoutExerciseEntryDto {
    
    private UUID id;
    private int actualSets;
    private int actualReps;

    private UUID workout_id;

    private UUID exercise_id;
    private String exercise_name;

    public WorkoutExerciseEntryDto(WorkoutExerciseEntry workoutExerciseEntry){
        this.id = workoutExerciseEntry.getId();
        this.actualSets = workoutExerciseEntry.getActualSets();
        this.actualReps = workoutExerciseEntry.getActualReps();
        this.workout_id = workoutExerciseEntry.getWorkout().getId();
        this.exercise_id = workoutExerciseEntry.getExercise().getId();
        this.exercise_name = workoutExerciseEntry.getExercise().getName();
    }

    public static List<WorkoutExerciseEntryDto> toList(List<WorkoutExerciseEntry> wEntries){
        return wEntries.stream().map(WorkoutExerciseEntryDto::new).toList();
    }
}
