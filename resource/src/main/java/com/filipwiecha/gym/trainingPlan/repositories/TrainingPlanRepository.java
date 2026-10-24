package com.filipwiecha.gym.trainingPlan.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import com.filipwiecha.gym.trainingPlan.models.TrainingPlan;

public interface TrainingPlanRepository extends JpaRepository<TrainingPlan, UUID> {

    Optional<TrainingPlan> findByIdAndEnabledTrue(UUID id);

    Slice<TrainingPlan> findByUserIdAndEnabledTrue(UUID userId, Pageable pageable);

    Optional<TrainingPlan> findByIdAndUserIdAndEnabledTrue(UUID id, UUID userId);

    Slice<TrainingPlan> findByUserIdAndTitleContainingIgnoreCase(UUID userId, String title, Pageable pageable);
}