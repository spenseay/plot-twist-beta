<template>
    <div>
      <!-- X axis labels -->
      <div class="axis-label x-axis-start">{{ axes.x.start }}</div>
      <div class="axis-label x-axis-end">{{ axes.x.end }}</div>
      
      <!-- Y axis labels -->
      <div class="axis-label y-axis-start">{{ axes.y.start }}</div>
      <div class="axis-label y-axis-end">{{ axes.y.end }}</div>
      
      <!-- Y axis arrow -->
      <div ref="yAxisArrow" class="axis-arrow y-axis-arrow">
        <div class="arrow-head arrow-top"></div>
        <div class="arrow-head arrow-bottom"></div>
      </div>
      
      <!-- X axis arrow -->
      <div class="axis-arrow x-axis-arrow" style="
        position: absolute; 
        top: 50%; 
        left: 50px; 
        right: 50px;
        height: 2px; 
        transform: translateY(-50%);
        background-color: #4c2c69; 
        pointer-events: none;"
      >
        <div class="arrow-head arrow-left"></div>
        <div class="arrow-head arrow-right"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, inject } from 'vue'
  
  const props = defineProps({
    containerRef: {
      type: Object,
      required: true
    }
  })
  
  const gameState = inject('gameState')
  const { axes } = gameState
  const yAxisArrow = ref(null)
  
  // Adjust the y-axis arrow length based on label positions
  function adjustYAxisArrow() {
    if (!props.containerRef.value) return
    
    const container = props.containerRef.value
    const yAxisEndLabel = container.querySelector('.y-axis-end')
    const yAxisStartLabel = container.querySelector('.y-axis-start')
    
    if (!yAxisEndLabel || !yAxisStartLabel || !yAxisArrow.value) return
    
    // Let the DOM layout happen first
    requestAnimationFrame(() => {
      const margin = 5 // extra spacing so arrow doesn't overlap text
      const containerRect = container.getBoundingClientRect()
      const endRect = yAxisEndLabel.getBoundingClientRect()
      const startRect = yAxisStartLabel.getBoundingClientRect()
      
      // Distance from container's top to bottom of top label
      const arrowTop = (endRect.bottom - containerRect.top) + margin
      
      // Distance from container's bottom to top of bottom label
      const arrowBottom = (containerRect.bottom - startRect.top) + margin
      
      // Set arrow line
      yAxisArrow.value.style.top = arrowTop + 'px'
      yAxisArrow.value.style.bottom = arrowBottom + 'px'
    })
  }
  
  // Adjust arrow on mount and when axes change
  onMounted(() => {
    adjustYAxisArrow()
    
    // Reapply when window resizes
    window.addEventListener('resize', adjustYAxisArrow)
  })
  
  // Clean up resize listener
  onBeforeUnmount(() => {
    window.removeEventListener('resize', adjustYAxisArrow)
  })
  
  // Watch for axis changes to readjust arrow
  watch(() => [axes.x.start, axes.x.end, axes.y.start, axes.y.end], () => {
    // Use nextTick to ensure DOM has updated with new labels
    nextTick(() => {
      adjustYAxisArrow()
    })
  })
  </script>
  
  <style scoped>
  /* Axis labels */
  .axis-label {
    position: absolute;
    font-weight: bold;
    color: #4c2c69;
    z-index: 5;
    font-size: 12px;
    padding: 3px;
    background-color: rgba(255,255,255,0.7);
    border-radius: 3px;
    text-align: center;
    max-width: 100px;
  }
  
  /* X axis labels */
  .x-axis-start {
    left: 10px;
    bottom: calc(50% + 15px);
  }
  
  .x-axis-end {
    right: 10px;
    bottom: calc(50% + 15px);
  }
  
  /* Y axis labels */
  .y-axis-start {
    left: 50%;
    bottom: 10px;
    transform: translateX(-50%);
  }
  
  .y-axis-end {
    left: 50%;
    top: 10px;
    transform: translateX(-50%);
  }
  
  /* The y-axis arrow itself */
  .y-axis-arrow {
    position: absolute;
    pointer-events: none;
    left: 50%;
    width: 2px;
    transform: translateX(-50%);
    background-color: #4c2c69;
  }
  
  /* Arrow heads */
  .arrow-head {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }
  
  .arrow-top {
    top: -6px;
    left: -4px;
    border-width: 0 5px 8px 5px;
    border-color: transparent transparent #4c2c69 transparent;
  }
  
  .arrow-bottom {
    bottom: -6px;
    left: -4px;
    border-width: 8px 5px 0 5px;
    border-color: #4c2c69 transparent transparent transparent;
  }
  
  .arrow-left {
    left: -6px;
    top: -4px;
    border-width: 5px 8px 5px 0;
    border-color: transparent #4c2c69 transparent transparent;
  }
  
  .arrow-right {
    right: -6px;
    top: -4px;
    border-width: 5px 0 5px 8px;
    border-color: transparent transparent transparent #4c2c69;
  }
  
  @media (min-width: 768px) {
    .axis-label {
      font-size: 13px;
      max-width: 90px;
    }
  }
  
  @media (max-width: 480px) {
    .axis-label {
      font-size: 10px;
      max-width: 80px;
    }
    
    .x-axis-start {
      left: 5px;
    }
    
    .x-axis-end {
      right: 5px;
    }
  }
  </style>