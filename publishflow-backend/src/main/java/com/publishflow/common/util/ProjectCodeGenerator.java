package com.publishflow.common.util;

import com.publishflow.domain.project.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Year;

@Component
@RequiredArgsConstructor
public class ProjectCodeGenerator {

    private final ProjectRepository projectRepository;

    public String generate() {
        int year = Year.now().getValue();
        long count = projectRepository.countByProjectCodeStartingWith("PF-" + year);
        return String.format("PF-%d-%05d", year, count + 1);
    }
}
