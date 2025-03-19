<template>
    <div class="section game-section">
      <div id="turn-indicator">{{ gameState.currentPlayer }}'s Turn</div>
      
      <div class="instructions">
        <p>Drag each sticky note from below and place it where you think that person belongs on the graph.</p>
      </div>
      
      <div class="pins-container">
        <PinComponent
          v-for="(player, index) in gameState.allPlayers"
          :key="player"
          :player="player"
          :color-index="index"
          :container-ref="graphContainerRef"
          @pin-placed="handlePinPlaced"
          @pin-moved="handlePinMoved"
          @pin-removed="handlePinRemoved"
        />
      </div>
      
      <div
        :class="['pins-status', { 'all-placed': allPinsPlaced }]"
      >
        {{ pinsStatusText }}
      </div>
      
      <div ref="graphContainerRef" class="graph-container">
        <AxisDisplay :container-ref="graphContainerRef" />
      </div>
      
      <div class="button-group" style="justify-content: center;">
        <button 
          :disabled="!allPinsPlaced" 
          @click="confirmPlacement"
        >
          Confirm Placement
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, inject, onMounted } from 'vue'
  import PinComponent from './PinComponent.vue'
  import AxisDisplay from './AxisDisplay.vue'
  
  const emit = defineEmits(['turn-completed'])
  const gameState = inject('gameState')
  
  const graphContainerRef = ref(null)
  const placedPins = ref(new Set())
  const currentPlacements = ref({})
  
  // Computed properties
  const allPinsPlaced = computed(() => {
    return placedPins.value.size === gameState.players.value.length
  })
  
  const pinsStatusText = computed(() => {
    if (allPinsPlaced.value) {
      return 'All pins placed! You can now confirm.'
    } else {
      return `Placed ${placedPins.value.size} of ${gameState.players.value.length} pins. Please place all pins on the chart.`
    }
  })
  
  // Pin event handlers
  function handlePinPlaced(player) {
    placedPins.value.add(player)
  }
  
  function handlePinMoved(player, position) {
    currentPlacements.value[player] = position
  }
  
  function handlePinRemoved(player) {
    placedPins.value.delete(player)
    if (currentPlacements.value[player]) {
      delete currentPlacements.value[player]
    }
  }
  
  // Confirm current placement and move to next turn
  function confirmPlacement() {
    if (!allPinsPlaced.value) return
    
    // Save current placements to game state
    gameState.savePlacements(currentPlacements.value)
    
    // Reset for next turn
    placedPins.value.clear()
    currentPlacements.value = {}
    
    // Emit event to move to next turn
    emit('turn-completed')
  }
  </script>
  
  <style scoped>
  .game-section {
    background-color: white;
  }
  
  .section {
    margin-bottom: 15px;
    padding: 12px;
    border-radius: 8px;
  }
  
  /* Turn indicator */
  #turn-indicator {
    text-align: center;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
    color: #4c2c69;
  }
  
  /* Instructions */
  .instructions {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #fdc30f;
    border-radius: 4px;
    font-size: 13px;
  }
  
  /* Graph container */
  .graph-container {
    position: relative;
    width: 100%;
    max-width: 350px;
    aspect-ratio: 1 / 1;
    margin: 0 auto;
    border: 2px solid #4c2c69;
    border-radius: 4px;
    background-color: white;
  }
  
  /* Pins container */
  .pins-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
    margin: 15px 0;
    padding: 8px;
    height: auto;
  }
  
  /* Pins in container */
  .pins-container :deep(.pin) {
    position: relative;
    transform: none;
    margin: 3px;
    display: inline-block;
    height: 34px;
    flex-grow: 0;
  }
  
  /* Pins status indicator */
  .pins-status {
    margin: 8px 0;
    padding: 8px;
    background-color: #f2f2f2;
    border-radius: 4px;
    text-align: center;
    transition: all 0.3s ease;
    font-size: 13px;
  }
  
  .pins-status.all-placed {
    background-color: #a6d3a0;
    color: #2a6b34;
  }
  
  @media (min-width: 768px) {
    .section {
      padding: 15px;
      margin-bottom: 20px;
    }
    
    #turn-indicator {
      font-size: 20px;
    }
    
    .instructions {
      font-size: 14px;
    }
    
    .pins-container :deep(.pin) {
      height: 36px;
      margin: 4px;
    }
  }
  
  @media (max-width: 480px) {
    .section {
      padding: 10px;
      margin-bottom: 15px;
    }
  }
  </style>