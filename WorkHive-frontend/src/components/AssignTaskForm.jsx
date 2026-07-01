import React, { useState } from 'react';
import './AssignTaskForm.css';

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
     const response = await fetch(`${API_BASE}/api/tasks/user/${taskData.assignedTo}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: taskData.title.trim(),
          description: taskData.title.trim(), 
          status: 'TODO',
          dueDate: taskData.deadline, 
          assignedBy: 'Manager (Boss)',
          priority: taskData.priority.toUpperCase()
        })
      });

      if (!response.ok) {
        throw new Error("The backend server rejected task persistence initialization.");
      }

      onAddTask();
      setTaskData({ title: '', assignedTo: '', priority: 'MEDIUM', deadline: '' });
      if (onClose) onClose(); 

    } catch (err) {
      setErrorMessage(err.message);
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
                min={todayDateString} /* BLOCKS PAST DATES visually and systematically */
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