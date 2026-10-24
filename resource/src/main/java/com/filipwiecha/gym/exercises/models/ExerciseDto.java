package com.filipwiecha.gym.exercises.models;

import java.util.List;

import org.springframework.data.domain.Slice;

import com.filipwiecha.gym.config.SliceResponse;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseDto {
    
    private String id;

    @NotBlank
    @Size(min = 1, max = 255, message = "The name of exercise must be bettwen 1 and 255") 
    private String name;

    @Size(min = 0, max = 255, message = "The name of exercise must be bettwen 0 and 255") 
    private String description;

    public ExerciseDto(Exercise exercise){
        this.id = exercise.getId().toString();
        this.name = exercise.getName();
        this.description = exercise.getDescription();
    }

    public static List<ExerciseDto> toList(List<Exercise> eList){
        return eList.stream().map(ExerciseDto::new).toList();
    }

    public static SliceResponse<ExerciseDto> toSlice(Slice<Exercise> eSlice){
        
       return SliceResponse.of(eSlice.map(ExerciseDto::new));
    }

}
