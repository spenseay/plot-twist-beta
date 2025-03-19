<template>
    <div class="section setup-section">
      <h2>Player Setup</h2>
      <div class="instructions">
        <p>Enter the names of all players who will participate.</p>
      </div>
      
      <div class="form-group">
        <label for="player-name">Player Name:</label>
        <input 
          type="text" 
          id="player-name" 
          placeholder="Enter player name" 
          v-model="playerName"
          @keyup.enter="addPlayer" 
        />
      </div>
      
      <button @click="addPlayer">Add Player</button>
      
      <div class="players-list">
        <div 
          v-for="(player, index) in gameState.players" 
          :key="index"
          class="player-item"
        >
          <div style="margin-right: 10px;">{{ index + 1 }}.</div>
          <span>{{ player }}</span>
          <button 
            class="secondary" 
            style="padding: 5px 10px;"
            @click="removePlayer(index)"
          >
            Remove
          </button>
        </div>
      </div>
      
      <div class="button-group">
        <button 
          :disabled="!gameState.isGameReady" 
          @click="startGame"
        >
          Start Game
        </button>
        <button 
          class="secondary" 
          @click="clearPlayers"
        >
          Clear All
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, inject } from 'vue'
  
  const gameState = inject('gameState')
  const playerName = ref('')
  
  function addPlayer() {
    if (gameState.addPlayer(playerName.value)) {
      playerName.value = ''
    } else {
      // Could show an error message here
    }
  }
  
  function removePlayer(index) {
    gameState.removePlayer(index)
  }
  
  function clearPlayers() {
    gameState.clearPlayers()
  }
  
  function startGame() {
    if (gameState.isGameReady.value) {
      emit('start-game')
    }
  }
  
  const emit = defineEmits(['start-game'])
  </script>
  
  <style scoped>
  .setup-section {
    background-color: #fdc30f;
    display: block;
  }
  
  .section {
    margin-bottom: 15px;
    padding: 12px;
    border-radius: 8px;
  }
  
  /* Form styles */
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  /* Player list styles */
  .players-list {
    margin: 20px 0;
  }
  
  .player-item {
    background-color: #a6d3a0;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .player-item span {
    flex-grow: 1;
  }
  
  /* Instructions */
  .instructions {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #fdc30f;
    border-radius: 4px;
    font-size: 13px;
  }
  
  @media (min-width: 768px) {
    .section {
      padding: 15px;
      margin-bottom: 20px;
    }
    
    .instructions {
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    .section {
      padding: 10px;
      margin-bottom: 15px;
    }
  }
  </style>