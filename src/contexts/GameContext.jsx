import { createContext, useContext, useState, useEffect } from 'react';
import { axisOptions } from '../data/axisOptions';

const GameContext = createContext(null);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [placements, setPlacements] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [axes, setAxes] = useState({
    x: { start: "", end: "" },
    y: { start: "", end: "" }
  });

  // Randomize axes when the game starts or restarts
  const randomizeAxes = () => {
    const shuffled = [...axisOptions].sort(() => 0.5 - Math.random());
    
    const xAxis = shuffled[0];
    const yAxis = shuffled[1] || shuffled[0];
    
    const xSwap = Math.random() > 0.5;
    const ySwap = Math.random() > 0.5;
    
    setAxes({
      x: {
        start: xSwap ? xAxis.end : xAxis.start,
        end: xSwap ? xAxis.start : xAxis.end
      },
      y: {
        start: ySwap ? yAxis.end : yAxis.start,
        end: ySwap ? yAxis.start : yAxis.end
      }
    });
  };

  // Initialize axes
  useEffect(() => {
    randomizeAxes();
  }, []);

  // Add player
  const addPlayer = (playerName) => {
    if (!playerName.trim()) return false;
    if (players.includes(playerName)) return false;
    
    setPlayers([...players, playerName]);
    return true;
  };

  // Remove player
  const removePlayer = (index) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };

  // Clear all players
  const clearPlayers = () => {
    setPlayers([]);
  };

  // Start game
  const startGame = () => {
    const newPlacements = {};
    players.forEach(p => { newPlacements[p] = {}; });
    
    setPlacements(newPlacements);
    setCurrentTurn(0);
    randomizeAxes();
  };

  // Save placements for current turn
  const saveTurnPlacements = (turnPlacements) => {
    const currentPlayer = players[currentTurn];
    
    setPlacements(prev => ({
      ...prev,
      [currentPlayer]: turnPlacements
    }));
    
    setCurrentTurn(prev => prev + 1);
  };

  // Calculate final scores
  const calculateScores = () => {
    const scores = {};
    players.forEach(p => scores[p] = 0);
    
    players.forEach(person => {
      const selfPlacement = placements[person][person];
      
      players.forEach(player => {
        if (player === person) return;
        
        const placement = placements[player][person];
        const dx = selfPlacement.x - placement.x;
        const dy = selfPlacement.y - placement.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const maxDist = Math.sqrt(2);
        const score = Math.max(0, Math.round(100 - (dist / maxDist) * 100));
        
        scores[player] += score;
      });
    });
    
    return scores;
  };

  // Reset game
  const resetGame = () => {
    setPlayers([]);
    setCurrentTurn(0);
    setPlacements({});
    setSelectedFilter('all');
    randomizeAxes();
  };

  // Memoize sorted scores
  const getSortedScores = () => {
    const scores = calculateScores();
    return Object.entries(scores)
      .map(([player, score]) => ({ player, score }))
      .sort((a, b) => b.score - a.score);
  };

  const value = {
    players,
    currentTurn,
    placements,
    axes,
    selectedFilter,
    addPlayer,
    removePlayer,
    clearPlayers,
    startGame,
    saveTurnPlacements,
    calculateScores,
    resetGame,
    randomizeAxes,
    setSelectedFilter,
    getSortedScores,
    isGameFinished: currentTurn >= players.length && players.length > 0
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};