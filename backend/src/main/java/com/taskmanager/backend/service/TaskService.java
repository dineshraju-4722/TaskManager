package com.taskmanager.backend.service;

import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.payload.request.TaskRequest;

import java.util.List;

public interface TaskService {
    Task createTask(TaskRequest request);
    Task updateTask(Long id, TaskRequest request);
    void deleteTask(Long id);
    Task assignTask(Long taskId, Long userId);
    Task assignUsersToTask(Long taskId, List<Long> userIds);
    List<Task> getTasksByStatus(String status);
    List<Task> getTasksByProjectId(Long projectId);
    List<Task> getAllTasks();
}
