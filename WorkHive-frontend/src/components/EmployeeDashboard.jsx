import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import SelfTaskForm from './SelfTaskForm';
import './EmployeeDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function EmployeeDashboard({ onNavigate }) {
  // 🚀 FIX: Extract live session profile information safely with try/catch block
  const currentSessionUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("workhive_user")) || { id: null, username: "Employee" };
    } catch (e) {
      return { id: null, username: "Employee" };
    }
  })();

  // Stateful core engines linked to the database
  const [myTasks, setMyTasks] = useState([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Centralized data synchronizer function for this specific employee
  const fetchEmployeeTasks = async () => {
    if (!currentSessionUser.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      console.log(`Synchronizing personal tasks from API engine for User ID: ${currentSessionUser.id}`);
      
      const response = await fetch(`${API_BASE}/api/tasks/user/${currentSessionUser.id}`);
      if (!response.ok) throw new Error("Failed to pull personal action items queue.");
      
      const databaseTasks = await response.json();
      
      // Standardize backend attributes into values expected by your frontend components
      const formattedTasks = databaseTasks.map(task => {
        // Normalize status strings for CSS class checks
        let formattedStatus = "Pending";
        const rawStatus = String(task.status || '').toUpperCase().trim();
        if (rawStatus === "IN_PROGRESS" || rawStatus === "IN PROGRESS") formattedStatus = "In Progress";
        if (rawStatus === "COMPLETED") formattedStatus = "Completed";

        return {
          id: task.id,
          title: task.title,
          description: task.description,
          assignedTo: currentSessionUser.username,
          assignedBy: task.assignedBy || "Manager (Boss)",
          priority: task.priority || "Medium",
          status: formattedStatus,
          deadline: task.dueDate || "N/A"
        };
      });

      setMyTasks(formattedTasks);
    } catch (err) {
      console.error("Task synchronization engine failure:", err);
    } finally {
      setLoading(false);
    }
  };

  // Run synchronization routine automatically on board initialization
  useEffect(() => {
    fetchEmployeeTasks();
  }, []);

  // Updates specific item properties across network layers to database columns
  const handleStatusChange = async (id, newStatus) => {
    try {
      const targetTask = myTasks.find(t => t.id === id);
      if (!targetTask) return;

      // Normalize status payload back to standard clean string format for the backend
      let backendStatus = "TODO";
      if (newStatus === "In Progress") backendStatus = "IN_PROGRESS";
      if (newStatus === "Completed") backendStatus = "COMPLETED";

      // 🚀 FIX: Prevent sending literal string "N/A" to backend LocalDate objects
      const cleanDueDate = (targetTask.deadline === "N/A" || targetTask.deadline === "No Deadline") 
        ? null 
        : targetTask.deadline;

      const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: targetTask.title,
          description: targetTask.description,
          status: backendStatus,
          dueDate: cleanDueDate
        })
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Could not save update on the database.");
      }

      // If network confirms, change state locally so UI shifts immediately
      setMyTasks((prev) => prev.map(task => 
        task.id === id ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      alert(`Status Synchronization Error: ${err.message}`);
    }
  };

  // Triggered after SelfTaskForm runs its internal relational POST routine
  const handleAddGoal = () => {
    fetchEmployeeTasks(); // Refetch everything from database to show the newly added goal row
  };

  // Metric Calculation Closures compiled cleanly from database models
  const totalTasks = myTasks.length;
  const activeTasks = myTasks.filter(t => t.status !== 'Completed').length;
  const closedTasks = myTasks.filter(t => t.status === 'Completed').length;

  return (
    <div className="employee-app-container">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="employee-sidebar">
        <div className="sidebar-brand">
          <h2>WorkHive</h2>
          <span className="employee-role-tag">Employee Panel</span>
        </div>
        <nav className="sidebar-menu">
          <a href="#mytasks" className="menu-item active">📋 My Task Board</a>
          <button className="menu-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => setShowGoalModal(true)}>
            🎯 Create Personal Goal
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => { localStorage.removeItem("workhive_user"); onNavigate('login'); }}>🚪 Sign Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE FRAME */}
      <main className="employee-main-content">
        <header className="main-workspace-header">
          <div className="header-welcome">
            <h1>My Workspace</h1>
            <p>Welcome back, <strong>{currentSessionUser.username}</strong>. Tracking personal productivity pipelines.</p>
          </div>
          <button className="accent-action-btn" onClick={() => setShowGoalModal(true)}>
            + Create Goal
          </button>
        </header>

        {/* ANALYTICS HIGHLIGHT OVERVIEW BLOCKS */}
        <section className="metrics-grid-row">
          <div className="metric-card card-total">
            <div className="metric-info"><h3>Assigned To Me</h3><p className="metric-value">{totalTasks}</p></div>
            <span className="metric-badge-icon">📥</span>
          </div>
          <div className="metric-card card-pending">
            <div className="metric-info"><h3>In Progress</h3><p className="metric-value">{activeTasks}</p></div>
            <span className="metric-badge-icon">⚡</span>
          </div>
          <div className="metric-card card-completed">
            <div className="metric-info"><h3>Completed</h3><p className="metric-value">{closedTasks}</p></div>
            <span className="metric-badge-icon">🏆</span>
          </div>
        </section>

        {/* WORK PANELS DATA STRUCT */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#4b5563', fontSize: '1.1rem', fontWeight: '500' }}>Assembling live personal deployment grid metrics...</div>
        ) : (
          <div className="workspace-data-split-view">
            
            {/* Integrated Dynamic Employee Task Stack */}
            <section className="data-panel task-board-panel">
              <div className="panel-header">
                <h2>My Action Items Queue</h2>
                <span className="panel-subtitle">Adjust item state mapping elements directly to update telemetry indicators</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
                {myTasks.length > 0 ? (
                  myTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      userRole="employee" 
                      onStatusChange={handleStatusChange} 
                    />
                  ))
                ) : (
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', textAlign: 'center', padding: '2.5rem' }}>
                    No operations assigned to your profile yet! Enjoy the clear queue.
                  </p>
                )}
              </div>
            </section>

            {/* SIDEBAR METRIC SUMMARY */}
            <section className="data-panel focal-points-panel">
              <div className="panel-header">
                <h2>Daily Summary</h2>
                <span className="panel-subtitle">Velocity metrics calculations</span>
              </div>
              <div className="productivity-gauge-box">
                <div className="gauge-circle-placeholder">
                  <span className="gauge-number">
                    {totalTasks > 0 ? Math.round((closedTasks / totalTasks) * 100) : 0}%
                  </span>
                  <span className="gauge-label">Completed</span>
                </div>
                <div className="gauge-insights">
                  <p>💡 High Priority Remaining: <strong>{myTasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length}</strong></p>
                  <p>🎯 Self Directed Goals: <strong>{myTasks.filter(t => t.assignedBy && t.assignedBy.startsWith('Self')).length}</strong></p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* GOAL CREATION FORM MODAL FRAME */}
      {showGoalModal && (
        <SelfTaskForm 
          onAddGoal={handleAddGoal} 
          onClose={() => setShowGoalModal(false)} 
        />
      )}
    </div>
  );
}

export default EmployeeDashboard;