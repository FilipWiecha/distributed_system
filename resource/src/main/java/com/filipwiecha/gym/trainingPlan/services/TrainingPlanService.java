package com.filipwiecha.gym.trainingPlan.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.gym.exercises.models.Exercise;
import com.filipwiecha.gym.exercises.repositories.ExerciseRepository;
import com.filipwiecha.gym.trainingPlan.models.PlanExerciseEntry;
import com.filipwiecha.gym.trainingPlan.models.PlanExerciseEntryDto;
import com.filipwiecha.gym.trainingPlan.models.TrainingPlan;
import com.filipwiecha.gym.trainingPlan.models.TrainingPlanDto;
import com.filipwiecha.gym.trainingPlan.models.TrainingPlanMapper;
import com.filipwiecha.gym.trainingPlan.repositories.TrainingPlanRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class TrainingPlanService {

    private final TrainingPlanRepository trainingPlanRepository;
    private final ExerciseRepository exerciseRepository;
    private final TrainingPlanMapper trainingPlanMapper;


    @Transactional(readOnly = true)
    public TrainingPlan getById(UUID planId, UUID userId){
        return this.trainingPlanRepository
                .findByIdAndUserIdAndEnabledTrue(planId, userId)
                .orElseThrow(()-> new IllegalArgumentException("Training plan not found"));
    }

    @Transactional(readOnly = true)
    public Slice<TrainingPlan> getByUser(UUID userId, int pageNumber){
        Pageable pageable = PageRequest.of(pageNumber, 10);
        return this.trainingPlanRepository.findByUserIdAndEnabledTrue(
            userId,
            pageable
        );
    }

    @Transactional(readOnly = true)
    public Slice<TrainingPlan> findByName(String query, UUID userId, int pageNumber){
        Pageable pageable = PageRequest.of(pageNumber, 10);
        return this.trainingPlanRepository
                .findByUserIdAndTitleContainingIgnoreCase(
                    userId,
                    query,
                    pageable
                );
    }

    @Transactional
    public void createTrainingPlan(TrainingPlanDto dto, UUID userId){
        
        TrainingPlan plan = new TrainingPlan();
        plan.setTitle(dto.getTitle());
        plan.setDescription(dto.getDescription());
        plan.setEnabled(true);
        plan.setUserId(userId);

        if(dto.getExercises() != null && !dto.getExercises().isEmpty()){
            List<PlanExerciseEntry> entries = new ArrayList<>();
            for (PlanExerciseEntryDto entryDto : dto.getExercises()) {
                Optional<Exercise> exercise = this.exerciseRepository.findByIdAndUserIdAndEnabledTrue(entryDto.getExercise_id(), userId);
                if(exercise.isEmpty()) continue;
                
                PlanExerciseEntry newEntry = new PlanExerciseEntry();
                newEntry.setTargetSets(entryDto.getTargetSets());
                newEntry.setTargetReps(entryDto.getTargetReps());
                newEntry.setTrainingPlan(plan);
                newEntry.setExercise(exercise.get());
                
                entries.add(newEntry);
            }
            plan.setPlannedExercises(entries);
        }
        
        this.trainingPlanRepository.save(plan);
    }

    @Transactional
    public void disableTrainingPlan(UUID planId, UUID userId){
        TrainingPlan plan = this.trainingPlanRepository.findByIdAndUserIdAndEnabledTrue(planId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Training plan not found"));
        plan.setEnabled(false);
        this.trainingPlanRepository.save(plan);
    }

    @Transactional
    public void updateTrainingPlan(TrainingPlanDto dto, UUID userId){
        TrainingPlan plan = this.trainingPlanRepository
                    .findByIdAndUserIdAndEnabledTrue(UUID.fromString(dto.getId()), userId)
                    .orElseThrow(() -> new IllegalArgumentException("Training plan not found"));
        
        this.trainingPlanMapper.updateTrainingPlanFromDto(dto, plan);
        this.trainingPlanRepository.save(plan);
    }

    @Transactional
    public void addExerciseToPlan(UUID planId, PlanExerciseEntryDto entryDto, UUID userId) {
        
        TrainingPlan plan = this.trainingPlanRepository.findByIdAndUserIdAndEnabledTrue(planId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Training plan not found"));
        
        Exercise exercise = this.exerciseRepository.findByIdAndUserIdAndEnabledTrue(entryDto.getExercise_id(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));
        
        PlanExerciseEntry newEntry = new PlanExerciseEntry();
        newEntry.setTargetSets(entryDto.getTargetSets());
        newEntry.setTargetReps(entryDto.getTargetReps());
        newEntry.setTrainingPlan(plan);
        newEntry.setExercise(exercise);
        
        plan.getPlannedExercises().add(newEntry);
        this.trainingPlanRepository.save(plan);
    }

    @Transactional
    public void updatePlanExercise(UUID planId, UUID entryId, PlanExerciseEntryDto entryDto, UUID userId) {
        
        TrainingPlan plan = this.trainingPlanRepository.findByIdAndUserIdAndEnabledTrue(planId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Training plan not found"));
        
        PlanExerciseEntry entryToUpdate = plan.getPlannedExercises().stream()
                .filter(entry -> entry.getId().equals(entryId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Plan entry not found"));
        
        entryToUpdate.setTargetSets(entryDto.getTargetSets());
        entryToUpdate.setTargetReps(entryDto.getTargetReps());
        
        this.trainingPlanRepository.save(plan);
    }

    @Transactional
    public void removeExerciseFromPlan(UUID planId, UUID entryId, UUID userId) {
        
        TrainingPlan plan = this.trainingPlanRepository.findByIdAndUserIdAndEnabledTrue(planId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Training plan not found"));
        
        boolean removed = plan.getPlannedExercises().removeIf(entry -> entry.getId().equals(entryId));
        if (!removed) {
            throw new IllegalArgumentException("Plan entry not found");
        }
        
        this.trainingPlanRepository.save(plan);
    }
}