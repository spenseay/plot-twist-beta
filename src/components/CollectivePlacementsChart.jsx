import { useRef, useEffect, useState } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { playerColors, getContrastYIQ } from '../data/axisOptions';
import '../styles/CollectivePlacementsChart.css';

const CollectivePlacementsChart = () => {
  const { 
    players, 
    placements, 
    axes, 
    selectedFilter 
  } = useGameContext();
  
  const chartContainerRef = useRef(null);
  const yAxisArrowRef = useRef(null);
  const [nextZIndex, setNextZIndex] = useState(100);

  // Adjust Y-axis arrow
  useEffect(() => {
    const adjustYAxisArrow = () => {
      const container = chartContainerRef.current;
      const yAxisArrow = yAxisArrowRef.current;
      if (!container || !yAxisArrow) return;

      const yAxisEndLabel = container.querySelector('.y-axis-end');
      const yAxisStartLabel = container.querySelector('.y-axis-start');
      if (!yAxisEndLabel || !yAxisStartLabel) return;

      const margin = 5;
      const containerRect = container.getBoundingClientRect();
      const endRect = yAxisEndLabel.getBoundingClientRect();
      const startRect = yAxisStartLabel.getBoundingClientRect();

      const arrowTop = (endRect.bottom - containerRect.top) + margin;
      const arrowBottom = (containerRect.bottom - startRect.top) + margin;

      yAxisArrow.style.top = arrowTop + 'px';
      yAxisArrow.style.bottom = arrowBottom + 'px';
    };

    setTimeout(adjustYAxisArrow, 0);
    
    window.addEventListener('resize', adjustYAxisArrow);
    return () => window.removeEventListener('resize', adjustYAxisArrow);
  }, []);

  const bringPinToFront = (e) => {
    setNextZIndex(prev => prev + 1);
    e.currentTarget.style.zIndex = nextZIndex;
  };

  const renderPins = () => {
    const isFiltering = selectedFilter !== 'all';
    const selectedPlayer = selectedFilter;

    const pins = [];

    players.forEach((person, pIdx) => {
      const personColor = playerColors[pIdx % playerColors.length];
      const textColor = getContrastYIQ(personColor) < 128 ? 'white' : '#4c2c69';
      
      // If filtering and this isn't the selected player, show dimmed pins
      if (isFiltering && person !== selectedPlayer) {
        players.forEach(placer => {
          const place = placements[placer][person];
          if (!place) return;
          
          pins.push(
            <div
              key={`${placer}-${person}`}
              className="pin"
              style={{
                backgroundColor: personColor,
                color: textColor,
                opacity: 0.2,
                left: `${place.x * 100}%`,
                top: `${place.y * 100}%`
              }}
              onClick={bringPinToFront}
            >
              {person}
            </div>
          );
        });
        return;
      }
      
      // If not filtering or this is the selected player
      players.forEach(placer => {
        const place = placements[placer][person];
        if (!place) return;
        
        pins.push(
          <div
            key={`${placer}-${person}`}
            className="pin"
            style={{
              backgroundColor: personColor,
              color: textColor,
              left: `${place.x * 100}%`,
              top: `${place.y * 100}%`,
              ...(placer === person && {
                boxShadow: '0 0 0 3px white, 2px 2px 5px rgba(0,0,0,0.3)',
                zIndex: 20
              }),
              ...(placer !== person && {
                transform: 'translate(-50%,-50%) scale(0.8)'
              })
            }}
            onClick={bringPinToFront}
          >
            {isFiltering && person === selectedPlayer ? placer : person}
          </div>
        );
      });
    });

    return pins;
  };

  return (
    <div className="collective-placements-chart">
      <h3 className="chart-title">Player Placement Map</h3>
      
      <div className="chart-container" ref={chartContainerRef}>
        {/* X-axis labels */}
        <div className="axis-label x-axis-start">
          {axes.x.start}
        </div>
        <div className="axis-label x-axis-end">
          {axes.x.end}
        </div>
        
        {/* Y-axis labels */}
        <div className="axis-label y-axis-start">
          {axes.y.start}
        </div>
        <div className="axis-label y-axis-end">
          {axes.y.end}
        </div>
        
        {/* Y-axis arrow */}
        <div className="axis-arrow y-axis-arrow" ref={yAxisArrowRef}>
          <div className="arrow-head arrow-top"></div>
          <div className="arrow-head arrow-bottom"></div>
        </div>
        
        {/* X-axis arrow */}
        <div className="axis-arrow x-axis-arrow">
          <div className="arrow-head arrow-left"></div>
          <div className="arrow-head arrow-right"></div>
        </div>
        
        {/* Render pins */}
        {renderPins()}
      </div>
    </div>
  );
};

export default CollectivePlacementsChart;