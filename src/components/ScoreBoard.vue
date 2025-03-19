<template>
  <div class="section final-scores-section">
    <h2>Final Scores</h2>
    
    <!-- Final scores table -->
    <div class="scores-table">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(player, index) in sortedScores" 
            :key="player.player"
            :class="{ 'winner': index === 0 }"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ player.player }}</td>
            <td>{{ player.score }} points</td>
          </tr>
        </tbody>
      </table>
      
      <div class="winner-announcement" v-if="sortedScores.length > 0">
        <strong>{{ winner.player }}</strong> knows their friends best with {{ winner.score }} points!
      </div>
    </div>
    
    <h3>Everyone's Placements</h3>
    
    <!-- Player filter buttons -->
    <div class="player-filter-container">
      <div class="player-filter-heading">View where people placed:</div>
      <div class="player-filter-buttons">
        <div 
          class="player-filter-button all-button"
          :class="{ 'active': selectedFilter === 'all' }"
          @click="setFilter('all')"
        >
          All
        </div>
        
        <div 
          v-for="(player, index) in playerList"
          :key="player"
          class="player-filter-button"
          :class="{ 'active': selectedFilter === player }"
          :style="getPlayerButtonStyle(index)"
          @click="setFilter(player)"
        >
          {{ player }}
        </div>
      </div>
    </div>
    
    <!-- Results chart -->
    <div ref="chartContainerRef" class="collective-placements-container">
      <ResultsChart 
        :container-ref="chartContainerRef"
        :selected-filter="selectedFilter"
      />
    </div>
    
    <div style="text-align: center; margin-top: 15px; margin-bottom: 15px;">
      <p style="color: white; font-size: 14px; margin-bottom: 8px;">
        Thanks for playing Plot Twist, please give us some feedback
      </p>
      <p style="margin-top: 8px;">
        <a href="https://forms.gle/P7ZFndmYZTRCye8i9" target="_blank"
          style="color: white; text-decoration: underline;">
          https://forms.gle/YL3cLa2v239HMNGe6
        </a>
      </p>
    </div>
    
    <div class="button-group" style="justify-content: center;">
      <button @click="playAgain">Play Again</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import ResultsChart from './ResultsChart.vue'

const emit = defineEmits(['play-again'])
const gameState = inject('gameState')
const chartContainerRef = ref(null)
const selectedFilter = ref('all')

// Computed properties with proper reactivity
const playerList = computed(() => gameState.players.value)

// Calculate and sort final scores
const scores = computed(() => {
  return gameState.calculateScores()
})

const sortedScores = computed(() => {
  return Object.entries(scores.value)
    .map(([player, score]) => ({ player, score }))
    .sort((a, b) => b.score - a.score)
})

const winner = computed(() => {
  return sortedScores.value[0] || { player: '', score: 0 }
})

// Filter management
function setFilter(filter) {
  selectedFilter.value = filter
  gameState.setSelectedFilter(filter)
}

// Player button styling
function getPlayerButtonStyle(index) {
  const color = gameState.getPlayerColor(index)
  const textColor = gameState.getContrastColor(color)
  
  return {
    backgroundColor: color,
    color: textColor
  }
}

// Play again
function playAgain() {
  emit('play-again')
}
</script>

<style scoped>
.final-scores-section {
  background-color: #4c2c69;
  color: white;
  padding: 15px;
  border-radius: 8px;
}

.section {
  margin-bottom: 15px;
}

h2 {
  color: white;
  font-size: 1.5em;
  margin-bottom: 10px;
}

h3 {
  font-size: 1.3em;
  margin-top: 20px;
  margin-bottom: 10px;
  color: white;
}

/* Scoreboard tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
  font-size: 14px;
  background-color: white;
  color: #4c2c69;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #3891a6;
  color: white;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:nth-child(odd) {
  background-color: white;
}

.winner {
  background-color: #fdc30f;
  color: #4c2c69;
  font-weight: bold;
}

.winner-announcement {
  text-align: center;
  font-size: 18px;
  margin: 15px 0;
  color: #4c2c69;
  background-color: white;
  padding: 10px;
  border-radius: 4px;
}

/* Final scoreboard filters */
.player-filter-container {
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.player-filter-heading {
  text-align: center;
  margin-bottom: 12px;
  color: #4c2c69;
  font-weight: bold;
  font-size: 16px;
}

.player-filter-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.player-filter-button {
  padding: 6px 10px;
  border-radius: 6px;
  border: 2px solid transparent;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  min-width: 70px;
  text-align: center;
  font-size: 12px;
}

.player-filter-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 5px rgba(0,0,0,0.2);
}

.player-filter-button.active {
  border: 2px solid #4c2c69;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.player-filter-button.all-button {
  background-color: #4c2c69;
  color: white;
}

.player-filter-button.all-button.active {
  border: 2px solid #fdc30f;
}

.collective-placements-container {
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
}

@media (min-width: 768px) {
  .player-filter-button {
    font-size: 13px;
    padding: 6px 12px;
  }
}
</style>