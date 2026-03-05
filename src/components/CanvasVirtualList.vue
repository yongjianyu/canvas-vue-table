<template>
  <div ref="containerRef" class="canvas-virtual-list" :style="{ height: `${height}px` }">
    <canvas
      ref="canvasRef"
      class="canvas-virtual-list__canvas"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  items?: unknown[]
  itemHeight?: number
  height?: number
  bufferSize?: number
}

withDefaults(defineProps<Props>(), {
  items: () => [],
  itemHeight: 40,
  height: 400,
  bufferSize: 3,
})

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const width = ref(0)

// TODO: 实现 Canvas 虚拟列表渲染逻辑
</script>

<style scoped>
.canvas-virtual-list {
  overflow: hidden;
  position: relative;
}

.canvas-virtual-list__canvas {
  display: block;
}
</style>
