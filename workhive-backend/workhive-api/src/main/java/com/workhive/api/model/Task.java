package com.workhive.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
// Add this new import statement at the top:
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String status;

    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    // Add this line right here to clean up your JSON responses:
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User assignedUser;
    @Column(name = "priority")
    private String priority; // Will hold "HIGH", "MEDIUM", or "LOW"

    // Add the standard getter and setter below
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}