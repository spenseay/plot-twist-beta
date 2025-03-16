const PlayerItem = ({ number, name, onRemove }) => {
    return (
      <div className="player-item">
        <div style={{ marginRight: '10px' }}>{number}.</div>
        <span>{name}</span>
        <button 
          className="secondary" 
          style={{ padding: '5px 10px' }}
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
    );
  };
  
  export default PlayerItem;