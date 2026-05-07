package com.taskmanager.backend.controller;

import com.taskmanager.backend.model.TaskStatus;
import com.taskmanager.backend.payload.response.AdminDashboardResponse;
import com.taskmanager.backend.payload.response.UserDashboardResponse;
import com.taskmanager.backend.repository.ProjectRepository;
import com.taskmanager.backend.repository.TaskRepository;
import com.taskmanager.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/user")
    public ResponseEntity<?> getUserDashboard() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        // Calculate user dashboard statistics
        Long totalProjectsInvolved = projectRepository.countProjectsByUserAsMember(userId);
        Long activeProjects = totalProjectsInvolved; // Assuming all projects are active for now
        Long totalTasks = taskRepository.countTasksByAssignedUser(userId);
        Long remainingTasks = taskRepository.countRemainingTasksByUser(userId);

        UserDashboardResponse response = new UserDashboardResponse(
                totalProjectsInvolved,
                activeProjects,
                totalTasks,
                remainingTasks
        );

        return ResponseEntity.ok(response);
    } 

    @GetMapping("/admin")
    public ResponseEntity<?> getAdminDashboard() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        // Calculate admin dashboard statistics - only count active projects
        Long totalProjectsCreated = projectRepository.countProjectsCreatedByUser(userId);
        Long activeProjects = totalProjectsCreated; // All counted projects are active due to the query filter
        // Count tasks in projects created by this admin (tasks assigned BY admin to others)
        Long totalTasksAssigned = taskRepository.countTasksInAdminProjects(userId);
        Long tasksCompleted = taskRepository.countCompletedTasksInAdminProjects(userId);

        AdminDashboardResponse response = new AdminDashboardResponse(
                totalProjectsCreated,
                activeProjects,
                totalTasksAssigned,
                tasksCompleted
        );

        return ResponseEntity.ok(response);
    }
}
