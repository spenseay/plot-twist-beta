import { useState, useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';
import GraphContainer from './GraphContainer';
import Pin from './Pin';
import '../styles/GameSection.css';
import { playerColors, getContrastYIQ } from '../data/axisOptions';

const GameSection = ({ onFinishGame }) => {
  const { players, currentTurn, saveTurnPlacements, isGameFinished } = useGameContext();
  const [pins, setPins] = useState({}); // Track pin placements
  const [allPlaced, setAllPlaced] = useState(false);

  // Initialize pins for this turn
  useEffect(() => {
    const initialPins = {};
    players.forEach(player => {
      initialPins[player] = { placed: false, x: 0, y: 0 };
    });
    setPins(initialPins);
    setAllPlaced(false);
  }, [players, currentTurn]);

  // Check if all pins are placed
  useEffect(() => {
    const allPinsPlaced = Object.values(pins).every(pin => pin.placed);
    setAllPlaced(allPinsPlaced);
  }, [pins]);

  // Handle pin placement
  const handlePinPlacement = (player, x, y) => {
    setPins(prev => ({
      ...prev,
      [player]: { placed: true, x, y }
    }));
  };

  // Handle confirm button click
  const handleConfirmPlacement = () => {
    const placements = {};
    Object.entries(pins).forEach(([player, position]) => {
      placements[player] = { x: position.x, y: position.y };
    });
    
    saveTurnPlacements(placements);
    
    if (isGameFinished) {
      onFinishGame();
    }
  };

  // Count placed pins
  const countPlacedPins = () => {
    return Object.values(pins).filter(pin => pin.placed).length;
  };

  const currentPlayer = players[currentTurn];

  return (
    <div id="game-section" className="section">
      <div id="turn-indicator">
        {currentPlayer}'s Turn
      </div>
      
      <div className="instructions">
        <p>Drag each sticky note from below and place it where you think that person belongs on the graph.</p>
      </div>
      
      <div id="pins-container" className="pins-container">
        {players.map((player, index) => {
          if (pins[player]?.placed) return null;
          
          const color = playerColors[index % playerColors.length];
          const textColor = getContrastYIQ(color) < 128 ? 'white' : '#4c2c69';
          
          return (
            <Pin
              key={player}
              player={player}
              color={color}
              textColor={textColor}
              isPlaced={false}
              onPlace={(x, y) => handlePinPlacement(player, x, y)}
            />
          );
        })}
      </div>
      
      <div id="pins-status" className={`pins-status ${allPlaced ? 'all-placed' : ''}`}>
        {allPlaced 
          ? 'All pins placed! You can now confirm.' 
          : `Placed ${countPlacedPins()} of ${players.length} pins. Please place all pins on the chart.`
        }
      </div>
      
      <GraphContainer>
        {players.map((player, index) => {
          if (!pins[player]?.placed) return null;
          
          const { x, y } = pins[player];
          const color = playerColors[index % playerColors.length];
          const textColor = getContrastYIQ(color) < 128 ? 'white' : '#4c2c69';
          
          return (
            <Pin
              key={player}
              player={player}
              color={color}
              textColor={textColor}
              isPlaced={true}
              initialX={x}
              initialY={y}
              onPlace={(newX, newY) => handlePinPlacement(player, newX, newY)}
            />
          );
        })}
      </GraphContainer>
      
      <div className="button-group" style={{ justifyContent: 'center' }}>
        <button 
          id="confirm-placement" 
          onClick={handleConfirmPlacement}
          disabled={!allPlaced}
        >
          Confirm Placement
        </button>
      </div>
    </div>
  );
};

export default GameSection;