package com.filipwiecha.gym.workout.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import com.filipwiecha.gym.workout.models.Workout;

public interface WorkoutRepository extends JpaRepository<Workout, UUID> {

    Optional<Workout> findById(UUID id);
    Optional<Workout> findByIdAndEnabledTrue(UUID id);

    Slice<Workout> findByUserId(UUID id, Pageable pageable);
    Slice<Workout> findByUserIdAndEnabledTrue(UUID userId, Pageable pageable);

    Optional<Workout> findByIdAndUserId(UUID id, UUID userId);
    Optional<Workout> findByIdAndUserIdAndEnabledTrue(UUID id, UUID userId);

    Slice<Workout> findByUserIdAndTitleContainingIgnoreCase(UUID userId, String workoutTitle, Pageable pageable);
    
} 
