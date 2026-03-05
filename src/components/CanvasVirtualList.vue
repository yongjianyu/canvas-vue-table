<template>
  <div
    ref="containerRef"
    class="canvas-virtual-list"
    :style="{ height: `${height}px` }"
    @scroll="onScroll"
  >
    <div class="canvas-virtual-list__spacer" :style="{ height: `${totalHeight}px` }">
      <canvas
        ref="canvasRef"
        class="canvas-virtual-list__canvas"
        :width="width"
        :height="height"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'
import { useVirtualList } from '../composables/useVirtualList'

interface Props {
  items?: unknown[]
  itemHeight?: number
  height?: number
  bufferSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  itemHeight: 40,
  height: 400,
  bufferSize: 3,
})

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const width = ref(0)

const itemsRef = computed(() => props.items)
const { totalHeight, range, setScrollTop } = useVirtualList(itemsRef, {
  itemHeight: props.itemHeight,
  containerHeight: props.height,
  bufferSize: props.bufferSize,
})

function onScroll() {
  const el = containerRef.value
  if (el) setScrollTop(el.scrollTop)
}

function render() {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas) return

  const { visibleItems, offsetY, startIndex } = range.value
  const { itemHeight } = props

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  visibleItems.forEach((item, i) => {
    const index = startIndex + i
    const y = index * itemHeight - offsetY
    const text = (() => {
      if (item == null) return ''
      if (typeof item === 'string' || typeof item === 'number') return String(item)
      if (typeof item === 'object' && 'name' in item) return String((item as { name?: unknown }).name)
      if (typeof item === 'object' && 'label' in item) return String((item as { label?: unknown }).label)
      return String(item)
    })()

    ctx.fillStyle = index % 2 === 0 ? '#fff' : '#f8f9fa'
    ctx.fillRect(0, y, canvas.width, itemHeight)

    ctx.strokeStyle = '#eee'
    ctx.beginPath()
    ctx.moveTo(0, y + itemHeight)
    ctx.lineTo(canvas.width, y + itemHeight)
    ctx.stroke()

    ctx.fillStyle = '#333'
    ctx.font = '14px system-ui, sans-serif'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 12, y + itemHeight / 2)
  })
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  const container = containerRef.value
  if (container) {
    width.value = container.clientWidth
    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) width.value = entry.contentRect.width
    })
    resizeObserver.observe(container)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

watchEffect(() => {
  range.value
  width.value
  render()
})
</script>

<style scoped>
.canvas-virtual-list {
  overflow: auto;
  position: relative;
}

.canvas-virtual-list__spacer {
  position: relative;
  width: 100%;
}

.canvas-virtual-list__canvas {
  position: sticky;
  top: 0;
  left: 0;
  display: block;
}
</style>
