package com.filipwiecha.gym.trainingPlan.models;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-10-23T17:39:39+0200",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 25.0.4 (Oracle Corporation)"
)
@Component
public class TrainingPlanMapperImpl implements TrainingPlanMapper {

    @Override
    public void updateTrainingPlanFromDto(TrainingPlanDto dto, TrainingPlan entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getTitle() != null ) {
            entity.setTitle( dto.getTitle() );
        }
        if ( dto.getDescription() != null ) {
            entity.setDescription( dto.getDescription() );
        }
    }
}
