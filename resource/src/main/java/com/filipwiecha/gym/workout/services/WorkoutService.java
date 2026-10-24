package com.filipwiecha.gym.workout.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.gym.exercises.models.Exercise;
import com.filipwiecha.gym.exercises.repositories.ExerciseRepository;
import com.filipwiecha.gym.workout.models.Workout;
import com.filipwiecha.gym.workout.models.WorkoutDto;
import com.filipwiecha.gym.workout.models.WorkoutExerciseEntry;
import com.filipwiecha.gym.workout.models.WorkoutExerciseEntryDto;
import com.filipwiecha.gym.workout.models.WorkoutMapper;
import com.filipwiecha.gym.workout.repositories.WorkoutRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;
    private final WorkoutMapper workoutMapper;


    @Transactional(readOnly = true)
    public Workout getById(UUID workoutId){
        return this.workoutRepository.findByIdAndEnabledTrue(workoutId).orElseThrow(()-> new IllegalArgumentException("Workout not found"));
    }

    @Transactional(readOnly = true)
    public Workout getById(UUID workoutId, UUID userId){
        return this.workoutRepository
                .findByIdAndUserIdAndEnabledTrue(workoutId, userId)
                .orElseThrow(()-> new IllegalArgumentException("Workout not found"));
    }

    @Transactional(readOnly = true)
    public Slice<Workout> getByUser(UUID userId, int pageNumber){
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by("createdAt").descending());

        return this.workoutRepository.findByUserIdAndEnabledTrue(
            userId,
            pageable
        );
    }

    @Transactional(readOnly = true)
    public Slice<Workout> findByName(String exerciseName, UUID userId, int pageNumber){
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by("createdAt").descending());

        return this.workoutRepository
                .findByUserIdAndTitleContainingIgnoreCase(
                    userId,
                    exerciseName,
                    pageable
                );
    }

    @Transactional
    public void createWorkout(WorkoutDto workoutDto, UUID userId){

        Workout workout = new Workout(workoutDto, userId);
        
        
        if(workoutDto.getExercises() != null && !workoutDto.getExercises().isEmpty()){
            List<WorkoutExerciseEntry> wEntries = new ArrayList<>();
            for (WorkoutExerciseEntryDto wEntryDto : workoutDto.getExercises()) {
                
                Optional<Exercise> exercise = this.exerciseRepository.findByIdAndUserIdAndEnabledTrue(wEntryDto.getExercise_id(), userId);
                if(exercise.isEmpty()) continue;
                wEntries.add(new WorkoutExerciseEntry(wEntryDto, workout, exercise.get())); 
            }

            workout.setExecutedExercises(wEntries);
        }
        
        this.workoutRepository.save(workout);
    }

    @Transactional
    public void disableWorkout(UUID workoutId, UUID userId){
        
        Workout workout = this.workoutRepository.findByIdAndUserIdAndEnabledTrue(workoutId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found"));
        workout.setEnabled(false);

        this.workoutRepository.save(workout);
    }

    @Transactional
    public void updateWorkout(WorkoutDto workoutDto, UUID userId){
        
        Workout workout = this.workoutRepository
                    .findByIdAndUserIdAndEnabledTrue(UUID.fromString(workoutDto.getId()), userId)
                    .orElseThrow(() -> new IllegalArgumentException("Workout not found"));
        
        this.workoutMapper.updateWorkoutFromDto(workoutDto, workout);
        this.workoutRepository.save(workout);

    }

    @Transactional
    public void addExerciseToWorkout(UUID workoutId, WorkoutExerciseEntryDto entryDto, UUID userId) {
        
        Workout workout = this.workoutRepository.findByIdAndUserIdAndEnabledTrue(workoutId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found"));
        
        Exercise exercise = this.exerciseRepository.findByIdAndUserIdAndEnabledTrue(entryDto.getExercise_id(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));
        
        WorkoutExerciseEntry newEntry = new WorkoutExerciseEntry(entryDto, workout, exercise);
        workout.getExecutedExercises().add(newEntry);
        
        this.workoutRepository.save(workout);
    }

    @Transactional
    public void updateWorkoutExercise(UUID workoutId, UUID entryId, WorkoutExerciseEntryDto entryDto, UUID userId) {
        
        Workout workout = this.workoutRepository.findByIdAndUserIdAndEnabledTrue(workoutId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found"));
        
        WorkoutExerciseEntry entryToUpdate = workout.getExecutedExercises().stream()
                .filter(entry -> entry.getId().equals(entryId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Workout entry not found"));
        
        entryToUpdate.setActualSets(entryDto.getActualSets());
        entryToUpdate.setActualReps(entryDto.getActualReps());
        
        this.workoutRepository.save(workout);
        
        
    }

    @Transactional
    public void removeExerciseFromWorkout(UUID workoutId, UUID entryId, UUID userId) {
        
        Workout workout = this.workoutRepository.findByIdAndUserIdAndEnabledTrue(workoutId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found"));
        
        boolean removed = workout.getExecutedExercises().removeIf(entry -> entry.getId().equals(entryId));
        if (!removed) {
            throw new IllegalArgumentException("Workout entry not found");
        }
        
        this.workoutRepository.save(workout);   
        
    }

}
