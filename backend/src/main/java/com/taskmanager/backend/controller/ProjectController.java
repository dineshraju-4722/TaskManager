package com.taskmanager.backend.controller;

import com.taskmanager.backend.model.Project;
import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.payload.request.ProjectRequest;
import com.taskmanager.backend.payload.request.TaskRequest;
import com.taskmanager.backend.security.services.UserDetailsImpl;
import com.taskmanager.backend.service.ProjectService;
import com.taskmanager.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import com.taskmanager.backend.model.ProjectStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TaskService taskService;

    private Long getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    private boolean canAccessProject(Project project) {
        Long userId = getCurrentUserId();
        // Can access if created the project or is a member
        if (project.getCreatedBy() != null && project.getCreatedBy().getId().equals(userId)) {
            return true;
        }
        return project.getMembers().stream().anyMatch(m -> m.getId().equals(userId));
    }

    @PostMapping
    public ResponseEntity<Project> create(@RequestBody ProjectRequest req) {
        return ResponseEntity.ok(projectService.createProject(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> update(@PathVariable Long id, @RequestBody ProjectRequest req) {
        Project p = projectService.getProject(id);
        if (p == null || !canAccessProject(p)) return ResponseEntity.notFound().build();
        
        Project updated = projectService.updateProject(id, req);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Project p = projectService.getProject(id);
        if (p == null || !canAccessProject(p)) return ResponseEntity.notFound().build();
        
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Project>> all(@RequestParam(required = false) String status) {
        Long userId = getCurrentUserId();
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(projectService.getProjectsForUserByStatus(userId, ProjectStatus.valueOf(status)));
        }
        return ResponseEntity.ok(projectService.getProjectsForUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> get(@PathVariable Long id) {
        Project p = projectService.getProject(id);
        if (p == null || !canAccessProject(p)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(p);
    }

    @PostMapping("/{projectId}/members/{userId}")
    public ResponseEntity<Project> addMember(@PathVariable Long projectId, @PathVariable Long userId) {
        Project p = projectService.getProject(projectId);
        if (p == null || !canAccessProject(p)) return ResponseEntity.notFound().build();
        
        Project updated = projectService.addMember(projectId, userId);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<Task>> getProjectTasks(@PathVariable Long projectId) {
        Project p = projectService.getProject(projectId);
        if (p == null || !canAccessProject(p)) return ResponseEntity.notFound().build();
        
        return ResponseEntity.ok(taskService.getTasksByProjectId(projectId));
    }

    @PostMapping("/{projectId}/tasks")
    public ResponseEntity<Task> createTask(@PathVariable Long projectId, @RequestBody TaskRequest req) {
        Project p = projectService.getProject(projectId);
        if (p == null || !canAccessProject(p)) return ResponseEntity.notFound().build();
        
        req.setProjectId(projectId);
        return ResponseEntity.ok(taskService.createTask(req));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Project> completeProject(@PathVariable Long id) {
        Project p = projectService.getProject(id);
        if (p == null || !canAccessProject(p)) return ResponseEntity.notFound().build();
        
        // Only creator (admin) can complete a project
        Long userId = getCurrentUserId();
        if (p.getCreatedBy() == null || !p.getCreatedBy().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(projectService.completeProject(id));
    }
}
