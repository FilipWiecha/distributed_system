package com.filipwiecha.gym.workout.models;

import java.time.LocalDateTime;
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
public class WorkoutDto {
    
    private String id;

    @NotBlank
    @Size(min = 1, max = 255)
    private String title;

    @Size(min = 1, max = 255)
    private String description;

    private LocalDateTime startDate;

    private List<WorkoutExerciseEntryDto> exercises;

    public WorkoutDto(Workout workout){
        this.title = workout.getTitle();
        this.description = workout.getDescription();
        this.startDate = workout.getStartDate();
        this.id = workout.getId().toString();
        this.exercises = WorkoutExerciseEntryDto.toList(workout.getExecutedExercises());
    }

    public static List<WorkoutDto> toList(List<Workout> eList){
        return eList.stream().map(WorkoutDto::new).toList();
    }

    public static SliceResponse<WorkoutDto> toSlice(Slice<Workout> eSlice){
        
       return SliceResponse.of(eSlice.map(WorkoutDto::new));
    }
}
