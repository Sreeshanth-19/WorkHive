import React, { useState } from 'react';
import './TaskCard.css';

function TaskCard({ task, userRole, onStatusChange, onDelete }) {
  const [isUpdating, setIsUpdating] = useState(false); // 🚀 Added local toggle to prevent multi-click network race conditions

  if (!task) return null;

  const id = task.id;
  const title = task.title || "Untitled Operation";
  const assignedTo = task.assignedTo || "Unassigned";
  const assignedBy = task.assignedBy || "Manager (Boss)";
  const safeDeadline = task.deadline || task.dueDate || "No Deadline";

  // 1. Case-Insensitive Status Normalizer
  const rawStatus = String(task.status || '').toUpperCase().trim();
  let displayStatus = "Pending";
  if (rawStatus === "TODO" || rawStatus === "PENDING") displayStatus = "Pending";
  if (rawStatus === "IN_PROGRESS" || rawStatus === "IN PROGRESS") displayStatus = "In Progress";
  if (rawStatus === "COMPLETED") displayStatus = "Completed";

  // 2. Dynamic Priority Normalizer
  const rawPriority = String(task.priority || '').toUpperCase().trim();
  let displayPriority = "Medium";
  if (rawPriority === "HIGH") displayPriority = "High";
  if (rawPriority === "MEDIUM") displayPriority = "Medium";
  if (rawPriority === "LOW") displayPriority = "Low";

  // Class name style strings matching TaskCard.css
  const statusClass = displayStatus.toLowerCase().replace(/\s+/g, '-');
  const priorityClass = displayPriority.toLowerCase();

  const handleStatusUpdate = async (e) => {
    const nextValue = e.target.value;
    setIsUpdating(true);
    try {
      await onStatusChange(id, nextValue);
    } catch (err) {
      console.error("Failed processing inline status transfer:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    setIsUpdating(true);
    try {
      await onDelete(id);
    } catch (err) {
      console.error("Failed processing inline record purge:", err);
      setIsUpdating(false); // Only unset if component didn't unmount from dashboard layout removal
    }
  };

  return (
    <div className={`workhive-task-card ${statusClass} ${isUpdating ? 'card-syncing-lock' : ''}`} style={{ opacity: isUpdating ? 0.6 : 1 }}>
      
      {/* Card Header: Priority & Operational Actions */}
      <div className="card-top-bar">
        <span className={`priority-tag ${priorityClass}`}>
          {displayPriority} Priority
        </span>
        
        {userRole === 'boss' && (
          <button 
            className="card-delete-icon-btn" 
            onClick={handleDeleteClick} 
            title="Delete Task"
            disabled={isUpdating}
            style={{ cursor: isUpdating ? 'not-allowed' : 'pointer' }}
          >
            🗑️
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="card-body-content">
        <h4 style={{ textDecoration: displayStatus === 'Completed' ? 'line-through' : 'none' }}>{title}</h4>
        <div className="card-meta-assignment-details">
          {userRole === 'boss' ? (
            <p>Assigned to: <strong>{assignedTo}</strong></p>
          ) : (
            <p>Assigned by: <strong>{assignedBy}</strong></p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-bottom-bar">
        <div className="deadline-tracker">
          <span className="clock-emoji">📅</span>
          <span className="deadline-date">{safeDeadline}</span>
        </div>

        <div className="status-control-wrapper">
          {userRole === 'employee' ? (
            <select 
              className={`status-inline-selector ${statusClass}`}
              value={displayStatus}
              onChange={handleStatusUpdate}
              disabled={isUpdating}
              style={{ cursor: isUpdating ? 'not-allowed' : 'pointer' }}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          ) : (
            <span className={`status-display-badge ${statusClass}`}>
              {displayStatus}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}

export default TaskCard;