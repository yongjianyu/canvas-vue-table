<template>
  <div
    ref="containerRef"
    class="canvas-virtual-list"
    :style="{ height: `${height}px` }"
    @scroll="onScroll"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <div
      class="canvas-virtual-list__spacer"
      :style="{ height: `${effectiveHeaderHeight + totalHeight}px` }"
    >
      <canvas
        v-show="hasColumns"
        ref="headerCanvasRef"
        class="canvas-virtual-list__header"
        :width="width"
        :height="effectiveHeaderHeight"
      />
      <canvas
        ref="canvasRef"
        class="canvas-virtual-list__canvas"
        :style="{ top: `${effectiveHeaderHeight}px` }"
        :width="width"
        :height="bodyHeight"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted, nextTick } from 'vue'
import { useVirtualList } from '../composables/useVirtualList'
import type { Column } from '../types'

const HEADER_HEIGHT = 40

interface Props {
  columns?: Column[]
  items?: unknown[]
  itemHeight?: number
  height?: number
  headerHeight?: number
  bufferSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  items: () => [],
  itemHeight: 40,
  height: 400,
  headerHeight: HEADER_HEIGHT,
  bufferSize: 3,
})

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const headerCanvasRef = ref<HTMLCanvasElement | null>(null)
const width = ref(0)
const hoveredIndex = ref(-1)

const hasColumns = computed(() => props.columns.length > 0)
const effectiveHeaderHeight = computed(() =>
  hasColumns.value ? props.headerHeight : 0
)
const bodyHeight = computed(() =>
  Math.max(0, props.height - effectiveHeaderHeight.value)
)

const columnWidths = computed(() => {
  const cols = props.columns
  if (cols.length === 0) return []
  const totalDefined = cols.reduce((s, c) => s + c.width, 0)
  const canvasW = width.value || 1
  if (totalDefined <= 0) {
    return cols.map(() => canvasW / cols.length)
  }
  const scale = canvasW / totalDefined
  return cols.map((c) => c.width * scale)
})

const itemsRef = computed(() => props.items)
const { totalHeight, range, setScrollTop } = useVirtualList(itemsRef, {
  itemHeight: props.itemHeight,
  containerHeight: bodyHeight,
  bufferSize: props.bufferSize,
})

function onScroll() {
  const el = containerRef.value
  if (el) setScrollTop(Math.max(0, el.scrollTop - effectiveHeaderHeight.value))
}

function onMouseMove(e: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const mouseY = e.clientY - rect.top
  if (mouseY < 0 || mouseY >= rect.height) {
    hoveredIndex.value = -1
    return
  }
  const { offsetY, startIndex, endIndex } = range.value
  const index = Math.floor((mouseY + offsetY) / props.itemHeight)
  hoveredIndex.value = index >= startIndex && index < endIndex ? index : -1
}

function onMouseLeave() {
  hoveredIndex.value = -1
}

function getCellValue(item: unknown, field: string): string {
  if (item == null) return ''
  if (typeof item === 'object' && field in item) {
    const v = (item as Record<string, unknown>)[field]
    return v != null ? String(v) : ''
  }
  if (typeof item === 'string' || typeof item === 'number') return String(item)
  return ''
}

function renderHeader() {
  const canvas = headerCanvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas || props.columns.length === 0) return

  const cols = props.columns
  const widths = columnWidths.value
  let x = 0

  ctx.fillStyle = '#f5f5f5'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = '#e0e0e0'
  ctx.font = '14px system-ui, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#333'

  cols.forEach((col, i) => {
    const w = widths[i] ?? 0
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
    ctx.fillText(col.title, x + 12, canvas.height / 2, w - 24)
    x += w
  })
  ctx.beginPath()
  ctx.moveTo(x, 0)
  ctx.lineTo(x, canvas.height)
  ctx.stroke()
}

function render() {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas) return

  const { visibleItems, offsetY, startIndex } = range.value
  const { itemHeight } = props
  const cols = props.columns
  const widths = columnWidths.value
  const hasColumns = cols.length > 0

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  visibleItems.forEach((item, i) => {
    const index = startIndex + i
    const y = index * itemHeight - offsetY

    const isHovered = index === hoveredIndex.value
    ctx.fillStyle = isHovered
      ? '#e8f4fc'
      : index % 2 === 0
        ? '#fff'
        : '#f8f9fa'
    ctx.fillRect(0, y, canvas.width, itemHeight)

    if (hasColumns) {
      let x = 0
      cols.forEach((col, j) => {
        const w = widths[j] ?? 0
        const text = getCellValue(item, col.field)
        ctx.fillStyle = '#333'
        ctx.font = '14px system-ui, sans-serif'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, x + 12, y + itemHeight / 2, w - 24)
        x += w
      })
    } else {
      const text = (() => {
        if (item == null) return ''
        if (typeof item === 'string' || typeof item === 'number') return String(item)
        if (typeof item === 'object' && 'name' in item) return String((item as { name?: unknown }).name)
        if (typeof item === 'object' && 'label' in item) return String((item as { label?: unknown }).label)
        return String(item)
      })()
      ctx.fillStyle = '#333'
      ctx.font = '14px system-ui, sans-serif'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, 12, y + itemHeight / 2)
    }

    ctx.strokeStyle = '#eee'
    ctx.beginPath()
    ctx.moveTo(0, y + itemHeight)
    ctx.lineTo(canvas.width, y + itemHeight)
    ctx.stroke()
  })
}

let resizeObserver: ResizeObserver | null = null

function measureWidth() {
  const container = containerRef.value
  if (container) {
    const w = container.clientWidth
    if (w > 0) width.value = w
  }
}

onMounted(() => {
  const container = containerRef.value
  if (container) {
    measureWidth()
    nextTick(() => {
      measureWidth()
      requestAnimationFrame(() => {
        measureWidth()
        renderHeader()
        render()
      })
    })
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
  columnWidths.value
  hoveredIndex.value
  renderHeader()
  render()
})
</script>

<style scoped>
.canvas-virtual-list {
  overflow: auto;
  position: relative;
  width: 100%;
  cursor: default;
}

.canvas-virtual-list__spacer {
  position: relative;
  width: 100%;
}

.canvas-virtual-list__header {
  position: sticky;
  top: 0;
  left: 0;
  display: block;
  z-index: 1;
}

.canvas-virtual-list__canvas {
  position: sticky;
  left: 0;
  display: block;
}
</style>
