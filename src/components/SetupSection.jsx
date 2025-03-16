import { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';
import PlayerItem from './PlayerItem';
import '../styles/SetupSection.css';

const SetupSection = ({ onStartGame }) => {
  const { players, addPlayer, removePlayer, clearPlayers, startGame } = useGameContext();
  const [playerName, setPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (addPlayer(playerName)) {
      setPlayerName('');
    } else if (!playerName.trim()) {
      alert('Please enter a player name.');
    } else {
      alert('This player is already added.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  const handleStartGame = () => {
    startGame();
    onStartGame();
  };

  return (
    <div id="setup-section" className="section">
      <h2>Player Setup</h2>
      <div className="instructions">
        <p>Enter the names of all players who will participate.</p>
      </div>
      
      <div className="form-group">
        <label htmlFor="player-name">Player Name:</label>
        <input 
          type="text" 
          id="player-name" 
          placeholder="Enter player name" 
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      
      <button onClick={handleAddPlayer}>Add Player</button>
      
      <div id="players-list">
        {players.map((player, index) => (
          <PlayerItem 
            key={index}
            number={index + 1}
            name={player}
            onRemove={() => removePlayer(index)}
          />
        ))}
      </div>
      
      <div className="button-group">
        <button 
          onClick={handleStartGame}
          disabled={players.length < 2}
        >
          Start Game
        </button>
        <button 
          onClick={clearPlayers}
          className="secondary"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default SetupSection;