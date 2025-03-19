import { ref, reactive, computed } from 'vue'

// Define constants for the color palette
const PLAYER_COLORS = [
  '#db5461',
  '#3891a6',
  '#fdc30f',
  '#a6d3a0',
  '#4c2c69',
  '#e898a0',
  '#65b1c2',
  '#feec7f',
  '#c0e2bc'
]

// Axis options matching the original game
const AXIS_OPTIONS = [
  { start: "High Five", end: "Fist Bump" },
  { start: "Couch Potato", end: "Touches Grass" },
  { start: "Lights Candles", end: "Lights Bonfires" },
  // Additional axis options would be here...
  { start: "Power Walker", end: "Stroller" }
]

export function useGameState() {
  // Game state with reactive properties
  const players = ref([])
  const currentTurn = ref(0)
  const placements = reactive({})
  const selectedFilter = ref('all')
  const axes = reactive({
    x: { start: "", end: "" },
    y: { start: "", end: "" }
  })
  
  // Computed properties
  const currentPlayer = computed(() => players.value[currentTurn.value] || '')
  const isGameReady = computed(() => players.value.length >= 2)
  const allPlayers = computed(() => players.value)
  const gameFinished = computed(() => currentTurn.value >= players.value.length)
  
  // Methods
  function addPlayer(name) {
    if (!name.trim()) return false
    if (players.value.includes(name)) return false
    
    players.value.push(name)
    placements[name] = {}
    return true
  }
  
  function removePlayer(index) {
    const playerName = players.value[index]
    players.value.splice(index, 1)
    delete placements[playerName]
  }
  
  function clearPlayers() {
    players.value = []
    Object.keys(placements).forEach(key => {
      delete placements[key]
    })
  }
  
  function randomizeAxes() {
    const shuffled = [...AXIS_OPTIONS].sort(() => 0.5 - Math.random())
    
    const xAxis = shuffled[0]
    const yAxis = shuffled[1] || shuffled[0]
    
    const xSwap = Math.random() > 0.5
    const ySwap = Math.random() > 0.5
    
    axes.x.start = xSwap ? xAxis.end : xAxis.start
    axes.x.end = xSwap ? xAxis.start : xAxis.end
    axes.y.start = ySwap ? yAxis.end : yAxis.start
    axes.y.end = ySwap ? yAxis.start : yAxis.end
    
    return axes
  }
  
  function startGame() {
    currentTurn.value = 0
    players.value.forEach(p => {
      placements[p] = {}
    })
    randomizeAxes()
  }
  
  function savePlacements(placementsForTurn) {
    const player = players.value[currentTurn.value]
    placements[player] = { ...placementsForTurn }
  }
  
  function nextTurn() {
    if (currentTurn.value < players.value.length) {
      currentTurn.value++
    }
  }
  
  function calculateScores() {
    const scores = {}
    players.value.forEach(p => scores[p] = 0)
    
    players.value.forEach(person => {
      const selfPlacement = placements[person][person]
      players.value.forEach(player => {
        if (player === person) return
        const placement = placements[player][person]
        if (!placement || !selfPlacement) return
        
        const dist = calculateDistance(selfPlacement, placement)
        const maxDist = Math.sqrt(2)
        const score = Math.max(0, Math.round(100 - (dist/maxDist)*100))
        scores[player] += score
      })
    })
    
    return scores
  }
  
  function setSelectedFilter(filter) {
    selectedFilter.value = filter
  }
  
  function resetGame() {
    players.value = []
    currentTurn.value = 0
    Object.keys(placements).forEach(key => {
      delete placements[key]
    })
    selectedFilter.value = 'all'
    randomizeAxes()
  }
  
  // Helper functions
  function calculateDistance(a, b) {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.sqrt(dx*dx + dy*dy)
  }
  
  function getPlayerColor(index) {
    return PLAYER_COLORS[index % PLAYER_COLORS.length]
  }
  
  function getContrastColor(hexColor) {
    // Remove '#' if present
    if (hexColor.startsWith('#')) {
      hexColor = hexColor.substring(1)
    }
    
    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16)
    const g = parseInt(hexColor.substr(2, 2), 16)
    const b = parseInt(hexColor.substr(4, 2), 16)
    
    // Calculate YIQ ratio to determine brightness
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
    
    // Return white or black based on brightness
    return yiq < 128 ? 'white' : '#4c2c69'
  }
  
  return {
    // State
    players,
    currentTurn,
    placements,
    selectedFilter,
    axes,
    
    // Computed
    currentPlayer,
    isGameReady,
    allPlayers,
    gameFinished,
    
    // Methods
    addPlayer,
    removePlayer,
    clearPlayers,
    randomizeAxes,
    startGame,
    savePlacements,
    nextTurn,
    calculateScores,
    setSelectedFilter,
    resetGame,
    
    // Helpers
    calculateDistance,
    getPlayerColor,
    getContrastColor,
    
    // Constants
    PLAYER_COLORS
  }
}