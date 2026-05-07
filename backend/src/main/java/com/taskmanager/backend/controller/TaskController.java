package com.taskmanager.backend.controller;

import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.payload.request.TaskRequest;
import com.taskmanager.backend.security.services.UserDetailsImpl;
import com.taskmanager.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    private boolean isAdmin() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(auth -> auth.equals("ROLE_ADMIN"));
    }

    @PostMapping
    public ResponseEntity<Task> create(@RequestBody TaskRequest req) {
        return ResponseEntity.ok(taskService.createTask(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody TaskRequest req) {
        // Only admins can update tasks
        if (!isAdmin()) {
            return ResponseEntity.status(403).build();
        }
        Task t = taskService.updateTask(id, req);
        if (t == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(t);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        // Only admins can delete tasks
        if (!isAdmin()) {
            return ResponseEntity.status(403).build();
        }
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{taskId}/assign/{userId}")
    public ResponseEntity<Task> assign(@PathVariable Long taskId, @PathVariable Long userId) {
        // Only admins can assign tasks
        if (!isAdmin()) {
            return ResponseEntity.status(403).build();
        }
        Task t = taskService.assignTask(taskId, userId);
        if (t == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(t);
    }

    @PostMapping("/{taskId}/assign-users")
    public ResponseEntity<Task> assignUsers(@PathVariable Long taskId, @RequestBody List<Long> userIds) {
        // Only admins can assign tasks
        if (!isAdmin()) {
            return ResponseEntity.status(403).build();
        }
        Task t = taskService.assignUsersToTask(taskId, userIds);
        if (t == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(t);
    }

    @GetMapping
    public ResponseEntity<List<Task>> all(@RequestParam(value = "status", required = false) String status) {
        if (status != null) return ResponseEntity.ok(taskService.getTasksByStatus(status));
        return ResponseEntity.ok(taskService.getAllTasks());
    }
}
