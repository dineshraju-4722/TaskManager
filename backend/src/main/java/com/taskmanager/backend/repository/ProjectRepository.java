package com.taskmanager.backend.repository;

import com.taskmanager.backend.model.Project;
import com.taskmanager.backend.model.ProjectStatus;
import com.taskmanager.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    // User Dashboard - Find projects a user is involved in (as a member)
    @Query("SELECT p FROM Project p JOIN p.members m WHERE m.id = :userId")
    List<Project> findProjectsByUserAsMember(@Param("userId") Long userId);
    
    // User Dashboard - Count projects a user is involved in
    @Query("SELECT COUNT(p) FROM Project p JOIN p.members m WHERE m.id = :userId")
    Long countProjectsByUserAsMember(@Param("userId") Long userId);
    
    // Admin Dashboard - Count projects created by a user (only ACTIVE)
    @Query("SELECT COUNT(p) FROM Project p WHERE p.createdBy.id = :userId AND p.status = 'ACTIVE'")
    Long countProjectsCreatedByUser(@Param("userId") Long userId);
    
    // Admin Dashboard - Find projects created by a user (only ACTIVE)
    @Query("SELECT p FROM Project p WHERE p.createdBy.id = :userId AND p.status = 'ACTIVE'")
    List<Project> findProjectsCreatedByUser(@Param("userId") Long userId);
    
    // Get all projects visible to a user (either created by them or they're a member of) - only ACTIVE
    @Query("SELECT DISTINCT p FROM Project p WHERE (p.createdBy.id = :userId OR p.id IN " +
           "(SELECT p2.id FROM Project p2 JOIN p2.members m WHERE m.id = :userId)) AND p.status = 'ACTIVE'")
    List<Project> findProjectsVisibleToUser(@Param("userId") Long userId);
    
    // Get all projects visible to a user with status filter
    @Query("SELECT DISTINCT p FROM Project p WHERE (p.createdBy.id = :userId OR p.id IN " +
           "(SELECT p2.id FROM Project p2 JOIN p2.members m WHERE m.id = :userId)) AND p.status = :status")
    List<Project> findProjectsVisibleToUserByStatus(@Param("userId") Long userId, @Param("status") ProjectStatus status);
    
    // Get all projects visible to a user (both active and completed)
    @Query("SELECT DISTINCT p FROM Project p WHERE (p.createdBy.id = :userId OR p.id IN " +
           "(SELECT p2.id FROM Project p2 JOIN p2.members m WHERE m.id = :userId)) ORDER BY p.status DESC, p.createdAt DESC")
    List<Project> findAllProjectsVisibleToUser(@Param("userId") Long userId);
}
