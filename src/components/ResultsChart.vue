<template>
  <div>
    <h3 class="chart-title">Player Placement Map</h3>
    
    <div ref="chartContainerRef" class="chart-container">
      <AxisDisplay :container-ref="chartContainerRef" />
      
      <!-- Player pins -->
      <div
        v-for="(pinData, index) in visiblePins"
        :key="`${pinData.personIndex}-${pinData.placerIndex}-${index}`"
        class="pin"
        :style="getPinStyle(pinData)"
        @click="bringPinToFront(index)"
      >
        {{ getPinLabel(pinData) }}
      </div>
    </div>
    
    <!-- Player-specific scoreboard when filtering -->
    <div 
      v-if="selectedFilter !== 'all' && playerScores.length > 0"
      class="player-scoreboard"
    >
      <h4>Who knows {{ selectedFilter }} best?</h4>
      
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(score, index) in playerScores"
            :key="score.player"
            :class="{ 'winner': index === 0 }"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ score.player }}</td>
            <td>{{ score.score }} points</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from 'vue'
import AxisDisplay from './AxisDisplay.vue'

const props = defineProps({
  containerRef: {
    type: Object,
    required: true
  },
  selectedFilter: {
    type: String,
    default: 'all'
  }
})

const gameState = inject('gameState')
const chartContainerRef = ref(null)
const pinZIndices = ref({})
let nextZIndex = 100

// Access reactive data safely
const playersList = computed(() => gameState.players.value || [])
const placementsData = computed(() => gameState.placements || {})

// Compute pins to display based on filter
const visiblePins = computed(() => {
  const pins = []
  const isFiltering = props.selectedFilter !== 'all'
  const selectedPlayer = props.selectedFilter
  
  playersList.value.forEach((person, personIndex) => {
    // Skip if filtering and not the selected person
    if (isFiltering && person !== selectedPlayer) {
      // For non-selected players when filtering, show dimmed pins
      playersList.value.forEach((placer, placerIndex) => {
        const placement = placementsData.value[placer]?.[person]
        
        if (placement) {
          pins.push({
            person,
            personIndex,
            placer,
            placerIndex,
            placement,
            dimmed: true,
            selfPlaced: false
          })
        }
      })
    } else {
      // For selected player or when not filtering
      playersList.value.forEach((placer, placerIndex) => {
        const placement = placementsData.value[placer]?.[person]
        
        if (placement) {
          const selfPlaced = (placer === person)
          
          pins.push({
            person,
            personIndex, 
            placer,
            placerIndex,
            placement,
            dimmed: false,
            selfPlaced
          })
        }
      })
    }
  })
  
  return pins
})

// Player-specific scores when filtering
const playerScores = computed(() => {
  if (props.selectedFilter === 'all') return []
  
  const player = props.selectedFilter
  const selfPlacement = placementsData.value[player]?.[player]
  
  if (!selfPlacement) return []
  
  const scores = []
  playersList.value.forEach(p => {
    if (p === player) return
    
    const placement = placementsData.value[p]?.[player]
    if (!placement) return
    
    const dist = gameState.calculateDistance(selfPlacement, placement)
    const maxDist = Math.sqrt(2)
    const score = Math.max(0, Math.round(100 - (dist/maxDist)*100))
    
    scores.push({ player: p, score })
  })
  
  return scores.sort((a, b) => b.score - a.score)
})

// Get pin style
function getPinStyle(pinData) {
  const { personIndex, placement, dimmed, selfPlaced } = pinData
  const color = gameState.getPlayerColor(personIndex)
  const textColor = gameState.getContrastColor(color)
  const zIndex = pinZIndices.value[pinData.person + pinData.placer] || nextZIndex++
  
  const style = {
    backgroundColor: color,
    color: textColor,
    position: 'absolute',
    left: `${placement.x * 100}%`,
    top: `${placement.y * 100}%`,
    transform: selfPlaced ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) scale(0.8)',
    zIndex: selfPlaced ? (zIndex + 10) : zIndex,
    opacity: dimmed ? 0.2 : 1
  }
  
  if (selfPlaced) {
    style.boxShadow = '0 0 0 3px white, 2px 2px 5px rgba(0,0,0,0.3)'
  }
  
  return style
}

// Get pin label text
function getPinLabel(pinData) {
  const isFiltering = props.selectedFilter !== 'all'
  
  if (isFiltering && pinData.person === props.selectedFilter) {
    return pinData.placer // Show who placed them
  } else {
    return pinData.person // Show the person
  }
}

// Bring a pin to the front
function bringPinToFront(index) {
  const pin = visiblePins.value[index]
  if (!pin) return
  
  nextZIndex++
  pinZIndices.value[pin.person + pin.placer] = nextZIndex
}

// Initialize
onMounted(() => {
  // Ensure chartContainerRef is properly set
  if (!chartContainerRef.value && props.containerRef?.value) {
    chartContainerRef.value = props.containerRef.value
  }
  
  console.log('ResultsChart mounted, chart container:', chartContainerRef.value)
  console.log('Players list for chart:', playersList.value)
})
</script>

<style scoped>
.chart-title {
  text-align: center;
  margin-bottom: 15px;
  color: #4c2c69;
  font-size: 1.2em;
}

.chart-container {
  position: relative;
  width: 100%;
  max-width: 350px;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  border: 2px solid #4c2c69;
  border-radius: 4px;
  background-color: white;
}

.pin {
  position: absolute;
  min-width: 70px;
  padding: 6px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
  transform: translate(-50%,-50%);
  z-index: 10;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  user-select: none;
  transition: opacity 0.3s, box-shadow 0.2s, transform 0.2s;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-size: 12px;
  border-radius: 2px;
}

.player-scoreboard {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.player-scoreboard h4 {
  text-align: center;
  margin-bottom: 12px;
  color: #4c2c69;
}

/* Style for the winner row */
.winner {
  background-color: #fdc30f !important;
  color: #4c2c69;
  font-weight: bold;
}

/* Table styles */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
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

@media (min-width: 768px) {
  .pin {
    font-size: 13px;
    min-width: 75px;
    padding: 7px 10px;
  }
}
</style>