import React, { useState } from 'react';
import './SelfTaskForm.css';
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function SelfTaskForm({ onAddGoal, onClose }) {
  const currentSessionUser = JSON.parse(localStorage.getItem("workhive_user")) || { id: null };

  const [goalData, setGoalData] = useState({
    title: '',
    priority: 'Medium',
    deadline: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generates today's date string dynamically in standard YYYY-MM-DD local format
  const todayDateString = new Date().toLocaleDateString('en-CA');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoalData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentSessionUser.id) {
      setErrorMessage("Session tracking lost. Please re-authenticate via the login portal.");
      return;
    }

    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch(`${API_BASE}/api/tasks/user/${currentSessionUser.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: goalData.title.trim(),
          description: goalData.title.trim(), 
          status: 'TODO', 
          dueDate: goalData.deadline, 
          assignedBy: 'Self (Goal)',
          priority: goalData.priority
        })
      });

      if (!response.ok) {
        throw new Error("The relational database engine rejected self-goal creation mapping.");
      }

      onAddGoal();
      if (onClose) onClose();

    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="goal-overlay-backdrop">
      <div className="glass-goal-card self-tracking-matrix-card">
        
        <div className="goal-card-header">
          <div>
            <h3>Create Personal Goal</h3>
            <p>Track a self-directed milestone on your daily task stack.</p>
          </div>
          <button type="button" className="close-goal-modal-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        {errorMessage && (
          <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center', fontWeight: '600' }}>
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="goal-form-field">
            <label htmlFor="title">Goal Description</label>
            <div className="goal-input-wrapper">
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={goalData.title} 
                onChange={handleChange} 
                required 
                placeholder="e.g., Refactor legacy state handlers"
                disabled={loading}
              />
            </div>
          </div>

          <div className="goal-form-field">
            <label htmlFor="priority">Target Priority</label>
            <div className="goal-input-wrapper">
              <select 
                id="priority" 
                name="priority" 
                value={goalData.priority} 
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="High">🔴 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🔵 Low Priority</option>
              </select>
            </div>
          </div>

          <div className="goal-form-field">
            <label htmlFor="deadline">Target Deadline</label>
            <div className="goal-input-wrapper">
              <input 
                type="date" 
                id="deadline" 
                name="deadline" 
                value={goalData.deadline} 
                onChange={handleChange} 
                required 
                disabled={loading}
                min={todayDateString} /* BLOCKS PAST DATES visually and systematically */
              />
            </div>
          </div>

          <div className="goal-action-button-row">
            <button type="button" className="goal-cancel-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="goal-submit-pill-btn" disabled={loading}>
              {loading ? "Locking in..." : "Lock In Goal"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default SelfTaskForm;