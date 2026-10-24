package com.filipwiecha.gym.trainingPlan.models;

import java.util.List;

import org.springframework.data.domain.Slice;

import com.filipwiecha.gym.config.SliceResponse;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class TrainingPlanDto {
    
    private String id;

    @NotBlank
    @Size(min = 1, max = 100)
    private String title;

    @Size(max = 250)
    private String description;

    private List<PlanExerciseEntryDto> exercises;

    public TrainingPlanDto(TrainingPlan plan){
        this.id = plan.getId().toString();
        this.title = plan.getTitle();
        this.description = plan.getDescription();
        this.exercises = PlanExerciseEntryDto.toList(plan.getPlannedExercises());
    }

    public static List<TrainingPlanDto> toList(List<TrainingPlan> list){
        return list.stream().map(TrainingPlanDto::new).toList();
    }

    public static SliceResponse<TrainingPlanDto> toSlice(Slice<TrainingPlan> slice){
        return SliceResponse.of(slice.map(TrainingPlanDto::new));
    }
}