import React, { useState } from 'react';
import './AssignTaskForm.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function AssignTaskForm({ teamMembers, onAddTask, onClose }) {
  const [taskData, setTaskData] = useState({
    title: '',
    assignedTo: '', 
    priority: 'MEDIUM', 
    deadline: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generates today's date string dynamically in standard YYYY-MM-DD local format
  const todayDateString = new Date().toLocaleDateString('en-CA');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskData.assignedTo) {
      setErrorMessage("Please select a team member to assign this task to.");
      return;
    }

    setLoading(true);
    setErrorMessage('');
    
    try {
      console.log("Deploying new task objective to target resource:", `${API_BASE}/api/tasks/user/${taskData.assignedTo}`);

      const response = await fetch(`${API_BASE}/api/tasks/user/${taskData.assignedTo}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: taskData.title.trim(),
          description: taskData.title.trim(), 
          status: 'TODO',
          dueDate: taskData.deadline, // HTML5 date inputs natively provide standard YYYY-MM-DD
          assignedBy: 'Manager (Boss)',
          priority: taskData.priority.toUpperCase()
        })
      });

      // 1. Read response payload as plain text first to safely prevent formatting crashes
      const responseText = await response.text();

      // 2. Safely attempt a JSON conversion if applicable
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        data = null;
      }

      if (!response.ok) {
        // Extract field validation maps from GlobalExceptionHandler if present
        if (data && typeof data === 'object') {
          const combinedErrors = Object.values(data).join(" | ");
          throw new Error(combinedErrors);
        }
        throw new Error(responseText || "The backend server rejected task persistence initialization.");
      }

      // Success sequence execution
      onAddTask();
      setTaskData({ title: '', assignedTo: '', priority: 'MEDIUM', deadline: '' });
      if (onClose) onClose(); 

    } catch (err) {
      console.error("Task deployment crash caught:", err);
      setErrorMessage(err.message || "A network connectivity exception occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay-backdrop">
      <div className="glass-form-card assigning-matrix-card">
        
        <div className="form-card-header">
          <div>
            <h3>Assign New Objective</h3>
            <p>Deploy a live operation tracking card to a worker's terminal stack.</p>
          </div>
          <button type="button" className="close-form-modal-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        {errorMessage && (
          <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center', fontWeight: '600' }}>
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Objective Title */}
          <div className="dashboard-form-field">
            <label htmlFor="title">Objective Title</label>
            <div className="dashboard-input-wrapper">
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={taskData.title} 
                onChange={handleChange} 
                required 
                placeholder="e.g., Optimize Database Connection Pool"
                disabled={loading}
              />
            </div>
          </div>

          {/* Assign Target Resource */}
          <div className="dashboard-form-field">
            <label htmlFor="assignedTo">Assign Target Resource</label>
            <div className="dashboard-input-wrapper">
              <select 
                id="assignedTo" 
                name="assignedTo" 
                value={taskData.assignedTo} 
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="" disabled hidden>Select Employee</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Severity / Priority */}
          <div className="dashboard-form-field">
            <label htmlFor="priority">Severity / Priority</label>
            <div className="dashboard-input-wrapper">
              <select 
                id="priority" 
                name="priority" 
                value={taskData.priority} 
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="HIGH">🔴 High Priority</option>
                <option value="MEDIUM">🟡 Medium Priority</option>
                <option value="LOW">🔵 Low Priority</option>
              </select>
            </div>
          </div>

          {/* Target Deadline */}
          <div className="dashboard-form-field">
            <label htmlFor="deadline">Target Deadline</label>
            <div className="dashboard-input-wrapper">
              <input 
                type="date" 
                id="deadline" 
                name="deadline" 
                value={taskData.deadline} 
                onChange={handleChange} 
                required 
                disabled={loading}
                min={todayDateString}
              />
            </div>
          </div>

          <div className="form-action-button-row">
            <button type="button" className="form-cancel-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="form-submit-pill-btn" disabled={loading}>
              {loading ? "Deploying Row..." : "Deploy Task"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AssignTaskForm;