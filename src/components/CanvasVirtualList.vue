<template>
  <div
    ref="containerRef"
    class="canvas-virtual-list"
    :style="{ height: `${height}px` }"
    @scroll="onScroll"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @click="onClick"
  >
    <div
      class="canvas-virtual-list__spacer"
      :style="{ height: `${effectiveHeaderHeight + totalHeight}px` }"
    >
      <canvas
        v-show="hasColumns"
        ref="headerCanvasRef"
        class="canvas-virtual-list__header"
        :width="canvasWidth * dpr"
        :height="effectiveHeaderHeight * dpr"
        :style="{
          width: `${canvasWidth}px`,
          height: `${effectiveHeaderHeight}px`
        }"
      />
      <canvas
        ref="canvasRef"
        class="canvas-virtual-list__canvas"
        :width="canvasWidth * dpr"
        :height="bodyHeight * dpr"
        :style="{
          top: `${effectiveHeaderHeight}px`,
          width: `${canvasWidth}px`,
          height: `${bodyHeight}px`
        }"
      />
      <div
        class="canvas-virtual-list__overlay"
        :style="{
          top: `${effectiveHeaderHeight}px`,
          height: `${bodyHeight}px`
        }"
      >
        <template
          v-for="overlay in htmlCells"
          :key="overlay.key"
        >
          <div
            class="canvas-virtual-list__cell"
            :style="overlay.style"
          >
            <component :is="overlay.vnode" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watchEffect,
  onMounted,
  onUnmounted,
  nextTick,
} from 'vue'
import { useVirtualList } from '../composables/useVirtualList'
import type { Column, CellRenderParams } from '../types'

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

