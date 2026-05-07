package com.taskmanager.backend.service.impl;

import com.taskmanager.backend.model.Project;
import com.taskmanager.backend.model.User;
import com.taskmanager.backend.payload.request.ProjectRequest;
import com.taskmanager.backend.repository.ProjectRepository;
import com.taskmanager.backend.repository.UserRepository;
import com.taskmanager.backend.security.services.UserDetailsImpl;
import com.taskmanager.backend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Project createProject(ProjectRequest request) {
        Project p = new Project(request.getName(), request.getDescription());
        
        // Set the creator of the project
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> creator = userRepository.findById(userDetails.getId());
        if (creator.isPresent()) {
            p.setCreatedBy(creator.get());
        }
        
        if (request.getMemberIds() != null) {
            Set<User> members = new HashSet<>();
            for (Long id : request.getMemberIds()) {
                userRepository.findById(id).ifPresent(members::add);
            }
            p.setMembers(members);
        }
        return projectRepository.save(p);
    }

    @Override
    public Project updateProject(Long id, ProjectRequest request) {
        Optional<Project> opt = projectRepository.findById(id);
        if (opt.isEmpty()) return null;
        Project p = opt.get();
        p.setName(request.getName());
        p.setDescription(request.getDescription());
        if (request.getMemberIds() != null) {
            Set<User> members = new HashSet<>();
            for (Long uid : request.getMemberIds()) {
                userRepository.findById(uid).ifPresent(members::add);
            }
            p.setMembers(members);
        }
        return projectRepository.save(p);
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public List<Project> getProjectsForUser(Long userId) {
        return projectRepository.findProjectsVisibleToUser(userId);
    }

    @Override
    public List<Project> getProjectsForUserByStatus(Long userId, com.taskmanager.backend.model.ProjectStatus status) {
        return projectRepository.findProjectsVisibleToUserByStatus(userId, status);
    }

    @Override
    public Project getProject(Long id) {
        return projectRepository.findById(id).orElse(null);
    }

    @Override
    public Project addMember(Long projectId, Long userId) {
        Optional<Project> opt = projectRepository.findById(projectId);
        Optional<User> uOpt = userRepository.findById(userId);
        if (opt.isEmpty() || uOpt.isEmpty()) return null;
        Project p = opt.get();
        p.getMembers().add(uOpt.get());
        return projectRepository.save(p);
    }

    @Override
    public Project completeProject(Long projectId) {
        Optional<Project> opt = projectRepository.findById(projectId);
        if (opt.isEmpty()) return null;
        Project p = opt.get();
        p.setStatus(com.taskmanager.backend.model.ProjectStatus.COMPLETED);
        return projectRepository.save(p);
    }
}
