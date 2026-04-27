<template>
  <div
    ref="containerRef"
    class="cvt"
    :class="{
      'cvt--bordered': bordered,
      'cvt--empty': items.length === 0,
    }"
    :style="{ height: `${height}px` }"
    @scroll="onScroll"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @click="onClick"
  >
    <div
      class="cvt__spacer"
      :style="{ height: `${effectiveHeaderHeight + totalHeight}px` }"
    >
      <canvas
        v-show="hasColumns"
        ref="headerCanvasRef"
        class="cvt__header"
        :width="canvasWidth * dpr"
        :height="effectiveHeaderHeight * dpr"
        :style="{
          width: `${canvasWidth}px`,
          height: `${effectiveHeaderHeight}px`
        }"
      />
      <div
        class="cvt__body"
        :style="{
          top: `${effectiveHeaderHeight}px`,
          height: `${bodyHeight}px`,
        }"
      >
        <canvas
          ref="canvasRef"
          class="cvt__canvas"
          :width="canvasWidth * dpr"
          :height="bodyHeight * dpr"
          :style="{
            width: `${canvasWidth}px`,
            height: `${bodyHeight}px`
          }"
        />
        <div
          class="cvt__overlay"
          :style="{ height: `${bodyHeight}px` }"
        >
          <template
            v-for="overlay in htmlCells"
            :key="overlay.key"
          >
            <div
              class="cvt__cell"
              :style="overlay.style"
            >
              <component :is="overlay.vnode" />
            </div>
          </template>
        </div>
      </div>
    </div>
    <div
      v-if="loading"
      class="cvt__loading"
    >
      <svg
        class="cvt__loading-spinner"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248L783.552 195.2a32 32 0 0 1 45.248 0zM376.32 647.744a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
          fill="currentColor"
        />
      </svg>
      <span class="cvt__loading-text">{{ loadingText }}</span>
    </div>
    <div
      v-if="items.length === 0 && !loading"
      class="cvt__empty"
      :style="{ top: `${effectiveHeaderHeight}px` }"
    >
      <svg
        class="cvt__empty-icon"
        viewBox="0 0 79 86"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" fill-rule="evenodd">
          <path
            d="M17.988 60.157L2.556 37.89a2.5 2.5 0 0 1-.393-1.353V15.626C2.163 14.178 3.34 13 4.79 13h69.42c1.449 0 2.627 1.178 2.627 2.626v20.913c0 .476-.136.942-.393 1.343L60.988 60.157"
            stroke="#DCDFE6"
            stroke-width="2"
          />
          <path
            d="M61 60h16.5v16c0 1.933-1.567 3.5-3.5 3.5H5c-1.933 0-3.5-1.567-3.5-3.5V60H17c1.657 0 3 1.343 3 3v1c0 2.761 2.239 5 5 5h23c2.761 0 5-2.239 5-5v-1c0-1.657 1.343-3 3-3z"
            fill="#EBEEF5"
            stroke="#DCDFE6"
            stroke-width="2"
          />
        </g>
      </svg>
      <span class="cvt__empty-text">暂无数据</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  h,
  onMounted,
  onUnmounted,
  nextTick,
} from 'vue'
import type { VNode } from 'vue'
import { useVirtualList } from '../composables/useVirtualList'
import type { Column, CellRenderParams, Theme } from '../types'

const DEFAULT_HEADER_HEIGHT = 40
const DEFAULT_LINE_HEIGHT = 23
const CELL_PADDING_X = 12
const CELL_PADDING_Y = 8
const LOAD_MORE_THRESHOLD = 200

const defaultTheme: Required<Theme> = {
  headerBg: '#ffffff',
  headerText: '#909399',
  headerBorder: '#ebeef5',
  rowBg: '#ffffff',
  rowAltBg: '#fafafa',
  rowHoverBg: '#f5f7fa',
  rowActiveBg: '#ecf5ff',
  cellText: '#606266',
  cellTextSecondary: '#909399',
  border: '#ebeef5',
  accentColor: '#409eff',
  fontFamily:
    "'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif",
  fontSize: 14,
  headerFontSize: 14,
}

interface Props {
  columns?: Column[]
  items?: unknown[]
  minItemHeight?: number
  height?: number
  headerHeight?: number
  bufferSize?: number
  loadMoreThreshold?: number
  theme?: Theme
  striped?: boolean
  bordered?: boolean
  loading?: boolean
  loadingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  items: () => [],
  minItemHeight: 40,
  height: 400,
  headerHeight: DEFAULT_HEADER_HEIGHT,
  bufferSize: 3,
  loadMoreThreshold: LOAD_MORE_THRESHOLD,
  theme: () => ({}),
  striped: false,
  bordered: false,
  loading: false,
  loadingText: '加载中...',
})

const emit = defineEmits<{
  scroll: [offset: number]
  'row-click': [item: unknown, index: number]
  'cell-click': [
    item: unknown,
    index: number,
    column: Column,
  ]
  'load-more': []
}>()

