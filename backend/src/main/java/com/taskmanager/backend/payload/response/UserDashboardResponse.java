package com.taskmanager.backend.payload.response;

public class UserDashboardResponse {
    private Long totalProjectsInvolved;
    private Long activeProjects;
    private Long totalTasks;
    private Long remainingTasks;

    public UserDashboardResponse(Long totalProjectsInvolved, Long activeProjects, Long totalTasks, Long remainingTasks) {
        this.totalProjectsInvolved = totalProjectsInvolved;
        this.activeProjects = activeProjects;
        this.totalTasks = totalTasks;
        this.remainingTasks = remainingTasks;
    }

    public Long getTotalProjectsInvolved() {
        return totalProjectsInvolved;
    }

    public void setTotalProjectsInvolved(Long totalProjectsInvolved) {
        this.totalProjectsInvolved = totalProjectsInvolved;
    }

    public Long getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(Long activeProjects) {
        this.activeProjects = activeProjects;
    }

    public Long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public Long getRemainingTasks() {
        return remainingTasks;
    }

    public void setRemainingTasks(Long remainingTasks) {
        this.remainingTasks = remainingTasks;
    }
}
