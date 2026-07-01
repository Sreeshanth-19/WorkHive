import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import AssignTaskForm from './AssignTaskForm';
import './BossDashboard.css';
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function BossDashboard({ onNavigate }) {
  const currentSessionUser = JSON.parse(localStorage.getItem("workhive_user")) || { username: "Manager" };

  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);
      
      const userResponse = await fetch(`${API_BASE}/api/users`);
      if (!userResponse.ok) throw new Error("Failed to pull system users.");
      const allUsers = await userResponse.json();

      const employeesOnly = allUsers
        .filter(user => String(user.role || '').toUpperCase().trim() === "EMPLOYEE")
        .map(user => ({
          id: user.id,
          name: user.username,
          role: "Team Contributor",
          status: "Online"
        }));
      
      setTeam(employeesOnly);

      let aggregatedTasks = [];
      for (const employee of employeesOnly) {
        const taskResponse = await fetch(`${API_BASE}/api/tasks/user/${employee.id}`);
        if (taskResponse.ok) {
          const userTasks = await taskResponse.json();
          
          // ─── DIAGNOSTIC LOG CHECKPOINT ─────────────────────────────────────
          // This prints the exact structure of your database rows into F12 Console
          console.log(`📦 Raw Database Tasks for ${employee.name}:`, userTasks);

          const formattedTasks = userTasks.map(task => {
            
            // 1. Case-Insensitive Status Normalizer
            const rawStatus = String(task.status || '').toUpperCase().trim();
            let formattedStatus = "Pending";
            if (rawStatus === "TODO" || rawStatus === "PENDING") formattedStatus = "Pending";
            if (rawStatus === "IN_PROGRESS" || rawStatus === "IN PROGRESS") formattedStatus = "In Progress";
            if (rawStatus === "COMPLETED") formattedStatus = "Completed";

            // 2. DEFENSIVE MULTI-KEY PRIORITY LOOKUP (Fixes the Medium Priority Label)
            // Checks priority, priorityLevel, taskPriority, severity, and urgency automatically
            const backendPriorityValue = task.priority || task.priorityLevel || task.taskPriority || task.severity || task.urgency || '';
            const rawPriority = String(backendPriorityValue).toUpperCase().trim();
            
            let formattedPriority = "Medium";
            if (rawPriority === "HIGH") formattedPriority = "High";
            if (rawPriority === "MEDIUM") formattedPriority = "Medium";
            if (rawPriority === "LOW") formattedPriority = "Low";

            return {
              id: task.id,
              title: task.title,
              description: task.description,
              assignedTo: employee.name,
              assignedBy: task.assignedBy || "Manager (Boss)",
              priority: formattedPriority, 
              status: formattedStatus,      
              deadline: task.dueDate || "No Deadline"
            };
          });
          
          aggregatedTasks = [...aggregatedTasks, ...formattedTasks];
        }
      }
      
      setTasks(aggregatedTasks);
    } catch (err) {
      console.error("Full-stack data synchronization sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, []);

  const handleAddTask = () => {
    fetchWorkspaceData(); 
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Could not drop task from backend.");
      setTasks((prev) => prev.filter(task => task.id !== id));
    } catch (err) {
      alert(`Error dropping operational instance: ${err.message}`);
    }
  };

  // Case-Insensitive Metrics Calculators (Fixes Closed Ops Counter)
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => String(t.status).toUpperCase().trim() !== 'COMPLETED').length;
  const completedTasks = tasks.filter(t => String(t.status).toUpperCase().trim() === 'COMPLETED').length;

  return (
    <div className="dashboard-app-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h2>WorkHive</h2>
          <span className="role-tag">Manager Panel</span>
        </div>
        <nav className="sidebar-menu">
          <a href="#overview" className="menu-item active">📊 Workspace Overview</a>
          <button className="menu-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => setShowAssignModal(true)}>
            ➕ Assign New Task
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => { localStorage.removeItem("workhive_user"); onNavigate('login'); }}>🚪 Sign Out</button>
        </div>
      </aside>

      <main className="dashboard-main-content">
        <header className="main-workspace-header">
          <div className="header-welcome">
            <h1>Workspace Dashboard</h1>
            <p>Welcome back, <strong>{currentSessionUser.username}</strong>. Live system overview operating perfectly.</p>
          </div>
          <button className="accent-action-btn" onClick={() => setShowAssignModal(true)}>
            + Assign Task
          </button>
        </header>

        <section className="metrics-grid-row">
          <div className="metric-card card-total">
            <div className="metric-info"><h3>Total Tracked</h3><p className="metric-value">{totalTasks}</p></div>
            <span className="metric-badge-icon">📂</span>
          </div>
          <div className="metric-card card-pending">
            <div className="metric-info"><h3>Active Items</h3><p className="metric-value">{pendingTasks}</p></div>
            <span className="metric-badge-icon">⏳</span>
          </div>
          <div className="metric-card card-completed">
            <div className="metric-info"><h3>Closed Ops</h3><p className="metric-value">{completedTasks}</p></div>
            <span className="metric-badge-icon">✅</span>
          </div>
        </section>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#4b5563', fontSize: '1.1rem', fontWeight: '500' }}>Synchronizing workspace metrics with database engine...</div>
        ) : (
          <div className="workspace-data-split-view">
            <section className="data-panel task-ledger-panel">
              <div className="panel-header">
                <h2>Active Deployment Grid</h2>
                <span className="panel-subtitle">Live instances of distributed operational tasks</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '10px' }}>
                {tasks.length > 0 ? (
                  tasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      userRole="boss" 
                      onDelete={handleDeleteTask} 
                    />
                  ))
                ) : (
                  <p style={{ gridColumn: '1 / -1', color: '#6b7280', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
                    No tasks tracked. Click "+ Assign Task" to deploy an item.
                  </p>
                )}
              </div>
            </section>

            <section className="data-panel team-status-panel">
              <div className="panel-header">
                <h2>Team Resource Matrix</h2>
                <span className="panel-subtitle">Available allocations</span>
              </div>
              <div className="team-list-wrapper">
                {team.length > 0 ? (
                  team.map((member) => (
                    <div className="team-member-card" key={member.id}>
                      <div className="member-identity">
                        <div className="avatar-placeholder">{member.name.split(' ').map(n => n[0]).join('')}</div>
                        <div className="member-details"><h4>{member.name}</h4><p>{member.role}</p></div>
                      </div>
                      <div className="member-meta-stats">
                        <span className="presence-dot online"></span>
                        <span className="active-count">Synced</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No managed team units registered in database.</p>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {showAssignModal && (
        <AssignTaskForm 
          teamMembers={team} 
          onAddTask={handleAddTask} 
          onClose={() => setShowAssignModal(false)} 
        />
      )}
    </div>
  );
}

export default BossDashboard;