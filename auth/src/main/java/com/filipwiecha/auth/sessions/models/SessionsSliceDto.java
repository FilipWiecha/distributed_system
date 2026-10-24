package com.filipwiecha.auth.sessions.models;

import java.util.List;

import org.springframework.data.domain.Slice;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionsSliceDto {
    
    private List<SessionsDto> sessions;
    private boolean hasNext;

    public SessionsSliceDto(Slice<Sessions> sessions){
        this.sessions = SessionsDto.toList(sessions.getContent());
        this.hasNext = sessions.hasNext();
    }

}
