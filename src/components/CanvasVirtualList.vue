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
        :width="width * dpr"
        :height="effectiveHeaderHeight * dpr"
        :style="{ width: `${width}px`, height: `${effectiveHeaderHeight}px` }"
      />
      <canvas
        ref="canvasRef"
        class="canvas-virtual-list__canvas"
        :width="width * dpr"
        :height="bodyHeight * dpr"
        :style="{ top: `${effectiveHeaderHeight}px`, width: `${width}px`, height: `${bodyHeight}px` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted, nextTick } from 'vue'
import { useVirtualList } from '../composables/useVirtualList'
import type { Column } from '../types'

const HEADER_HEIGHT = 40
const FONT = '14px system-ui, sans-serif'
const LINE_HEIGHT = 20
const CELL_PADDING_X = 12
const CELL_PADDING_Y = 10

interface Props {
  columns?: Column[]
  items?: unknown[]
  minItemHeight?: number
  height?: number
  headerHeight?: number
  bufferSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  items: () => [],
  minItemHeight: 40,
  height: 400,
  headerHeight: HEADER_HEIGHT,
  bufferSize: 3,
})

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const headerCanvasRef = ref<HTMLCanvasElement | null>(null)
const width = ref(0)
const hoveredIndex = ref(-1)
const dpr = ref(window.devicePixelRatio || 1)

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

let measureCtx: CanvasRenderingContext2D | null = null
function getMeasureCtx(): CanvasRenderingContext2D {
  if (!measureCtx) {
    const c = document.createElement('canvas')
    measureCtx = c.getContext('2d')!
  }
  measureCtx.font = FONT
  return measureCtx
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  if (maxWidth <= 0) return ['']
  const words = text.split('')
  const lines: string[] = []
  let current = ''
  for (const ch of words) {
    const test = current + ch
    if (ctx.measureText(test).width > maxWidth && current.length > 0) {
      lines.push(current)
      current = ch
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines.length > 0 ? lines : ['']
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

function getItemText(item: unknown): string {
  if (item == null) return ''
  if (typeof item === 'string' || typeof item === 'number') return String(item)
  if (typeof item === 'object' && 'name' in item) return String((item as { name?: unknown }).name)
  if (typeof item === 'object' && 'label' in item) return String((item as { label?: unknown }).label)
  return String(item)
}

function measureRowHeight(item: unknown, cols: Column[], widths: number[]): number {
  const ctx = getMeasureCtx()
  let maxLines = 1
  if (cols.length > 0) {
    cols.forEach((col, j) => {
      const w = widths[j] ?? 0
      const text = getCellValue(item, col.field)
      const lines = wrapText(ctx, text, w - CELL_PADDING_X * 2)
      if (lines.length > maxLines) maxLines = lines.length
    })
  } else {
    const text = getItemText(item)
    const lines = wrapText(ctx, text, (width.value || 300) - CELL_PADDING_X * 2)
    if (lines.length > maxLines) maxLines = lines.length
  }
  return Math.max(props.minItemHeight, maxLines * LINE_HEIGHT + CELL_PADDING_Y * 2)
}

const itemHeights = computed(() => {
  const cols = props.columns
  const widths = columnWidths.value
  width.value
  return props.items.map((item) => measureRowHeight(item, cols, widths))
})

const itemsRef = computed(() => props.items)
const { totalHeight, prefixSums, range, setScrollTop } = useVirtualList(itemsRef, {
  itemHeights,
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
  const sums = prefixSums.value
  const absY = mouseY + offsetY
  let idx = -1
  for (let i = startIndex; i < endIndex; i++) {
    if (absY >= sums[i] && absY < sums[i + 1]) {
      idx = i
      break
    }
  }
  hoveredIndex.value = idx
}

function onMouseLeave() {
  hoveredIndex.value = -1
}

function renderHeader() {
  const canvas = headerCanvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas || props.columns.length === 0) return

  const ratio = dpr.value
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

  const cols = props.columns
  const widths = columnWidths.value
  const h = props.headerHeight
  let x = 0

  ctx.fillStyle = '#f5f5f5'
  ctx.fillRect(0, 0, width.value, h)

  ctx.strokeStyle = '#e0e0e0'
  ctx.font = FONT
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#333'

  cols.forEach((col, i) => {
    const w = widths[i] ?? 0
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
    ctx.fillText(col.title, x + CELL_PADDING_X, h / 2, w - CELL_PADDING_X * 2)
    x += w
  })
  ctx.beginPath()
  ctx.moveTo(x, 0)
  ctx.lineTo(x, h)
  ctx.stroke()
}

function render() {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas) return

  const ratio = dpr.value
  const canvasW = width.value
  const canvasH = bodyHeight.value
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

  const { visibleItems, offsetY, startIndex } = range.value
  const cols = props.columns
  const widths = columnWidths.value
  const hasCols = cols.length > 0
  const sums = prefixSums.value

  ctx.clearRect(0, 0, canvasW, canvasH)

  visibleItems.forEach((item, i) => {
    const index = startIndex + i
    const rowTop = sums[index] - offsetY
    const rowH = sums[index + 1] - sums[index]

    const isHovered = index === hoveredIndex.value
    ctx.fillStyle = isHovered
      ? '#e8f4fc'
      : index % 2 === 0
        ? '#fff'
        : '#f8f9fa'
    ctx.fillRect(0, rowTop, canvasW, rowH)

    ctx.fillStyle = '#333'
    ctx.font = FONT
    ctx.textBaseline = 'top'

    if (hasCols) {
      let x = 0
      cols.forEach((col, j) => {
        const w = widths[j] ?? 0
        const raw = getCellValue(item, col.field)
        const lines = wrapText(ctx, raw, w - CELL_PADDING_X * 2)
        const textBlockH = lines.length * LINE_HEIGHT
        const textTop = rowTop + (rowH - textBlockH) / 2
        lines.forEach((line, li) => {
          ctx.fillText(line, x + CELL_PADDING_X, textTop + li * LINE_HEIGHT)
        })
        x += w
      })
    } else {
      const text = getItemText(item)
      const lines = wrapText(ctx, text, canvasW - CELL_PADDING_X * 2)
      const textBlockH = lines.length * LINE_HEIGHT
      const textTop = rowTop + (rowH - textBlockH) / 2
      lines.forEach((line, li) => {
        ctx.fillText(line, CELL_PADDING_X, textTop + li * LINE_HEIGHT)
      })
    }

    ctx.strokeStyle = '#eee'
    ctx.beginPath()
    ctx.moveTo(0, rowTop + rowH)
    ctx.lineTo(canvasW, rowTop + rowH)
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
