package com.filipwiecha.gym.exercises.models;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exercises")

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class Exercise {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 200)
    private String description;

    private boolean enabled;

    private LocalDateTime createdAt;

    @Column(nullable = false)
    private UUID userId;

    public Exercise(ExerciseDto exerciseDto, UUID userId){
        this.name = exerciseDto.getName();
        this.description = exerciseDto.getDescription();
        this.enabled = true;
        this.userId = userId;
        this.createdAt = null;
    }
}
