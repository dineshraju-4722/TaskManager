package com.taskmanager.backend.service.impl;

import com.taskmanager.backend.model.*;
import com.taskmanager.backend.payload.request.TaskRequest;
import com.taskmanager.backend.repository.ProjectRepository;
import com.taskmanager.backend.repository.TaskRepository;
import com.taskmanager.backend.repository.UserRepository;
import com.taskmanager.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public Task createTask(TaskRequest request) {
        Task t = new Task();
        t.setTitle(request.getTitle());
        t.setDescription(request.getDescription());
        if (request.getPriority() != null) {
            t.setPriority(Priority.valueOf(request.getPriority()));
        }
        if (request.getStatus() != null) {
            t.setStatus(TaskStatus.valueOf(request.getStatus()));
        }
        if (request.getDueDate() != null && !request.getDueDate().isEmpty()) {
            t.setDueDate(Instant.parse(request.getDueDate()));
        }
        
        // Handle multiple assignees
        if (request.getAssignedUserIds() != null && !request.getAssignedUserIds().isEmpty()) {
            Set<User> assignedUsers = new HashSet<>();
            for (Long userId : request.getAssignedUserIds()) {
                userRepository.findById(userId).ifPresent(assignedUsers::add);
            }
            t.setAssignedUsers(assignedUsers);
        }
        
        if (request.getProjectId() != null) {
            projectRepository.findById(request.getProjectId()).ifPresent(t::setProject);
        }
        return taskRepository.save(t);
    }

    @Override
    public Task updateTask(Long id, TaskRequest request) {
        Optional<Task> opt = taskRepository.findById(id);
        if (opt.isEmpty()) return null;
        Task t = opt.get();
        if (request.getTitle() != null) t.setTitle(request.getTitle());
        if (request.getDescription() != null) t.setDescription(request.getDescription());
        if (request.getPriority() != null) t.setPriority(Priority.valueOf(request.getPriority()));
        if (request.getStatus() != null) t.setStatus(TaskStatus.valueOf(request.getStatus()));
        if (request.getDueDate() != null && !request.getDueDate().isEmpty()) t.setDueDate(Instant.parse(request.getDueDate()));
        
        // Handle multiple assignees
        if (request.getAssignedUserIds() != null) {
            Set<User> assignedUsers = new HashSet<>();
            for (Long userId : request.getAssignedUserIds()) {
                userRepository.findById(userId).ifPresent(assignedUsers::add);
            }
            t.setAssignedUsers(assignedUsers);
        }
        
        if (request.getProjectId() != null) projectRepository.findById(request.getProjectId()).ifPresent(t::setProject);
        return taskRepository.save(t);
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Override
    public Task assignTask(Long taskId, Long userId) {
        Optional<Task> tOpt = taskRepository.findById(taskId);
        Optional<User> uOpt = userRepository.findById(userId);
        if (tOpt.isEmpty() || uOpt.isEmpty()) return null;
        Task t = tOpt.get();
        t.getAssignedUsers().add(uOpt.get());
        return taskRepository.save(t);
    }

    @Override
    public Task assignUsersToTask(Long taskId, List<Long> userIds) {
        Optional<Task> tOpt = taskRepository.findById(taskId);
        if (tOpt.isEmpty()) return null;
        Task t = tOpt.get();
        
        Set<User> assignedUsers = new HashSet<>();
        for (Long userId : userIds) {
            userRepository.findById(userId).ifPresent(assignedUsers::add);
        }
        t.setAssignedUsers(assignedUsers);
        return taskRepository.save(t);
    }

    @Override
    public List<Task> getTasksByStatus(String status) {
        TaskStatus s = TaskStatus.valueOf(status);
        return taskRepository.findByStatus(s);
    }

    @Override
    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
}

