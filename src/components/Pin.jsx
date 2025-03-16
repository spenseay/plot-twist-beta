import { useState, useRef, useEffect } from 'react';
import '../styles/Pin.css';

const Pin = ({ player, color, textColor, isPlaced, initialX, initialY, onPlace }) => {
  const [position, setPosition] = useState({ x: initialX || 0, y: initialY || 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(100);
  const pinRef = useRef(null);

  // Set initial position if already placed
  useEffect(() => {
    if (isPlaced && initialX !== undefined && initialY !== undefined) {
      setPosition({ x: initialX, y: initialY });
    }
  }, [isPlaced, initialX, initialY]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    bringToFront();
    
    // If not placed yet, we need to move it to the graph container
    if (!isPlaced) {
      const graphContainer = document.getElementById('graph-container');
      if (!graphContainer) return;
      
      const rect = graphContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setPosition({ x, y });
      onPlace(x, y);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const graphContainer = document.getElementById('graph-container');
    if (!graphContainer) return;
    
    const rect = graphContainer.getBoundingClientRect();
    
    // Calculate position as percentage of container width/height
    let newX = (e.clientX - rect.left) / rect.width;
    let newY = (e.clientY - rect.top) / rect.height;
    
    // Constrain to container bounds
    newX = Math.max(0, Math.min(newX, 1));
    newY = Math.max(0, Math.min(newY, 1));
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      onPlace(position.x, position.y);
      setIsDragging(false);
    }
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    
    setIsDragging(true);
    bringToFront();
    
    if (!isPlaced) {
      const graphContainer = document.getElementById('graph-container');
      if (!graphContainer) return;
      
      const rect = graphContainer.getBoundingClientRect();
      const x = (e.touches[0].clientX - rect.left) / rect.width;
      const y = (e.touches[0].clientY - rect.top) / rect.height;
      
      setPosition({ x, y });
      onPlace(x, y);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    
    const graphContainer = document.getElementById('graph-container');
    if (!graphContainer) return;
    
    const rect = graphContainer.getBoundingClientRect();
    
    let newX = (e.touches[0].clientX - rect.left) / rect.width;
    let newY = (e.touches[0].clientY - rect.top) / rect.height;
    
    newX = Math.max(0, Math.min(newX, 1));
    newY = Math.max(0, Math.min(newY, 1));
    
    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      onPlace(position.x, position.y);
      setIsDragging(false);
    }
  };

  const bringToFront = () => {
    setZIndex(prev => prev + 1);
  };

  // Effect to add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, position]);

  // Style for the pin
  const pinStyle = {
    backgroundColor: color,
    color: textColor,
    zIndex,
    ...(isPlaced && {
      position: 'absolute',
      left: `${position.x * 100}%`,
      top: `${position.y * 100}%`,
      transform: 'translate(-50%, -50%)'
    }),
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  const pinClasses = `pin ${isDragging ? 'dragging' : ''} ${isPlaced ? '' : 'unplaced'}`;

  return (
    <div
      ref={pinRef}
      className={pinClasses}
      style={pinStyle}
      data-player={player}
      data-placed={isPlaced}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={bringToFront}
    >
      {player}
    </div>
  );
};

export default Pin;