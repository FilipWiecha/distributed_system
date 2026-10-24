package com.filipwiecha.gym.trainingPlan.models;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class PlanExerciseEntryDto {
    
    private UUID id;
    private int targetSets;
    private int targetReps;
    private UUID training_plan_id;
    private UUID exercise_id;
    private String exercise_name;

    public PlanExerciseEntryDto(PlanExerciseEntry entry){
        this.id = entry.getId();
        this.targetSets = entry.getTargetSets();
        this.targetReps = entry.getTargetReps();
        this.training_plan_id = entry.getTrainingPlan().getId();
        this.exercise_id = entry.getExercise().getId();
        this.exercise_name = entry.getExercise().getName();
    }

    public static List<PlanExerciseEntryDto> toList(List<PlanExerciseEntry> entries){
        return entries.stream().map(PlanExerciseEntryDto::new).toList();
    }
}