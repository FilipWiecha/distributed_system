package com.filipwiecha.gym.config;

import java.util.List;
import org.springframework.data.domain.Slice;

public record SliceResponse<T>(
    List<T> content,
    boolean hasNext
) {
    public static <T> SliceResponse<T> of(Slice<T> slice) {
        return new SliceResponse<>(
            slice.getContent(),
            slice.hasNext()
        );
    }
}