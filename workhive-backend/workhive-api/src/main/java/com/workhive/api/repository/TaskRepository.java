package com.workhive.api.repository;

import com.workhive.api.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Custom query to find all tasks belonging to a specific user id
    List<Task> findByAssignedUserId(Long userId);
    
    // Custom query to find all tasks filtered by their completion status
    List<Task> findByStatus(String status);
}