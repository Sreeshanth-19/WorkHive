package com.workhive.api.Controller;

import com.workhive.api.model.Task;
import com.workhive.api.model.User;
import com.workhive.api.repository.TaskRepository;
import com.workhive.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. CREATE: Add a task and assign it to a specific user
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createTask(@PathVariable Long userId, @RequestBody Task task) {
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: User with ID " + userId + " not found!");
        }
        
        User user = userOptional.get();
        task.setAssignedUser(user);
        
        if (task.getStatus() == null || task.getStatus().isEmpty()) {
            task.setStatus("TODO");
        }
        
        Task savedTask = taskRepository.save(task);
        return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
    }

    // 2. READ: Get all tasks assigned to a specific user
    @GetMapping("/user/{userId}") // <─── Capitalized 'G' fixed here!
    public List<Task> getTasksByUser(@PathVariable Long userId) {
        return taskRepository.findByAssignedUserId(userId);
    }

    // 3. UPDATE: Update an existing task's status or details
    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable Long taskId, @RequestBody Task taskDetails) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        
        if (taskOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Task with ID " + taskId + " not found!");
        }

        Task existingTask = taskOptional.get();
        
        if (taskDetails.getTitle() != null) existingTask.setTitle(taskDetails.getTitle());
        if (taskDetails.getDescription() != null) existingTask.setDescription(taskDetails.getDescription());
        if (taskDetails.getStatus() != null) existingTask.setStatus(taskDetails.getStatus());
        if (taskDetails.getDueDate() != null) existingTask.setDueDate(taskDetails.getDueDate());

        Task updatedTask = taskRepository.save(existingTask);
        return ResponseEntity.ok(updatedTask);
    }

    // 4. DELETE: Permanently remove a task
    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Task with ID " + taskId + " not found!");
        }
        
        taskRepository.deleteById(taskId);
        return ResponseEntity.ok("Task with ID " + taskId + " has been deleted successfully!");
    }
}