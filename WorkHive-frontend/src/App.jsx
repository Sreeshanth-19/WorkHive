import { useState } from 'react'
import './App.css'

import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import BossDashboard from './components/BossDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';

function App() {
  // Stateful Navigation Engine with Bulletproof Session Routing
  const [screen, setScreen] = useState(() => {
    const activeSession = localStorage.getItem("workhive_user");
    
    if (activeSession) {
      try {
        const user = JSON.parse(activeSession);
        
        // Normalize role check to protect against unexpected casing adjustments
        const normalizedRole = String(user?.role || '').toUpperCase().trim();
        
        if (normalizedRole === 'BOSS') return 'boss';
        if (normalizedRole === 'EMPLOYEE') return 'employee';
        
        // 🚀 FIX: Valid JSON but missing/unrecognized role field - clear it to break loop traps
        console.warn("Unrecognized profile role type detected. Purging invalid token payload.");
        localStorage.removeItem("workhive_user");
        
      } catch (e) {
        console.error("Corrupted session signature cleared:", e);
        localStorage.removeItem("workhive_user");
      }
    }
    
    // Default entry landing target if no active session profile is found
    return 'login'; 
  });

  return (
    <div className="app-root-wrapper">
      {screen === 'register' && (
        <RegistrationForm onNavigate={setScreen} />
      )}
      
      {screen === 'login' && (
        <LoginForm onNavigate={setScreen} />
      )}
      
      {screen === 'boss' && (
        <BossDashboard onNavigate={setScreen} />
      )}
      
      {screen === 'employee' && (
        <EmployeeDashboard onNavigate={setScreen} />
      )}
    </div>
  );
}

export default App;