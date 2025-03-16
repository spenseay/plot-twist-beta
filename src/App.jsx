import { useState } from 'react';
import { GameProvider } from '../contexts/GameContext';
import SetupSection from '../components/SetupSection';
import GameSection from '../components/GameSection';
import FinalScoresSection from '../components/FinalScoresSection';
import './styles/index.css';

function App() {
  const [currentSection, setCurrentSection] = useState('setup');

  return (
    <div className="container">
      <h1>Plot Twist!</h1>
      
      <GameProvider>
        {currentSection === 'setup' && (
          <SetupSection onStartGame={() => setCurrentSection('game')} />
        )}
        
        {currentSection === 'game' && (
          <GameSection onFinishGame={() => setCurrentSection('scores')} />
        )}
        
        {currentSection === 'scores' && (
          <FinalScoresSection onPlayAgain={() => setCurrentSection('setup')} />
        )}
      </GameProvider>
    </div>
  );
}

export default App;