import { useState } from 'react'
import './App.css'

import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import BossDashboard from './components/BossDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';

function App() {
  // Stateful Navigation Engine with Automated Session Detection
  const [screen, setScreen] = useState(() => {
    const activeSession = localStorage.getItem("workhive_user");
    
    if (activeSession) {
      try {
        const user = JSON.parse(activeSession);
        if (user.role === 'BOSS') return 'boss';
        if (user.role === 'EMPLOYEE') return 'employee';
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