const emit = defineEmits<{
  scroll: [offset: number]
  'row-click': [item: unknown, index: number]
  'cell-click': [
    item: unknown,
    index: number,
    column: Column,
  ]
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const headerCanvasRef = ref<HTMLCanvasElement | null>(null)
const containerWidth = ref(0)
const hoveredIndex = ref(-1)
const dpr = ref(window.devicePixelRatio || 1)

const hasColumns = computed(() => props.columns.length > 0)
const effectiveHeaderHeight = computed(() =>
  hasColumns.value ? props.headerHeight : 0
)
const bodyHeight = computed(() =>
  Math.max(0, props.height - effectiveHeaderHeight.value)
)

const totalColumnsWidth = computed(() =>
  props.columns.reduce((s, c) => s + c.width, 0)
)
const canvasWidth = computed(() =>
  Math.max(containerWidth.value, totalColumnsWidth.value)
)

const columnWidths = computed(() => {
  const cols = props.columns
  if (cols.length === 0) return []
  const totalDefined = totalColumnsWidth.value
  const w = canvasWidth.value || 1
  if (totalDefined <= 0) {
    return cols.map(() => w / cols.length)
  }
  if (totalDefined <= containerWidth.value) {
    const scale = w / totalDefined
    return cols.map((c) => c.width * scale)
  }
  return cols.map((c) => c.width)
})

const columnLefts = computed(() => {
  const widths = columnWidths.value
  const lefts: number[] = []
  let x = 0
  for (const w of widths) {
    lefts.push(x)
    x += w
  }
  return lefts
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

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (maxWidth <= 0) return ['']
  const lines: string[] = []
  let current = ''
  for (const ch of text) {
    const test = current + ch
    if (
      ctx.measureText(test).width > maxWidth &&
      current.length > 0
    ) {
      lines.push(current)
      current = ch
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines.length > 0 ? lines : ['']
}

function getCellValue(item: unknown, field: string): unknown {
  if (item == null) return ''
  if (typeof item === 'object' && field in item) {
    return (item as Record<string, unknown>)[field]
  }
  if (typeof item === 'string' || typeof item === 'number')
    return item
  return ''
}

function getItemText(item: unknown): string {
  if (item == null) return ''
  if (typeof item === 'string' || typeof item === 'number')
    return String(item)
  if (typeof item === 'object' && 'name' in item)
    return String((item as { name?: unknown }).name)
  if (typeof item === 'object' && 'label' in item)
    return String((item as { label?: unknown }).label)
  return String(item)
}

function measureRowHeight(
  item: unknown,
  cols: Column[],
  widths: number[]
): number {
  const ctx = getMeasureCtx()
  let maxLines = 1
  if (cols.length > 0) {
    cols.forEach((col, j) => {
      if (col.type === 'html') return
      const w = widths[j] ?? 0
      const text = String(getCellValue(item, col.field) ?? '')
      const lines = wrapText(ctx, text, w - CELL_PADDING_X * 2)
      if (lines.length > maxLines) maxLines = lines.length
    })
  } else {
    const text = getItemText(item)
    const lines = wrapText(
      ctx,
      text,
      (containerWidth.value || 300) - CELL_PADDING_X * 2
    )
    if (lines.length > maxLines) maxLines = lines.length
  }
  return Math.max(
    props.minItemHeight,
    maxLines * LINE_HEIGHT + CELL_PADDING_Y * 2
  )
}

const itemHeights = computed(() => {
  const cols = props.columns
  const widths = columnWidths.value
  containerWidth.value
  return props.items.map((item) =>
    measureRowHeight(item, cols, widths)
  )
})

const itemsRef = computed(() => props.items)
const {
  totalHeight,
  prefixSums,
  range,
  setScrollTop,
} = useVirtualList(itemsRef, {
  itemHeights,
  containerHeight: bodyHeight,
  bufferSize: props.bufferSize,
})

const htmlColumns = computed(() =>
  props.columns
    .map((col, i) => ({ col, colIndex: i }))
    .filter(({ col }) => col.type === 'html' && col.render)
)

const htmlCells = computed(() => {
  const { visibleItems, offsetY, startIndex } = range.value
  const sums = prefixSums.value
  const widths = columnWidths.value
  const lefts = columnLefts.value
  const cols = htmlColumns.value
  if (cols.length === 0) return []

  const cells: {
    key: string
    style: Record<string, string>
    vnode: ReturnType<NonNullable<Column['render']>>
  }[] = []

  visibleItems.forEach((item, i) => {
    const index = startIndex + i
    const rowTop = sums[index] - offsetY
    const rowH = sums[index + 1] - sums[index]

    cols.forEach(({ col, colIndex }) => {
      const value = getCellValue(item, col.field)
      const params: CellRenderParams = {
        item,
        index,
        column: col,
        value,
      }
      cells.push({
        key: `${index}-${colIndex}`,
        style: {
          position: 'absolute',
          top: `${rowTop}px`,
          left: `${lefts[colIndex]}px`,
          width: `${widths[colIndex]}px`,
          height: `${rowH}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            col.align === 'center'
              ? 'center'
              : col.align === 'right'
                ? 'flex-end'
                : 'flex-start',
          padding: `0 ${CELL_PADDING_X}px`,
          boxSizing: 'border-box',
        },
        vnode: col.render!(params),
      })
    })
  })

  return cells
})

function onScroll() {
  const el = containerRef.value
  if (!el) return
  const top = Math.max(
    0,
    el.scrollTop - effectiveHeaderHeight.value
  )
  setScrollTop(top)
  emit('scroll', top)
}

function hitTest(e: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return null
  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  if (mouseY < 0 || mouseY >= rect.height) return null

  const { offsetY, startIndex, endIndex } = range.value
  const sums = prefixSums.value
  const absY = mouseY + offsetY

  let rowIndex = -1
  for (let i = startIndex; i < endIndex; i++) {
    if (absY >= sums[i] && absY < sums[i + 1]) {
      rowIndex = i
      break
    }
  }
  if (rowIndex < 0) return null

  let colIndex = -1
  if (props.columns.length > 0) {
    const lefts = columnLefts.value
    const widths = columnWidths.value
    for (let j = 0; j < lefts.length; j++) {
      if (
        mouseX >= lefts[j] &&
        mouseX < lefts[j] + widths[j]
      ) {
        colIndex = j
        break
      }
    }
  }

  return { rowIndex, colIndex }
}

function onMouseMove(e: MouseEvent) {
  const hit = hitTest(e)
  hoveredIndex.value = hit ? hit.rowIndex : -1
}

function onMouseLeave() {
  hoveredIndex.value = -1
}

function onClick(e: MouseEvent) {
  const hit = hitTest(e)
  if (!hit) return
  const item = props.items[hit.rowIndex]
  emit('row-click', item, hit.rowIndex)
  if (hit.colIndex >= 0) {
    emit(
      'cell-click',
      item,
      hit.rowIndex,
      props.columns[hit.colIndex]
    )
  }
}

function renderHeader() {
  const canvas = headerCanvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas || props.columns.length === 0) return

  const ratio = dpr.value
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

  const cols = props.columns
  const widths = columnWidths.value
  const lefts = columnLefts.value
  const h = props.headerHeight
  const w = canvasWidth.value

  ctx.clearRect(0, 0, w, h)

  ctx.fillStyle = '#f5f5f5'
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  ctx.font = `600 ${FONT}`
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#333'

  cols.forEach((col, i) => {
    const colW = widths[i] ?? 0
    const x = lefts[i] ?? 0
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()

    const textMaxW = colW - CELL_PADDING_X * 2
    const align = col.align ?? 'left'
    let textX = x + CELL_PADDING_X
    if (align === 'center') {
      ctx.textAlign = 'center'
      textX = x + colW / 2
    } else if (align === 'right') {
      ctx.textAlign = 'right'
      textX = x + colW - CELL_PADDING_X
    } else {
      ctx.textAlign = 'left'
    }
    ctx.fillText(col.title, textX, h / 2, textMaxW)
  })

  ctx.textAlign = 'left'
  const lastX = (lefts.at(-1) ?? 0) + (widths.at(-1) ?? 0)
  ctx.beginPath()
  ctx.moveTo(lastX, 0)
  ctx.lineTo(lastX, h)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(0, h - 0.5)
  ctx.lineTo(w, h - 0.5)
  ctx.stroke()
}

function render() {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas) return

  const ratio = dpr.value
  const cw = canvasWidth.value
  const ch = bodyHeight.value
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

  const { visibleItems, offsetY, startIndex } = range.value
  const cols = props.columns
  const widths = columnWidths.value
  const lefts = columnLefts.value
  const hasCols = cols.length > 0
  const sums = prefixSums.value

  ctx.clearRect(0, 0, cw, ch)

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
    ctx.fillRect(0, rowTop, cw, rowH)

    ctx.fillStyle = '#333'
    ctx.font = FONT
    ctx.textBaseline = 'top'

    if (hasCols) {
      cols.forEach((col, j) => {
        if (col.type === 'html') return
        const w = widths[j] ?? 0
        const x = lefts[j] ?? 0
        const raw = String(getCellValue(item, col.field) ?? '')
        const textMaxW = w - CELL_PADDING_X * 2
        const lines = wrapText(ctx, raw, textMaxW)
        const textBlockH = lines.length * LINE_HEIGHT
        const textTop = rowTop + (rowH - textBlockH) / 2

        const align = col.align ?? 'left'
        if (align === 'center') {
          ctx.textAlign = 'center'
          lines.forEach((line, li) => {
            ctx.fillText(
              line,
              x + w / 2,
              textTop + li * LINE_HEIGHT,
              textMaxW
            )
          })
        } else if (align === 'right') {
          ctx.textAlign = 'right'
          lines.forEach((line, li) => {
            ctx.fillText(
              line,
              x + w - CELL_PADDING_X,
              textTop + li * LINE_HEIGHT,
              textMaxW
            )
          })
        } else {
          ctx.textAlign = 'left'
          lines.forEach((line, li) => {
            ctx.fillText(
              line,
              x + CELL_PADDING_X,
              textTop + li * LINE_HEIGHT,
              textMaxW
            )
          })
        }
        ctx.textAlign = 'left'
      })
    } else {
      const text = getItemText(item)
      const lines = wrapText(ctx, text, cw - CELL_PADDING_X * 2)
      const textBlockH = lines.length * LINE_HEIGHT
      const textTop = rowTop + (rowH - textBlockH) / 2
      lines.forEach((line, li) => {
        ctx.fillText(
          line,
          CELL_PADDING_X,
          textTop + li * LINE_HEIGHT
        )
      })
    }

    ctx.strokeStyle = '#eee'
    ctx.beginPath()
    ctx.moveTo(0, rowTop + rowH)
    ctx.lineTo(cw, rowTop + rowH)
    ctx.stroke()

    if (hasCols) {
      ctx.strokeStyle = '#eee'
      cols.forEach((_col, j) => {
        const x = lefts[j] ?? 0
        ctx.beginPath()
        ctx.moveTo(x, rowTop)
        ctx.lineTo(x, rowTop + rowH)
        ctx.stroke()
      })
      const lastX =
        (lefts.at(-1) ?? 0) + (widths.at(-1) ?? 0)
      ctx.beginPath()
      ctx.moveTo(lastX, rowTop)
      ctx.lineTo(lastX, rowTop + rowH)
      ctx.stroke()
    }
  })
}

let resizeObserver: ResizeObserver | null = null

function measureWidth() {
  const container = containerRef.value
  if (container) {
    const w = container.clientWidth
    if (w > 0) containerWidth.value = w
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
      if (entry) containerWidth.value = entry.contentRect.width
    })
    resizeObserver.observe(container)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

watchEffect(() => {
  range.value
  containerWidth.value
  canvasWidth.value
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
  width: fit-content;
  min-width: 100%;
}

.canvas-virtual-list__header {
  position: sticky;
  top: 0;
  left: 0;
  display: block;
  z-index: 2;
}

.canvas-virtual-list__canvas {
  position: sticky;
  left: 0;
  display: block;
}

.canvas-virtual-list__overlay {
  position: sticky;
  left: 0;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.canvas-virtual-list__cell {
  pointer-events: auto;
}
</style>
