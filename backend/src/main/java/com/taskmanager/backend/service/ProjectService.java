package com.taskmanager.backend.service;

import com.taskmanager.backend.model.Project;
import com.taskmanager.backend.model.ProjectStatus;
import com.taskmanager.backend.payload.request.ProjectRequest;

import java.util.List;

public interface ProjectService {
    Project createProject(ProjectRequest request);
    Project updateProject(Long id, ProjectRequest request);
    void deleteProject(Long id);
    List<Project> getAllProjects();
    List<Project> getProjectsForUser(Long userId);
    List<Project> getProjectsForUserByStatus(Long userId, ProjectStatus status);
    Project getProject(Long id);
    Project addMember(Long projectId, Long userId);
    Project completeProject(Long projectId);
}
