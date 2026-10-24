package com.filipwiecha.gym.workout.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "workouts")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Workout {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String description;

    private LocalDateTime startDate;

    private boolean enabled;

    private LocalDateTime createdAt;

    @Column(nullable = false)
    private UUID userId;


    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkoutExerciseEntry> executedExercises = new ArrayList<>();

    
    public Workout(WorkoutDto workoutDto, UUID userId){
        this.title = workoutDto.getTitle();
        this.description = workoutDto.getDescription();
        this.enabled = true;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
        this.startDate = workoutDto.getStartDate() != null ? workoutDto.getStartDate() : LocalDateTime.now();
    }
}

// to do auto localdatetime i createdat
