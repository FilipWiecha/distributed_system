package com.filipwiecha.gym.workout.models;

import java.util.UUID;

import com.filipwiecha.gym.exercises.models.Exercise;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "workout_exercises_entry")

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class WorkoutExerciseEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private int actualSets;

    @Column(nullable = false)
    private int actualReps;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    public WorkoutExerciseEntry(WorkoutExerciseEntryDto wDto){
        this.actualReps = wDto.getActualReps();
        this.actualSets = wDto.getActualSets();
    }

    public WorkoutExerciseEntry(WorkoutExerciseEntryDto wDto, Workout workout, Exercise exercise){
        this.actualReps = wDto.getActualReps();
        this.actualSets = wDto.getActualSets();
        this.workout = workout;
        this.exercise = exercise;
    }
}
