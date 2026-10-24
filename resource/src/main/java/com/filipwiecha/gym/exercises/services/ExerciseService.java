package com.filipwiecha.gym.exercises.services;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.gym.exercises.models.Exercise;
import com.filipwiecha.gym.exercises.models.ExerciseDto;
import com.filipwiecha.gym.exercises.models.ExerciseMapper;
import com.filipwiecha.gym.exercises.repositories.ExerciseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class ExerciseService {
    
    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;


    @Transactional(readOnly = true)
    public Exercise getById(UUID exerciseId){
        return this.exerciseRepository.findByIdAndEnabledTrue(exerciseId).orElseThrow(()-> new IllegalArgumentException("Exercise not found"));
    }

    @Transactional(readOnly = true)
    public Exercise getById(UUID exerciseId, UUID userId){
        return this.exerciseRepository
                .findByIdAndUserIdAndEnabledTrue(exerciseId, userId)
                .orElseThrow(()-> new IllegalArgumentException("Exercise not found"));
    }

    @Transactional(readOnly = true)
    public Slice<Exercise> getByUser(UUID userId, int pageNumber){
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by("createdAt").descending());

        return this.exerciseRepository.findByUserIdAndEnabledTrue(
            userId,
            pageable
        );
    }

    @Transactional(readOnly = true)
    public Slice<Exercise> findByName(String exerciseName, UUID userId, int pageNumber){
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by("createdAt").descending());

        return this.exerciseRepository
                .findByUserIdAndNameContainingIgnoreCase(
                    userId,
                    exerciseName,
                    pageable
                );
    }

    @Transactional
    public void createExercise(ExerciseDto exerciseDto, UUID userId){

        Exercise exercise = new Exercise(exerciseDto, userId);
        this.exerciseRepository.save(exercise);
    }

    @Transactional
    public void disableWorkout(UUID exerciseId, UUID userId){

        Exercise exercise = this.exerciseRepository
                            .findByIdAndUserIdAndEnabledTrue(exerciseId, userId)
                            .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));

        exercise.setEnabled(false);

        this.exerciseRepository.save(exercise);
    }

    @Transactional
    public void updateExercise(ExerciseDto exerciseDto, UUID userId){

        Exercise exercise = this.exerciseRepository
                    .findByIdAndUserIdAndEnabledTrue(UUID.fromString(exerciseDto.getId()), userId)
                    .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));
        
        this.exerciseMapper.updateExerciseFromDto(exerciseDto, exercise);
    }

}
