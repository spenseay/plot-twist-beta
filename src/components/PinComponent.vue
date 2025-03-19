<template>
    <div
      ref="pinElement"
      class="pin"
      :class="{ 'dragging': isDragging }"
      :style="pinStyle"
      :data-player="player"
      :data-placed="isPlaced ? 'true' : 'false'"
      @mousedown="dragStart"
      @touchstart="touchStart"
      @click="bringToFront"
    >
      {{ player }}
    </div>
  </template>
  
  <script setup>
  import { ref, computed, inject, onMounted } from 'vue'
  
  const props = defineProps({
    player: {
      type: String,
      required: true
    },
    colorIndex: {
      type: Number,
      required: true
    },
    containerRef: {
      type: Object,
      required: true
    },
    initialPosition: {
      type: Object,
      default: () => null
    },
    graphMode: {
      type: Boolean,
      default: false
    },
    zIndexStart: {
      type: Number,
      default: 100
    }
  })
  
  const emit = defineEmits(['pin-placed', 'pin-moved', 'pin-removed'])
  
  const gameState = inject('gameState')
  const pinElement = ref(null)
  const isDragging = ref(false)
  const isPlaced = ref(false)
  const position = ref({ x: 0, y: 0 })
  const zIndex = ref(props.zIndexStart)
  
  // If initialPosition is provided, use it
  onMounted(() => {
    if (props.initialPosition) {
      position.value = { ...props.initialPosition }
      isPlaced.value = true
      
      // If in graph mode, actually position the pin based on percentages
      if (props.graphMode && props.containerRef.value) {
        const rect = props.containerRef.value.getBoundingClientRect()
        position.value = {
          x: props.initialPosition.x * rect.width,
          y: props.initialPosition.y * rect.height
        }
      }
    }
  })
  
  const pinStyle = computed(() => {
    const color = gameState.getPlayerColor(props.colorIndex)
    const textColor = gameState.getContrastColor(color)
    
    const style = {
      backgroundColor: color,
      color: textColor,
      zIndex: zIndex.value
    }
    
    // If placed on graph, add position styles
    if (isPlaced.value) {
      style.position = 'absolute'
      style.left = `${position.value.x}px`
      style.top = `${position.value.y}px`
    }
    
    return style
  })
  
  // Bring pin to front
  function bringToFront() {
    zIndex.value += 1
  }
  
  // ---- Drag and Drop Implementation ----
  let startX = 0
  let startY = 0
  let offsetX = 0
  let offsetY = 0
  
  function dragStart(event) {
    event.preventDefault()
    isDragging.value = true
    bringToFront()
    
    startX = event.clientX
    startY = event.clientY
    
    if (pinElement.value) {
      const rect = pinElement.value.getBoundingClientRect()
      offsetX = startX - rect.left
      offsetY = startY - rect.top
    }
    
    // If not already placed on graph, move it there
    if (!isPlaced.value && props.containerRef.value) {
      const containerRect = props.containerRef.value.getBoundingClientRect()
      
      // Initial position is relative to the mouse position
      position.value = {
        x: event.clientX - containerRect.left,
        y: event.clientY - containerRect.top
      }
      
      // Remove from current parent
      if (pinElement.value.parentNode) {
        pinElement.value.parentNode.removeChild(pinElement.value)
      }
      
      // Append to graph container
      props.containerRef.value.appendChild(pinElement.value)
    }
    
    document.addEventListener('mousemove', dragMove)
    document.addEventListener('mouseup', dragEnd)
  }
  
  function dragMove(event) {
    if (!isDragging.value || !props.containerRef.value) return
    
    const containerRect = props.containerRef.value.getBoundingClientRect()
    
    // Calculate new position
    let newX = event.clientX - containerRect.left
    let newY = event.clientY - containerRect.top
    
    // Constrain to container boundaries if already placed
    if (isPlaced.value) {
      newX = Math.max(0, Math.min(newX, containerRect.width))
      newY = Math.max(0, Math.min(newY, containerRect.height))
    } else {
      // Check if pin is now over the container
      if (
        newX >= 0 && 
        newX <= containerRect.width && 
        newY >= 0 && 
        newY <= containerRect.height
      ) {
        isPlaced.value = true
        emit('pin-placed', props.player)
      }
    }
    
    // Update position
    position.value = { x: newX, y: newY }
    
    // Emit movement event
    if (isPlaced.value) {
      const normalizedPosition = {
        x: position.value.x / containerRect.width,
        y: position.value.y / containerRect.height
      }
      emit('pin-moved', props.player, normalizedPosition)
    }
  }
  
  function dragEnd() {
    if (!isDragging.value) return
    
    isDragging.value = false
    
    // Check if pin is outside container bounds
    if (props.containerRef.value && !isPlaced.value) {
      const containerRect = props.containerRef.value.getBoundingClientRect()
      const outside = (
        position.value.x < 0 || 
        position.value.x > containerRect.width || 
        position.value.y < 0 || 
        position.value.y > containerRect.height
      )
      
      if (outside) {
        // Remove from graph container
        if (pinElement.value && pinElement.value.parentNode === props.containerRef.value) {
          props.containerRef.value.removeChild(pinElement.value)
        }
        
        emit('pin-removed', props.player)
      }
    }
    
    document.removeEventListener('mousemove', dragMove)
    document.removeEventListener('mouseup', dragEnd)
  }
  
  // Touch event handlers
  function touchStart(event) {
    if (event.touches.length !== 1) return
    
    event.preventDefault()
    isDragging.value = true
    bringToFront()
    
    const touch = event.touches[0]
    startX = touch.clientX
    startY = touch.clientY
    
    if (pinElement.value) {
      const rect = pinElement.value.getBoundingClientRect()
      offsetX = startX - rect.left
      offsetY = startY - rect.top
    }
    
    // If not already placed on graph, move it there
    if (!isPlaced.value && props.containerRef.value) {
      const containerRect = props.containerRef.value.getBoundingClientRect()
      
      // Initial position is relative to the touch position
      position.value = {
        x: touch.clientX - containerRect.left,
        y: touch.clientY - containerRect.top
      }
      
      // Remove from current parent
      if (pinElement.value.parentNode) {
        pinElement.value.parentNode.removeChild(pinElement.value)
      }
      
      // Append to graph container
      props.containerRef.value.appendChild(pinElement.value)
    }
    
    document.addEventListener('touchmove', touchMove, { passive: false })
    document.addEventListener('touchend', touchEnd)
  }
  
  function touchMove(event) {
    event.preventDefault()
    
    if (!isDragging.value || !props.containerRef.value || event.touches.length !== 1) return
    
    const touch = event.touches[0]
    const containerRect = props.containerRef.value.getBoundingClientRect()
    
    // Calculate new position
    let newX = touch.clientX - containerRect.left
    let newY = touch.clientY - containerRect.top
    
    // Constrain to container boundaries if already placed
    if (isPlaced.value) {
      newX = Math.max(0, Math.min(newX, containerRect.width))
      newY = Math.max(0, Math.min(newY, containerRect.height))
    } else {
      // Check if pin is now over the container
      if (
        newX >= 0 && 
        newX <= containerRect.width && 
        newY >= 0 && 
        newY <= containerRect.height
      ) {
        isPlaced.value = true
        emit('pin-placed', props.player)
      }
    }
    
    // Update position
    position.value = { x: newX, y: newY }
    
    // Emit movement event
    if (isPlaced.value) {
      const normalizedPosition = {
        x: position.value.x / containerRect.width,
        y: position.value.y / containerRect.height
      }
      emit('pin-moved', props.player, normalizedPosition)
    }
  }
  
  function touchEnd() {
    if (!isDragging.value) return
    
    isDragging.value = false
    
    // Check if pin is outside container bounds
    if (props.containerRef.value && !isPlaced.value) {
      const containerRect = props.containerRef.value.getBoundingClientRect()
      const outside = (
        position.value.x < 0 || 
        position.value.x > containerRect.width || 
        position.value.y < 0 || 
        position.value.y > containerRect.height
      )
      
      if (outside) {
        // Remove from graph container
        if (pinElement.value && pinElement.value.parentNode === props.containerRef.value) {
          props.containerRef.value.removeChild(pinElement.value)
        }
        
        emit('pin-removed', props.player)
      }
    }
    
    document.removeEventListener('touchmove', touchMove)
    document.removeEventListener('touchend', touchEnd)
  }
  
  // Expose methods that might be needed by parent components
  defineExpose({
    pinElement,
    isPlaced,
    position,
    bringToFront
  })
  </script>
  
  <style scoped>
  .pin {
    min-width: 70px;
    padding: 6px 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    cursor: pointer;
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
  
  .pin[data-placed="false"] {
    box-shadow: 0 0 0 2px #db5461, 2px 2px 5px rgba(0,0,0,0.3);
    animation: pulse 2s infinite;
  }
  
  .pin.dragging {
    cursor: grabbing;
    box-shadow: 3px 3px 8px rgba(0,0,0,0.3);
    z-index: 1000;
  }
  
  /* Pin on graph */
  .pin[data-placed="true"] {
    transform: translate(-50%,-50%);
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 2px #db5461; }
    50% { box-shadow: 0 0 0 4px #db5461; }
    100% { box-shadow: 0 0 0 2px #db5461; }
  }
  
  @media (min-width: 768px) {
    .pin {
      font-size: 13px;
      min-width: 75px;
      padding: 7px 10px;
    }
  }
  </style>