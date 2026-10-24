package com.filipwiecha.gym.trainingPlan.controllers;

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

import com.filipwiecha.gym.trainingPlan.models.PlanExerciseEntryDto;
import com.filipwiecha.gym.trainingPlan.models.TrainingPlanDto;
import com.filipwiecha.gym.trainingPlan.services.TrainingPlanService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("trainingplan")
@Validated
public class TrainingPlanController {
    
    private final TrainingPlanService trainingPlanService;

    public TrainingPlanController(TrainingPlanService trainingPlanService){
        this.trainingPlanService = trainingPlanService;
    }

    @GetMapping()
    public ResponseEntity<?> getAllTrainingPlans(
        @AuthenticationPrincipal Jwt jwt,
        @RequestParam(name = "page", required = false, defaultValue = "0") @Min(0) @Max(100) int pageNumber
    ){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                    TrainingPlanDto.toSlice(
                        this.trainingPlanService.getByUser(UUID.fromString(jwt.getSubject()), pageNumber)
                    )
                );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingPlanDto> getTrainingPlan(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID planId
    ){
        return ResponseEntity.status(HttpStatus.OK).body(
                new TrainingPlanDto(this.trainingPlanService.getById(planId, UUID.fromString(jwt.getSubject())))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrainingPlan(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID planId
    ){
        this.trainingPlanService.disableTrainingPlan(planId, UUID.fromString(jwt.getSubject()));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/search")
    public ResponseEntity<?> findTrainingPlan(
        @AuthenticationPrincipal Jwt jwt,
        @RequestParam("query") String query,
        @RequestParam(name = "page", required = false, defaultValue = "0") @Min(0) @Max(100) int pageNumber
    ){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                    TrainingPlanDto.toSlice(
                        this.trainingPlanService.findByName(query, UUID.fromString(jwt.getSubject()), pageNumber)
                    )
                );
    }

    @PostMapping()
    public ResponseEntity<?> createTrainingPlan(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody TrainingPlanDto dto
    ){
        this.trainingPlanService.createTrainingPlan(dto, UUID.fromString(jwt.getSubject()));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping()
    public ResponseEntity<?> patchTrainingPlan(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody TrainingPlanDto dto
    ){
        this.trainingPlanService.updateTrainingPlan(dto, UUID.fromString(jwt.getSubject()));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/{id}/exercises")
    public ResponseEntity<?> addExerciseToPlan(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID planId,
        @Valid @RequestBody PlanExerciseEntryDto entryDto
    ) {
        this.trainingPlanService.addExerciseToPlan(planId, entryDto, UUID.fromString(jwt.getSubject()));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping("/{id}/exercises/{entryId}")
    public ResponseEntity<?> updatePlanExercise(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID planId,
        @PathVariable("entryId") UUID entryId,
        @Valid @RequestBody PlanExerciseEntryDto entryDto
    ) {
        this.trainingPlanService.updatePlanExercise(planId, entryId, entryDto, UUID.fromString(jwt.getSubject()));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/{id}/exercises/{entryId}")
    public ResponseEntity<?> removeExerciseFromPlan(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID planId,
        @PathVariable("entryId") UUID entryId
    ) {
        this.trainingPlanService.removeExerciseFromPlan(planId, entryId, UUID.fromString(jwt.getSubject()));
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}