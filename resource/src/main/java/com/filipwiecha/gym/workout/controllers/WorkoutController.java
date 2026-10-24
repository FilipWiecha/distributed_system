package com.filipwiecha.gym.workout.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.filipwiecha.gym.workout.models.WorkoutDto;
import com.filipwiecha.gym.workout.models.WorkoutExerciseEntryDto;
import com.filipwiecha.gym.workout.services.WorkoutService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("workout")
@Validated
public class WorkoutController {
    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService){
        this.workoutService = workoutService;
    }

    @GetMapping()
    public ResponseEntity<?> getAllWorkouts(
        @AuthenticationPrincipal Jwt jwt,
        @RequestParam(name = "page", required = false, defaultValue = "0") @Min(0) @Max(100) int pageNumber
    ){
        

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                    WorkoutDto.toSlice(
                        this.workoutService.getByUser(UUID.fromString(jwt.getSubject()), pageNumber)
                    )
                );
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutDto> getWorkout(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID workoutId
    ){

        return ResponseEntity.status(HttpStatus.OK).body(
                new WorkoutDto(this.workoutService.getById(workoutId, UUID.fromString(jwt.getSubject())))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkout(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID workoutId
    ){
        this.workoutService.disableWorkout(workoutId, UUID.fromString(jwt.getSubject()));

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/search")
    public ResponseEntity<?> findWorkout(
        @AuthenticationPrincipal Jwt jwt,
        @RequestParam("query") String query,
        @RequestParam(name = "page", required = false, defaultValue = "0") @Min(0) @Max(100) int pageNumber
    ){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                    WorkoutDto.toSlice(
                        this.workoutService.findByName(query, UUID.fromString(jwt.getSubject()), pageNumber)
                    )
                );
    }

    // TO DO: sprawdzic te validationResult czy to potrzebne
    @PostMapping()
    public ResponseEntity<?> createWorkout(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody WorkoutDto workoutDto
    ){

        this.workoutService.createWorkout(workoutDto, UUID.fromString(jwt.getSubject()));

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping()
    public ResponseEntity<?> patchWorkout(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody WorkoutDto workoutDto
    ){
        this.workoutService.updateWorkout(workoutDto, UUID.fromString(jwt.getSubject()));

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/{id}/exercises")
    public ResponseEntity<?> addExerciseToWorkout(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID workoutId,
        @Valid @RequestBody WorkoutExerciseEntryDto entryDto
    ) {
        this.workoutService.addExerciseToWorkout(workoutId, entryDto, UUID.fromString(jwt.getSubject()));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping("/{id}/exercises/{entryId}")
    public ResponseEntity<?> updateWorkoutExercise(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID workoutId,
        @PathVariable("entryId") UUID entryId,
        @Valid @RequestBody WorkoutExerciseEntryDto entryDto
    ) {
        this.workoutService.updateWorkoutExercise(workoutId, entryId, entryDto, UUID.fromString(jwt.getSubject()));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/{id}/exercises/{entryId}")
    public ResponseEntity<?> removeExerciseFromWorkout(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID workoutId,
        @PathVariable("entryId") UUID entryId
    ) {
        this.workoutService.removeExerciseFromWorkout(workoutId, entryId, UUID.fromString(jwt.getSubject()));
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
