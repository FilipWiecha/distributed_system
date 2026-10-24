package com.filipwiecha.gym.exercises.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import com.filipwiecha.gym.exercises.models.Exercise;

public interface ExerciseRepository extends JpaRepository<Exercise,UUID> {
    
    Optional<Exercise> findById(UUID id);
    Optional<Exercise> findByIdAndEnabledTrue(UUID id);

    Slice<Exercise> findByUserId(UUID id, Pageable pageable);
    Slice<Exercise> findByUserIdAndEnabledTrue(UUID userId, Pageable pageable);

    Optional<Exercise> findByIdAndUserId(UUID id, UUID userId);
    Optional<Exercise> findByIdAndUserIdAndEnabledTrue(UUID id, UUID userId);

    Slice<Exercise> findByUserIdAndNameContainingIgnoreCase(UUID userId, String exerciseName,Pageable pageable);
}
