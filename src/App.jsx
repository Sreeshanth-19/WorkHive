import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

// UPDATE THESE TWO LINES RIGHT HERE:
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';

function App() {
  const [screen, setScreen] = useState('register');

  return (
    <div>
      {screen === 'register' ? (
        <RegistrationForm onNavigate={setScreen} />
      ) : (
        <LoginForm onNavigate={setScreen} />
      )}
    </div>
  );
}

export default App;