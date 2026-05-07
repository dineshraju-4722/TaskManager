package com.taskmanager.backend.payload.response;

public class AdminDashboardResponse {
    private Long totalProjectsCreated;
    private Long activeProjects;
    private Long totalTasksAssigned;
    private Long tasksCompleted;

    public AdminDashboardResponse(Long totalProjectsCreated, Long activeProjects, Long totalTasksAssigned, Long tasksCompleted) {
        this.totalProjectsCreated = totalProjectsCreated;
        this.activeProjects = activeProjects;
        this.totalTasksAssigned = totalTasksAssigned;
        this.tasksCompleted = tasksCompleted;
    }

    public Long getTotalProjectsCreated() {
        return totalProjectsCreated;
    }

    public void setTotalProjectsCreated(Long totalProjectsCreated) {
        this.totalProjectsCreated = totalProjectsCreated;
    }

    public Long getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(Long activeProjects) {
        this.activeProjects = activeProjects;
    }

    public Long getTotalTasksAssigned() {
        return totalTasksAssigned;
    }

    public void setTotalTasksAssigned(Long totalTasksAssigned) {
        this.totalTasksAssigned = totalTasksAssigned;
    }

    public Long getTasksCompleted() {
        return tasksCompleted;
    }

    public void setTasksCompleted(Long tasksCompleted) {
        this.tasksCompleted = tasksCompleted;
    }
}