const t = computed<Required<Theme>>(() => ({
  ...defaultTheme,
  ...props.theme,
}))

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const headerCanvasRef = ref<HTMLCanvasElement | null>(null)
const containerWidth = ref(0)
const hoveredIndex = ref(-1)
const dpr = ref(
  typeof window !== 'undefined'
    ? window.devicePixelRatio || 1
    : 1
)

const bodyFont = computed(
  () => `${t.value.fontSize}px ${t.value.fontFamily}`
)
const headerFont = computed(
  () => `600 ${t.value.headerFontSize}px ${t.value.fontFamily}`
)

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
  measureCtx.font = bodyFont.value
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
    maxLines * DEFAULT_LINE_HEIGHT + CELL_PADDING_Y * 2
  )
}

const itemsRef = computed(() => props.items)
const {
  totalHeight,
  prefixSums,
  range,
  setScrollTop,
  setHeight,
  invalidate,
  getHeight,
} = useVirtualList(itemsRef, {
  estimatedHeight: props.minItemHeight,
  containerHeight: bodyHeight,
  bufferSize: props.bufferSize,
})

function measureVisibleRows() {
  const { startIndex, visibleItems } = range.value
  const cols = props.columns
  const widths = columnWidths.value
  let changed = false
  visibleItems.forEach((item, i) => {
    const index = startIndex + i
    const measured = measureRowHeight(item, cols, widths)
    if (getHeight(index) !== measured) {
      setHeight(index, measured)
      changed = true
    }
  })
  if (changed) invalidate()
}

const htmlColumns = computed(() =>
  props.columns
    .map((col, i) => ({ col, colIndex: i }))
    .filter(
      ({ col }) =>
        col.type === 'html' &&
        (col.render || col.component)
    )
)

function resolveCellContent(
  col: Column,
  params: CellRenderParams
): VNode {
  if (col.component) {
    const extra =
      typeof col.componentProps === 'function'
        ? col.componentProps(params)
        : col.componentProps ?? {}
    return h(col.component, { ...params, ...extra })
  }
  const result = col.render!(params)
  if (typeof result === 'string') {
    return h('span', { innerHTML: result })
  }
  return result
}

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
    vnode: VNode
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
        vnode: resolveCellContent(col, params),
      })
    })
  })

  return cells
})

let rafId = 0
function scheduleRender() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    measureVisibleRows()
    renderHeader()
    render()
  })
}

let loadMoreEmitted = false

function onScroll() {
  const el = containerRef.value
  if (!el) return
  const top = Math.max(
    0,
    el.scrollTop - effectiveHeaderHeight.value
  )
  setScrollTop(top)
  emit('scroll', top)

  const remaining =
    el.scrollHeight - el.scrollTop - el.clientHeight
  if (remaining < props.loadMoreThreshold) {
    if (!loadMoreEmitted) {
      loadMoreEmitted = true
      emit('load-more')
    }
  } else {
    loadMoreEmitted = false
  }

  scheduleRender()
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

let mouseMoveRafId = 0
function onMouseMove(e: MouseEvent) {
  if (mouseMoveRafId) return
  mouseMoveRafId = requestAnimationFrame(() => {
    mouseMoveRafId = 0
    const hit = hitTest(e)
    const next = hit ? hit.rowIndex : -1
    if (hoveredIndex.value !== next) {
      hoveredIndex.value = next
      scheduleRender()
    }
  })
}

function onMouseLeave() {
  if (hoveredIndex.value !== -1) {
    hoveredIndex.value = -1
    scheduleRender()
  }
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

  const theme = t.value
  const ratio = dpr.value
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

  const cols = props.columns
  const widths = columnWidths.value
  const lefts = columnLefts.value
  const hh = props.headerHeight
  const w = canvasWidth.value

  ctx.clearRect(0, 0, w, hh)

  ctx.fillStyle = theme.headerBg
  ctx.fillRect(0, 0, w, hh)

  ctx.font = headerFont.value
  ctx.textBaseline = 'middle'

  cols.forEach((col, i) => {
    const colW = widths[i] ?? 0
    const x = lefts[i] ?? 0
    const textMaxW = colW - CELL_PADDING_X * 2
    const align = col.align ?? 'left'

    ctx.fillStyle = theme.headerText
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
    ctx.fillText(col.title, textX, hh / 2, textMaxW)
  })

  ctx.textAlign = 'left'

  ctx.strokeStyle = theme.headerBorder
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, hh - 0.5)
  ctx.lineTo(w, hh - 0.5)
  ctx.stroke()

  if (props.bordered) {
    ctx.strokeStyle = theme.border
    cols.forEach((_col, i) => {
      if (i === 0) return
      const x = lefts[i] ?? 0
      ctx.beginPath()
      ctx.moveTo(x + 0.5, 0)
      ctx.lineTo(x + 0.5, hh)
      ctx.stroke()
    })
  }
}

