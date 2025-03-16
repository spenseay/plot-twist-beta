import { useState, useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { playerColors, getContrastYIQ, calculateDistance } from '../data/axisOptions';
import CollectivePlacementsChart from './CollectivePlacementsChart';
import '../styles/FinalScoresSection.css';

const FinalScoresSection = ({ onPlayAgain }) => {
  const { 
    players, 
    placements, 
    selectedFilter, 
    setSelectedFilter,
    resetGame,
    getSortedScores
  } = useGameContext();
  
  const [sortedScores, setSortedScores] = useState([]);

  useEffect(() => {
    setSortedScores(getSortedScores());
  }, [getSortedScores]);

  const handlePlayAgain = () => {
    resetGame();
    onPlayAgain();
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const renderScoreTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedScores.map((item, i) => (
            <tr key={item.player} className={i === 0 ? 'winner' : ''}>
              <td>{i + 1}</td>
              <td>{item.player}</td>
              <td>{item.score} points</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderPlayerFilterButtons = () => {
    return (
      <div className="player-filter-container">
        <div className="player-filter-heading">View where people placed:</div>
        <div className="player-filter-buttons" id="player-filter-buttons">
          <div 
            className={`player-filter-button all-button ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterClick('all')}
          >
            All
          </div>
          
          {players.map((player, index) => {
            const color = playerColors[index % playerColors.length];
            const textColor = getContrastYIQ(color) < 128 ? 'white' : '#4c2c69';
            
            return (
              <div
                key={player}
                className={`player-filter-button ${selectedFilter === player ? 'active' : ''}`}
                style={{ backgroundColor: color, color: textColor }}
                onClick={() => handleFilterClick(player)}
              >
                {player}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPlayerScoreboard = () => {
    if (selectedFilter === 'all') return null;
    
    const selectedPlayer = selectedFilter;
    const selfPlacement = placements[selectedPlayer][selectedPlayer];
    
    if (!selfPlacement) return null;
    
    const playerScores = players
      .filter(player => player !== selectedPlayer)
      .map(player => {
        const placement = placements[player][selectedPlayer];
        if (!placement) return { player, score: 0 };
        
        const dist = calculateDistance(selfPlacement, placement);
        const maxDist = Math.sqrt(2);
        const score = Math.max(0, Math.round(100 - (dist / maxDist) * 100));
        
        return { player, score };
      })
      .sort((a, b) => b.score - a.score);
    
    return (
      <div className="player-scoreboard">
        <h4>{`Who knows ${selectedPlayer} best?`}</h4>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {playerScores.map((item, i) => (
              <tr key={item.player} className={i === 0 ? 'winner' : ''}>
                <td>{i + 1}</td>
                <td>{item.player}</td>
                <td>{item.score} points</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div id="final-scores-section" className="section">
      <h2>Final Scores</h2>
      
      <div id="final-scores-table">
        {renderScoreTable()}
        
        <div className="winner-announcement">
          <strong>{sortedScores[0]?.player}</strong> knows their friends best with {sortedScores[0]?.score} points!
        </div>
      </div>
      
      <h3>Everyone's Placements</h3>
      
      {renderPlayerFilterButtons()}
      
      <div id="collective-placements-container">
        <CollectivePlacementsChart />
        {renderPlayerScoreboard()}
      </div>
      
      <div className="feedback-section">
        <p>Thanks for playing Plot Twist, please give us some feedback</p>
        <p>
          <a 
            href="https://forms.gle/P7ZFndmYZTRCye8i9" 
            target="_blank" 
            rel="noreferrer"
          >
            https://forms.gle/YL3cLa2v239HMNGe6
          </a>
        </p>
      </div>
      
      <div className="button-group" style={{ justifyContent: 'center' }}>
        <button id="play-again" onClick={handlePlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default FinalScoresSection;