<template>
    <div class="container">
      <h1>Plot Twist!</h1>
  
      <!-- Game setup section -->
      <GameSetup 
        v-if="currentView === 'setup'"
        @start-game="startGame" 
      />
  
      <!-- Game board section -->
      <GameBoard 
        v-if="currentView === 'game'"
        @turn-completed="handleTurnCompleted" 
      />
  
      <!-- Final scores section -->
      <ScoreBoard 
        v-if="currentView === 'scores'"
        @play-again="restartGame" 
      />
    </div>
  </template>
  
  <script setup>
  import { ref, provide, onMounted } from 'vue'
  import { useGameState } from './composables/useGameState'
  import GameSetup from './components/GameSetup.vue'
  import GameBoard from './components/GameBoard.vue'
  import ScoreBoard from './components/ScoreBoard.vue'
  
  // Initialize game state
  const gameState = useGameState()
  const currentView = ref('setup')
  
  // Make the game state available to all components
  provide('gameState', gameState)
  
  // Initialize the game
  onMounted(() => {
    // Randomize axes on initial load
    gameState.randomizeAxes()
  })
  
  // Event handlers
  function startGame() {
    gameState.startGame()
    currentView.value = 'game'
  }
  
  function handleTurnCompleted() {
    gameState.nextTurn()
    
    if (gameState.gameFinished.value) {
      currentView.value = 'scores'
    }
  }
  
  function restartGame() {
    gameState.resetGame()
    currentView.value = 'setup'
  }
  </script>
  
  <style>
  /* Global Styles */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  body {
    background-color: #f9f9f9;
    color: #4c2c69;
    line-height: 1.6;
    padding: 10px;
  }
  
  h1, h2, h3 {
    margin-bottom: 10px;
    color: #4c2c69;
    font-size: 1.5em;
  }
  
  h1 {
    font-size: 1.8em;
  }
  
  /* Container for the game */
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 10px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
  }
  
  /* Button styles */
  button {
    background-color: #3891a6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #2f758a;
  }
  
  button.secondary {
    background-color: #db5461;
  }
  
  button.secondary:hover {
    background-color: #c14853;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  /* Responsive styles */
  @media (min-width: 768px) {
    .container {
      max-width: 800px;
      padding: 15px;
    }
  }
  
  @media (max-width: 480px) {
    .container {
      padding: 8px;
    }
    
    h1 {
      font-size: 24px;
    }
    
    h2 {
      font-size: 20px;
    }
    
    button {
      padding: 8px 16px;
      font-size: 14px;
    }
  }
  </style>