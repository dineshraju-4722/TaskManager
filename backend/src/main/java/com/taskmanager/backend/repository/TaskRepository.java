package com.taskmanager.backend.repository;

import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByProjectId(Long projectId);
    
    // User Dashboard Queries - count tasks assigned to user
    @Query("SELECT COUNT(t) FROM Task t JOIN t.assignedUsers u WHERE u.id = :userId")
    Long countTasksByAssignedUser(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(t) FROM Task t JOIN t.assignedUsers u WHERE u.id = :userId AND t.status != 'DONE'")
    Long countRemainingTasksByUser(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(t) FROM Task t JOIN t.assignedUsers u WHERE u.id = :userId AND t.status = 'DONE'")
    Long countCompletedTasksByUser(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Task t JOIN t.assignedUsers u WHERE u.id = :userId AND t.status != 'DONE'")
    List<Task> findRemainingTasksByUser(@Param("userId") Long userId);
    
    // Admin Dashboard Queries
    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id IN (SELECT p.id FROM Project p)")
    Long countAllTasks();
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = 'DONE'")
    Long countCompletedTasks();
    
    // Admin Dashboard - Count tasks in projects created by admin
    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id IN (SELECT p.id FROM Project p WHERE p.createdBy.id = :adminId)")
    Long countTasksInAdminProjects(@Param("adminId") Long adminId);
    
    // Admin Dashboard - Count completed tasks in projects created by admin
    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id IN (SELECT p.id FROM Project p WHERE p.createdBy.id = :adminId) AND t.status = 'DONE'")
    Long countCompletedTasksInAdminProjects(@Param("adminId") Long adminId);
}
