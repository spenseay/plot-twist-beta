import { useRef, useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';
import '../styles/GraphContainer.css';

const GraphContainer = ({ children }) => {
  const { axes } = useGameContext();
  const containerRef = useRef(null);
  const yAxisArrowRef = useRef(null);

  // Adjust Y-axis arrow to stop below top label and above bottom label
  useEffect(() => {
    const adjustYAxisArrow = () => {
      const container = containerRef.current;
      const yAxisArrow = yAxisArrowRef.current;
      const yAxisEndLabel = container.querySelector('.y-axis-end');
      const yAxisStartLabel = container.querySelector('.y-axis-start');
      
      if (!yAxisEndLabel || !yAxisStartLabel || !yAxisArrow) return;

      const margin = 5; // extra spacing
      const containerRect = container.getBoundingClientRect();
      const endRect = yAxisEndLabel.getBoundingClientRect();
      const startRect = yAxisStartLabel.getBoundingClientRect();

      // Distance from container's top to bottom of top label
      const arrowTop = (endRect.bottom - containerRect.top) + margin;

      // Distance from container's bottom to top of bottom label
      const arrowBottom = (containerRect.bottom - startRect.top) + margin;

      // Set arrow line
      yAxisArrow.style.top = arrowTop + 'px';
      yAxisArrow.style.bottom = arrowBottom + 'px';
    };

    // Let the DOM update first, then adjust
    setTimeout(adjustYAxisArrow, 0);
    
    // Also adjust on window resize
    window.addEventListener('resize', adjustYAxisArrow);
    return () => window.removeEventListener('resize', adjustYAxisArrow);
  }, [axes]);

  return (
    <div id="graph-container" ref={containerRef}>
      {/* Axis labels */}
      <div className="axis-label x-axis-start">{axes.x.start}</div>
      <div className="axis-label x-axis-end">{axes.x.end}</div>
      <div className="axis-label y-axis-start">{axes.y.start}</div>
      <div className="axis-label y-axis-end">{axes.y.end}</div>

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

      {/* Child components (pins) */}
      {children}
    </div>
  );
};

export default GraphContainer;