function render() {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas) return

  const theme = t.value
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

  ctx.fillStyle = theme.rowBg
  ctx.fillRect(0, 0, cw, ch)

  visibleItems.forEach((item, i) => {
    const index = startIndex + i
    const rowTop = sums[index] - offsetY
    const rowH = sums[index + 1] - sums[index]

    const isHovered = index === hoveredIndex.value

    if (isHovered) {
      ctx.fillStyle = theme.rowHoverBg
      ctx.fillRect(0, rowTop, cw, rowH)
    } else if (props.striped && index % 2 === 1) {
      ctx.fillStyle = theme.rowAltBg
      ctx.fillRect(0, rowTop, cw, rowH)
    }

    ctx.fillStyle = theme.cellText
    ctx.font = bodyFont.value
    ctx.textBaseline = 'top'

    if (hasCols) {
      cols.forEach((col, j) => {
        if (col.type === 'html') return
        const w = widths[j] ?? 0
        const x = lefts[j] ?? 0
        const raw = String(
          getCellValue(item, col.field) ?? ''
        )
        const textMaxW = w - CELL_PADDING_X * 2
        const lines = wrapText(ctx, raw, textMaxW)
        const textBlockH =
          lines.length * DEFAULT_LINE_HEIGHT
        const textTop = rowTop + (rowH - textBlockH) / 2

        const align = col.align ?? 'left'
        if (align === 'center') {
          ctx.textAlign = 'center'
          lines.forEach((line, li) => {
            ctx.fillText(
              line,
              x + w / 2,
              textTop + li * DEFAULT_LINE_HEIGHT,
              textMaxW
            )
          })
        } else if (align === 'right') {
          ctx.textAlign = 'right'
          lines.forEach((line, li) => {
            ctx.fillText(
              line,
              x + w - CELL_PADDING_X,
              textTop + li * DEFAULT_LINE_HEIGHT,
              textMaxW
            )
          })
        } else {
          ctx.textAlign = 'left'
          lines.forEach((line, li) => {
            ctx.fillText(
              line,
              x + CELL_PADDING_X,
              textTop + li * DEFAULT_LINE_HEIGHT,
              textMaxW
            )
          })
        }
        ctx.textAlign = 'left'
      })
    } else {
      const text = getItemText(item)
      const lines = wrapText(
        ctx,
        text,
        cw - CELL_PADDING_X * 2
      )
      const textBlockH =
        lines.length * DEFAULT_LINE_HEIGHT
      const textTop = rowTop + (rowH - textBlockH) / 2
      lines.forEach((line, li) => {
        ctx.fillText(
          line,
          CELL_PADDING_X,
          textTop + li * DEFAULT_LINE_HEIGHT
        )
      })
    }

    ctx.strokeStyle = theme.border
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, rowTop + rowH - 0.5)
    ctx.lineTo(cw, rowTop + rowH - 0.5)
    ctx.stroke()

    if (hasCols && props.bordered) {
      cols.forEach((_col, j) => {
        if (j === 0) return
        const x = lefts[j] ?? 0
        ctx.beginPath()
        ctx.moveTo(x + 0.5, rowTop)
        ctx.lineTo(x + 0.5, rowTop + rowH)
        ctx.stroke()
      })
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
        measureVisibleRows()
        renderHeader()
        render()
      })
    })
    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        containerWidth.value = entry.contentRect.width
        scheduleRender()
      }
    })
    resizeObserver.observe(container)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  if (rafId) cancelAnimationFrame(rafId)
  if (mouseMoveRafId) cancelAnimationFrame(mouseMoveRafId)
})

watch(
  [
    range,
    containerWidth,
    canvasWidth,
    columnWidths,
    hoveredIndex,
    t,
  ],
  () => {
    scheduleRender()
  }
)
</script>

<style scoped>
.cvt {
  overflow: auto;
  position: relative;
  width: 100%;
  cursor: default;
  border: 1px solid #ebeef5;
  background: #fff;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif;
  font-size: 14px;
  color: #606266;
}

.cvt::before,
.cvt::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  z-index: 3;
}

.cvt::before {
  top: 0;
  border-top: 1px solid #ebeef5;
}

.cvt::after {
  bottom: 0;
  border-bottom: 1px solid #ebeef5;
}

.cvt::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.cvt::-webkit-scrollbar-track {
  background: transparent;
}

.cvt::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.cvt::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

.cvt::-webkit-scrollbar-corner {
  background: transparent;
}

.cvt--bordered {
  border-right: none;
}

.cvt__spacer {
  position: relative;
  width: fit-content;
  min-width: 100%;
}

.cvt__header {
  position: sticky;
  top: 0;
  left: 0;
  display: block;
  z-index: 2;
}

.cvt__body {
  position: sticky;
  left: 0;
}

.cvt__canvas {
  display: block;
}

.cvt__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.cvt__cell {
  pointer-events: auto;
}

.cvt__empty {
  position: sticky;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 10px;
}

.cvt__empty-icon {
  width: 80px;
  height: 86px;
}

.cvt__empty-text {
  font-size: 14px;
  color: #909399;
}

.cvt__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  border-top: 1px solid #ebeef5;
  color: #909399;
  background: #fff;
}

.cvt__loading-spinner {
  width: 16px;
  height: 16px;
  color: #409eff;
  animation: cvt-spin 1s linear infinite;
}

.cvt__loading-text {
  font-size: 14px;
}

@keyframes cvt-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
