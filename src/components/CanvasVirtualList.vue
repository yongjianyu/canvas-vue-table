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
    @contextmenu="onContextMenu"
  >
    <div
      class="cvt__spacer"
      :style="{
        height: `${effectiveHeaderHeight + totalHeight}px`,
        width: spacerWidth,
      }"
    >
      <canvas
        v-show="hasColumns"
        ref="headerCanvasRef"
        class="cvt__header"
        :width="containerWidth * dpr"
        :height="effectiveHeaderHeight * dpr"
        :style="{
          width: `${containerWidth}px`,
          height: `${effectiveHeaderHeight}px`,
        }"
        @click.stop="onHeaderClick"
        @mousemove="onHeaderMouseMove"
        @mousedown="onHeaderMouseDown"
      />
      <!-- Header HTML overlay -->
      <div
        v-if="headerHtmlCells.length"
        class="cvt__header-overlay"
        :style="{
          width: `${containerWidth}px`,
          height: `${effectiveHeaderHeight}px`,
          marginTop: `-${effectiveHeaderHeight}px`,
        }"
      >
        <template
          v-for="cell in headerHtmlCells"
          :key="cell.key"
        >
          <div class="cvt__header-cell" :style="cell.style">
            <component :is="cell.vnode" />
          </div>
        </template>
      </div>
      <div
        class="cvt__body"
        :style="{
          top: `${effectiveHeaderHeight}px`,
          height: `${bodyHeight}px`,
          width: `${containerWidth}px`,
        }"
      >
        <canvas
          ref="canvasRef"
          class="cvt__canvas"
          :width="containerWidth * dpr"
          :height="bodyHeight * dpr"
          :style="{
            width: `${containerWidth}px`,
            height: `${bodyHeight}px`,
          }"
        />
        <!-- Left-fixed HTML overlay -->
        <div
          v-if="htmlCellsLeft.length"
          class="cvt__overlay"
          :style="{ height: `${bodyHeight}px`, width: `${fixedLeftWidth}px` }"
        >
          <template
            v-for="overlay in htmlCellsLeft"
            :key="overlay.key"
          >
            <div class="cvt__cell" :style="overlay.style">
              <component :is="overlay.vnode" />
            </div>
          </template>
        </div>
        <!-- Scrollable HTML overlay -->
        <div
          v-if="htmlCellsScrollable.length"
          class="cvt__overlay cvt__overlay--scrollable"
          :style="{
            height: `${bodyHeight}px`,
            left: `${fixedLeftWidth}px`,
            width: `${containerWidth - fixedLeftWidth - fixedRightWidth}px`,
          }"
        >
          <template
            v-for="overlay in htmlCellsScrollable"
            :key="overlay.key"
          >
            <div class="cvt__cell" :style="overlay.style">
              <component :is="overlay.vnode" />
            </div>
          </template>
        </div>
        <!-- Right-fixed HTML overlay -->
        <div
          v-if="htmlCellsRight.length"
          class="cvt__overlay"
          :style="{
            height: `${bodyHeight}px`,
            left: `${containerWidth - fixedRightWidth}px`,
            width: `${fixedRightWidth}px`,
          }"
        >
          <template
            v-for="overlay in htmlCellsRight"
            :key="overlay.key"
          >
            <div class="cvt__cell" :style="overlay.style">
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
import type {
  Column,
  CellRenderParams,
  HeaderRenderParams,
  Theme,
  SortOrder,
  SortState,
  SelectionMode,
  ContextMenuParams,
} from '../types'

const DEFAULT_HEADER_HEIGHT = 40
const DEFAULT_LINE_HEIGHT = 23
const CELL_PADDING_X = 12
const CELL_PADDING_Y = 8
const LOAD_MORE_THRESHOLD = 200
const SORT_ARROW_WIDTH = 16
const SHADOW_WIDTH = 6

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
  rowKey?: string
  selectionMode?: SelectionMode
  selectedKeys?: Array<string | number>
  childrenField?: string
  defaultExpandAll?: boolean
  expandedKeys?: Array<string | number>
  indent?: number
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
  rowKey: 'id',
  selectionMode: 'none',
  selectedKeys: () => [],
  childrenField: '',
  defaultExpandAll: false,
  expandedKeys: undefined,
  indent: 20,
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
  'sort-change': [sortState: SortState]
  'selection-change': [selectedKeys: Array<string | number>]
  'column-resize': [columnIndex: number, width: number]
  'expand-change': [expandedKeys: Array<string | number>]
  'context-menu': [params: ContextMenuParams]
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
const scrollLeft = ref(0)
const dpr = ref(
  typeof window !== 'undefined'
    ? window.devicePixelRatio || 1
    : 1
)

// ========== Column Resize ==========

const RESIZE_HANDLE_WIDTH = 8

const internalColumnWidths = ref<Map<number, number>>(new Map())
const resizeState = ref<{
  colIndex: number
  startX: number
  startWidth: number
} | null>(null)

function getEffectiveColumnWidth(col: Column, index: number): number {
  const override = internalColumnWidths.value.get(index)
  if (override != null) return override
  return col.width
}

// ========== Sorting ==========

const sortState = ref<SortState>({ field: '', order: null })

function getCellValue(item: unknown, field: string): unknown {
  if (item == null) return ''
  if (typeof item === 'object' && field in item) {
    return (item as Record<string, unknown>)[field]
  }
  if (typeof item === 'string' || typeof item === 'number')
    return item
  return ''
}

const sortedItems = computed(() => {
  const { field, order } = sortState.value
  if (!field || !order) return props.items
  const arr = [...props.items]
  arr.sort((a, b) => {
    const va = getCellValue(a, field)
    const vb = getCellValue(b, field)
    if (va == null && vb == null) return 0
    if (va == null) return order === 'asc' ? -1 : 1
    if (vb == null) return order === 'asc' ? 1 : -1
    if (typeof va === 'number' && typeof vb === 'number') {
      return order === 'asc' ? va - vb : vb - va
    }
    const sa = String(va)
    const sb = String(vb)
    const cmp = sa.localeCompare(sb)
    return order === 'asc' ? cmp : -cmp
  })
  return arr
})

// ========== Tree Data ==========

const EXPAND_ARROW_SIZE = 10

const isTreeMode = computed(() => !!props.childrenField)

const internalExpandedKeys = ref<Set<string | number>>(new Set())
let treeInitialized = false

const expandedKeySet = computed(() => {
  if (props.expandedKeys) return new Set(props.expandedKeys)
  return internalExpandedKeys.value
})

function getChildren(item: unknown): unknown[] {
  if (!props.childrenField || item == null || typeof item !== 'object') return []
  const children = (item as Record<string, unknown>)[props.childrenField]
  return Array.isArray(children) ? children : []
}

function hasChildren(item: unknown): boolean {
  return getChildren(item).length > 0
}

interface FlatNode {
  item: unknown
  depth: number
  hasChildren: boolean
}

const flattenedData = computed<FlatNode[]>(() => {
  if (!isTreeMode.value) {
    return sortedItems.value.map((item) => ({
      item,
      depth: 0,
      hasChildren: false,
    }))
  }

  if (!treeInitialized && props.defaultExpandAll) {
    const allKeys: (string | number)[] = []
    const collectKeys = (items: unknown[]) => {
      for (const item of items) {
        if (hasChildren(item)) {
          allKeys.push(getRowKey(item, -1))
          collectKeys(getChildren(item))
        }
      }
    }
    collectKeys(sortedItems.value)
    internalExpandedKeys.value = new Set(allKeys)
    treeInitialized = true
  }

  const expSet = expandedKeySet.value
  const result: FlatNode[] = []

  const walk = (items: unknown[], depth: number) => {
    for (const item of items) {
      const hc = hasChildren(item)
      result.push({ item, depth, hasChildren: hc })
      if (hc && expSet.has(getRowKey(item, -1))) {
        walk(getChildren(item), depth + 1)
      }
    }
  }
  walk(sortedItems.value, 0)
  return result
})

const flatItems = computed(() => flattenedData.value.map((n) => n.item))

function toggleExpand(item: unknown) {
  const key = getRowKey(item, -1)
  const next = new Set(expandedKeySet.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  internalExpandedKeys.value = next
  emit('expand-change', Array.from(next))
  invalidate()
}

function getFlatNodeDepth(flatIndex: number): number {
  return flattenedData.value[flatIndex]?.depth ?? 0
}

function getFlatNodeHasChildren(flatIndex: number): boolean {
  return flattenedData.value[flatIndex]?.hasChildren ?? false
}

function isFlatNodeExpanded(flatIndex: number): boolean {
  const node = flattenedData.value[flatIndex]
  if (!node || !node.hasChildren) return false
  return expandedKeySet.value.has(getRowKey(node.item, -1))
}

// ========== Selection ==========

const internalSelectedKeys = ref<Set<string | number>>(new Set())

const selectedKeySet = computed(() => {
  if (props.selectedKeys && props.selectedKeys.length > 0) {
    return new Set(props.selectedKeys)
  }
  return internalSelectedKeys.value
})

function getRowKey(item: unknown, index: number): string | number {
  if (item != null && typeof item === 'object' && props.rowKey in item) {
    return (item as Record<string, unknown>)[props.rowKey] as string | number
  }
  return index
}

function toggleSelection(item: unknown, index: number) {
  if (props.selectionMode === 'none') return
  const key = getRowKey(item, index)
  const next = new Set(selectedKeySet.value)

  if (props.selectionMode === 'single') {
    if (next.has(key)) {
      next.clear()
    } else {
      next.clear()
      next.add(key)
    }
  } else {
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
  }

  internalSelectedKeys.value = next
  emit('selection-change', Array.from(next))
}

function selectAll() {
  if (props.selectionMode !== 'multiple') return
  const allKeys = flatItems.value.map((item, i) => getRowKey(item, i))
  const isAllSelected = allKeys.length > 0 && allKeys.every((k) => selectedKeySet.value.has(k))

  let next: Set<string | number>
  if (isAllSelected) {
    next = new Set()
  } else {
    next = new Set(allKeys)
  }
  internalSelectedKeys.value = next
  emit('selection-change', Array.from(next))
}

const isAllSelected = computed(() => {
  const items = flatItems.value
  if (items.length === 0) return false
  return items.every((item, i) => selectedKeySet.value.has(getRowKey(item, i)))
})

const isIndeterminate = computed(() => {
  const items = flatItems.value
  if (items.length === 0) return false
  const count = items.filter((item, i) => selectedKeySet.value.has(getRowKey(item, i))).length
  return count > 0 && count < items.length
})

// ========== Layout ==========

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
  props.columns.reduce((s, c, i) => s + getEffectiveColumnWidth(c, i), 0)
)

const spacerWidth = computed(() =>
  totalColumnsWidth.value > containerWidth.value
    ? `${totalColumnsWidth.value}px`
    : '100%'
)

const hasResizedColumns = computed(() => internalColumnWidths.value.size > 0)

const columnWidths = computed(() => {
  const cols = props.columns
  if (cols.length === 0) return []
  const totalDefined = totalColumnsWidth.value
  const w = containerWidth.value || 1
  if (totalDefined <= 0) {
    return cols.map(() => w / cols.length)
  }
  if (hasResizedColumns.value || totalDefined > w) {
    return cols.map((c, i) => getEffectiveColumnWidth(c, i))
  }
  const scale = w / totalDefined
  return cols.map((c, i) => getEffectiveColumnWidth(c, i) * scale)
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

// ========== Fixed Column Groups ==========

interface ColRef {
  col: Column
  index: number
}

const fixedLeftCols = computed<ColRef[]>(() =>
  props.columns
    .map((col, i) => ({ col, index: i }))
    .filter(({ col }) => col.fixed === 'left')
)

const fixedRightCols = computed<ColRef[]>(() =>
  props.columns
    .map((col, i) => ({ col, index: i }))
    .filter(({ col }) => col.fixed === 'right')
)

const scrollableCols = computed<ColRef[]>(() =>
  props.columns
    .map((col, i) => ({ col, index: i }))
    .filter(({ col }) => !col.fixed)
)

const fixedLeftWidth = computed(() =>
  fixedLeftCols.value.reduce(
    (s, { index }) => s + (columnWidths.value[index] ?? 0),
    0
  )
)

const fixedRightWidth = computed(() =>
  fixedRightCols.value.reduce(
    (s, { index }) => s + (columnWidths.value[index] ?? 0),
    0
  )
)

const hasFixedCols = computed(
  () => fixedLeftCols.value.length > 0 || fixedRightCols.value.length > 0
)

// ========== Text Helpers ==========

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

// ========== Virtual List ==========

const itemsRef = computed(() => flatItems.value)
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

watch(sortState, () => {
  invalidate()
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

// ========== HTML Overlay ==========

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

interface OverlayCell {
  key: string
  style: Record<string, string>
  vnode: VNode
}

function buildHtmlCells(
  group: 'left' | 'scrollable' | 'right'
): OverlayCell[] {
  const { visibleItems, offsetY, startIndex } = range.value
  const sums = prefixSums.value
  const widths = columnWidths.value
  const lefts = columnLefts.value
  const flw = fixedLeftWidth.value
  const sl = scrollLeft.value

  const cols = htmlColumns.value.filter(({ col }) => {
    if (group === 'left') return col.fixed === 'left'
    if (group === 'right') return col.fixed === 'right'
    return !col.fixed
  })
  if (cols.length === 0) return []

  const cells: OverlayCell[] = []

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

      let cellLeft: number
      if (group === 'left') {
        cellLeft = lefts[colIndex]
      } else if (group === 'right') {
        const rightGroupLefts = computeRightGroupLefts()
        cellLeft =
          rightGroupLefts.get(colIndex) ?? 0
      } else {
        cellLeft = lefts[colIndex] - sl - flw
      }

      cells.push({
        key: `${index}-${colIndex}`,
        style: {
          position: 'absolute',
          top: `${rowTop}px`,
          left: `${cellLeft}px`,
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
}

function computeRightGroupLefts(): Map<number, number> {
  const result = new Map<number, number>()
  const widths = columnWidths.value
  let x = 0
  for (const { index } of fixedRightCols.value) {
    result.set(index, x)
    x += widths[index] ?? 0
  }
  return result
}

const htmlCellsLeft = computed(() => buildHtmlCells('left'))
const htmlCellsScrollable = computed(() =>
  buildHtmlCells('scrollable')
)
const htmlCellsRight = computed(() => buildHtmlCells('right'))

// ========== Header HTML Overlay ==========

const htmlHeaderColumns = computed(() =>
  props.columns
    .map((col, i) => ({ col, colIndex: i }))
    .filter(
      ({ col }) =>
        col.headerType === 'html' &&
        (col.headerRender || col.headerComponent)
    )
)

function resolveHeaderContent(
  col: Column,
  params: HeaderRenderParams
): VNode {
  if (col.headerComponent) {
    const extra = col.headerComponentProps ?? {}
    return h(col.headerComponent, { ...params, ...extra })
  }
  const result = col.headerRender!(params)
  if (typeof result === 'string') {
    return h('span', { innerHTML: result })
  }
  return result
}

const headerHtmlCells = computed<OverlayCell[]>(() => {
  if (htmlHeaderColumns.value.length === 0) return []
  const widths = columnWidths.value
  const lefts = columnLefts.value
  const hh = props.headerHeight
  const sl = scrollLeft.value
  const frw = fixedRightWidth.value
  const cw = containerWidth.value

  const cells: OverlayCell[] = []

  for (const { col, colIndex } of htmlHeaderColumns.value) {
    const params: HeaderRenderParams = {
      column: col,
      columnIndex: colIndex,
    }

    let cellLeft: number
    if (col.fixed === 'left') {
      cellLeft = lefts[colIndex]
    } else if (col.fixed === 'right') {
      let rx = cw - frw
      for (const { index } of fixedRightCols.value) {
        if (index === colIndex) { cellLeft = rx; break }
        rx += widths[index]
      }
      cellLeft = cellLeft! ?? rx
    } else {
      cellLeft = lefts[colIndex] - sl
    }

    cells.push({
      key: `hdr-${colIndex}`,
      style: {
        position: 'absolute',
        top: '0',
        left: `${cellLeft}px`,
        width: `${widths[colIndex]}px`,
        height: `${hh}px`,
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
      vnode: resolveHeaderContent(col, params),
    })
  }

  return cells
})

// ========== Scroll & Events ==========

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
  scrollLeft.value = el.scrollLeft
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

// ========== Hit Testing ==========

function hitTestColumn(mouseX: number): number {
  const flw = fixedLeftWidth.value
  const frw = fixedRightWidth.value
  const cw = containerWidth.value
  const widths = columnWidths.value
  const lefts = columnLefts.value
  const sl = scrollLeft.value

  if (mouseX < flw) {
    for (const { index } of fixedLeftCols.value) {
      if (
        mouseX >= lefts[index] &&
        mouseX < lefts[index] + widths[index]
      ) {
        return index
      }
    }
    return -1
  }

  if (mouseX > cw - frw && frw > 0) {
    let rx = cw - frw
    for (const { index } of fixedRightCols.value) {
      if (mouseX >= rx && mouseX < rx + widths[index]) {
        return index
      }
      rx += widths[index]
    }
    return -1
  }

  const absX = mouseX + sl
  for (const { index } of scrollableCols.value) {
    if (
      absX >= lefts[index] &&
      absX < lefts[index] + widths[index]
    ) {
      return index
    }
  }
  return -1
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
    colIndex = hitTestColumn(mouseX)
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
  const item = flatItems.value[hit.rowIndex]

  if (isTreeMode.value && hit.colIndex === 0 && getFlatNodeHasChildren(hit.rowIndex)) {
    const depth = getFlatNodeDepth(hit.rowIndex)
    const canvas = canvasRef.value
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const col0 = props.columns[0]
      const col0X = col0.fixed === 'left'
        ? columnLefts.value[0]
        : columnLefts.value[0] - scrollLeft.value
      const indentStart = col0X + CELL_PADDING_X + depth * props.indent
      if (mouseX >= indentStart - 4 && mouseX <= indentStart + EXPAND_ARROW_SIZE + 4) {
        toggleExpand(item)
        return
      }
    }
  }

  if (props.selectionMode !== 'none') {
    toggleSelection(item, hit.rowIndex)
  }
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

function onContextMenu(e: MouseEvent) {
  const hit = hitTest(e)
  if (!hit) return
  e.preventDefault()
  const item = flatItems.value[hit.rowIndex]
  emit('context-menu', {
    item,
    index: hit.rowIndex,
    column: hit.colIndex >= 0 ? props.columns[hit.colIndex] : null,
    columnIndex: hit.colIndex,
    x: e.clientX,
    y: e.clientY,
  })
}

// ========== Sorting Events ==========

function onHeaderClick(e: MouseEvent) {
  const canvas = headerCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const colIndex = hitTestColumn(mouseX)
  if (colIndex < 0) return

  const col = props.columns[colIndex]
  if (!col.sortable) return

  const current = sortState.value
  let nextOrder: SortOrder
  if (current.field !== col.field) {
    nextOrder = 'asc'
  } else if (current.order === 'asc') {
    nextOrder = 'desc'
  } else {
    nextOrder = null
  }

  sortState.value = {
    field: nextOrder ? col.field : '',
    order: nextOrder,
  }
  emit('sort-change', sortState.value)
}

function hitTestResizeHandle(mouseX: number): number {
  const widths = columnWidths.value
  const lefts = columnLefts.value
  const sl = scrollLeft.value
  const flw = fixedLeftWidth.value
  const frw = fixedRightWidth.value
  const cw = containerWidth.value

  for (const { col, index } of fixedLeftCols.value) {
    if (!col.resizable) continue
    const right = lefts[index] + widths[index]
    if (Math.abs(mouseX - right) <= RESIZE_HANDLE_WIDTH) return index
  }

  if (fixedRightCols.value.length > 0) {
    let rx = cw - frw
    for (const { col, index } of fixedRightCols.value) {
      if (col.resizable) {
        const right = rx + widths[index]
        if (Math.abs(mouseX - right) <= RESIZE_HANDLE_WIDTH) return index
      }
      rx += widths[index]
    }
  }

  for (const { col, index } of scrollableCols.value) {
    if (!col.resizable) continue
    const right = lefts[index] + widths[index] - sl
    if (right >= flw - 1 && right <= cw - frw + 1) {
      if (Math.abs(mouseX - right) <= RESIZE_HANDLE_WIDTH) return index
    }
  }

  return -1
}

function onHeaderMouseMove(e: MouseEvent) {
  if (resizeState.value) return
  const canvas = headerCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left

  const resizeCol = hitTestResizeHandle(mouseX)
  if (resizeCol >= 0) {
    canvas.style.cursor = 'col-resize'
    return
  }

  const colIndex = hitTestColumn(mouseX)
  if (colIndex >= 0 && props.columns[colIndex]?.sortable) {
    canvas.style.cursor = 'pointer'
  } else {
    canvas.style.cursor = 'default'
  }
}

function onHeaderMouseDown(e: MouseEvent) {
  const canvas = headerCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left

  const resizeCol = hitTestResizeHandle(mouseX)
  if (resizeCol < 0) return

  e.preventDefault()
  e.stopPropagation()

  if (internalColumnWidths.value.size === 0) {
    const snapshot = new Map<number, number>()
    const widths = columnWidths.value
    for (let i = 0; i < props.columns.length; i++) {
      snapshot.set(i, widths[i])
    }
    internalColumnWidths.value = snapshot
  }

  resizeState.value = {
    colIndex: resizeCol,
    startX: e.clientX,
    startWidth: columnWidths.value[resizeCol],
  }

  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', onResizeEnd)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

function onResizeMove(e: MouseEvent) {
  const state = resizeState.value
  if (!state) return

  const col = props.columns[state.colIndex]
  const delta = e.clientX - state.startX
  let newWidth = Math.max(30, state.startWidth + delta)

  if (col.minWidth != null) newWidth = Math.max(col.minWidth, newWidth)
  if (col.maxWidth != null) newWidth = Math.min(col.maxWidth, newWidth)

  const next = new Map(internalColumnWidths.value)
  next.set(state.colIndex, newWidth)
  internalColumnWidths.value = next
}

function onResizeEnd() {
  const state = resizeState.value
  if (state) {
    const finalWidth = columnWidths.value[state.colIndex]
    emit('column-resize', state.colIndex, finalWidth)
  }
  resizeState.value = null
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

// ========== Canvas Rendering ==========

function drawSortArrow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  activeOrder: SortOrder,
  theme: Required<Theme>
) {
  const aw = 5
  const ah = 4
  const gap = 1

  ctx.save()
  ctx.fillStyle =
    activeOrder === 'asc' ? theme.accentColor : '#c0c4cc'
  ctx.beginPath()
  ctx.moveTo(cx, cy - gap - ah)
  ctx.lineTo(cx - aw, cy - gap)
  ctx.lineTo(cx + aw, cy - gap)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle =
    activeOrder === 'desc' ? theme.accentColor : '#c0c4cc'
  ctx.beginPath()
  ctx.moveTo(cx, cy + gap + ah)
  ctx.lineTo(cx - aw, cy + gap)
  ctx.lineTo(cx + aw, cy + gap)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawFixedShadows(
  ctx: CanvasRenderingContext2D,
  h: number
) {
  const sl = scrollLeft.value
  const flw = fixedLeftWidth.value
  const frw = fixedRightWidth.value
  const cw = containerWidth.value
  const totalW = totalColumnsWidth.value

  if (sl > 0 && flw > 0) {
    const grad = ctx.createLinearGradient(
      flw,
      0,
      flw + SHADOW_WIDTH,
      0
    )
    grad.addColorStop(0, 'rgba(0,0,0,0.12)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(flw, 0, SHADOW_WIDTH, h)
  }

  if (frw > 0 && sl + cw < totalW) {
    const shadowX = cw - frw
    const grad = ctx.createLinearGradient(
      shadowX,
      0,
      shadowX - SHADOW_WIDTH,
      0
    )
    grad.addColorStop(0, 'rgba(0,0,0,0.12)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(shadowX - SHADOW_WIDTH, 0, SHADOW_WIDTH, h)
  }
}

function drawHeaderCol(
  ctx: CanvasRenderingContext2D,
  col: Column,
  colIndex: number,
  x: number,
  w: number,
  hh: number,
  theme: Required<Theme>
) {
  ctx.fillStyle = theme.headerBg
  ctx.fillRect(x, 0, w, hh)

  if (col.headerType !== 'html') {
    const textMaxW =
      w - CELL_PADDING_X * 2 - (col.sortable ? SORT_ARROW_WIDTH : 0)
    const align = col.align ?? 'left'

    ctx.fillStyle = theme.headerText
    ctx.font = headerFont.value
    ctx.textBaseline = 'middle'

    let textX = x + CELL_PADDING_X
    if (align === 'center') {
      ctx.textAlign = 'center'
      textX = x + w / 2 - (col.sortable ? SORT_ARROW_WIDTH / 2 : 0)
    } else if (align === 'right') {
      ctx.textAlign = 'right'
      textX = x + w - CELL_PADDING_X - (col.sortable ? SORT_ARROW_WIDTH : 0)
    } else {
      ctx.textAlign = 'left'
    }
    ctx.fillText(col.title, textX, hh / 2, textMaxW)

    if (col.sortable) {
      const isActive = sortState.value.field === col.field
      const activeOrder = isActive ? sortState.value.order : null
      const arrowX = x + w - CELL_PADDING_X - 5
      drawSortArrow(ctx, arrowX, hh / 2, activeOrder, theme)
    }

    ctx.textAlign = 'left'
  }

  if (col.resizable) {
    ctx.strokeStyle = '#c0c4cc'
    ctx.lineWidth = 1
    const rx = x + w - 0.5
    const cy = hh / 2
    ctx.beginPath()
    ctx.moveTo(rx, cy - 6)
    ctx.lineTo(rx, cy + 6)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(rx - 3, cy - 6)
    ctx.lineTo(rx - 3, cy + 6)
    ctx.stroke()
  }

  ctx.strokeStyle = theme.headerBorder
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x, hh - 0.5)
  ctx.lineTo(x + w, hh - 0.5)
  ctx.stroke()
}

function renderHeader() {
  const canvas = headerCanvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas || props.columns.length === 0) return

  const theme = t.value
  const ratio = dpr.value
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

  const widths = columnWidths.value
  const lefts = columnLefts.value
  const hh = props.headerHeight
  const cw = containerWidth.value
  const sl = scrollLeft.value
  const flw = fixedLeftWidth.value
  const frw = fixedRightWidth.value

  ctx.clearRect(0, 0, cw, hh)

  ctx.fillStyle = theme.headerBg
  ctx.fillRect(0, 0, cw, hh)

  // 1. Scrollable columns (clipped)
  const scrollableArea = cw - flw - frw
  if (scrollableArea > 0 && scrollableCols.value.length > 0) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(flw, 0, scrollableArea, hh)
    ctx.clip()
    for (const { col, index } of scrollableCols.value) {
      const x = lefts[index] - sl
      const w = widths[index]
      drawHeaderCol(ctx, col, index, x, w, hh, theme)
    }
    ctx.restore()
  }

  // 2. Left-fixed columns
  for (const { col, index } of fixedLeftCols.value) {
    const x = lefts[index]
    const w = widths[index]
    drawHeaderCol(ctx, col, index, x, w, hh, theme)
  }

  // 3. Right-fixed columns
  if (fixedRightCols.value.length > 0) {
    let rx = cw - frw
    for (const { col, index } of fixedRightCols.value) {
      const w = widths[index]
      drawHeaderCol(ctx, col, index, rx, w, hh, theme)
      rx += w
    }
  }

  // 4. Bordered vertical lines
  if (props.bordered) {
    ctx.strokeStyle = theme.border
    ctx.lineWidth = 1
    // Left-fixed borders
    for (const { index } of fixedLeftCols.value) {
      if (index === 0) continue
      const x = lefts[index]
      ctx.beginPath()
      ctx.moveTo(x + 0.5, 0)
      ctx.lineTo(x + 0.5, hh)
      ctx.stroke()
    }
    // Scrollable borders (clipped)
    if (scrollableArea > 0) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(flw, 0, scrollableArea, hh)
      ctx.clip()
      for (const { index } of scrollableCols.value) {
        const x = lefts[index] - sl
        if (x <= flw) continue
        ctx.beginPath()
        ctx.moveTo(x + 0.5, 0)
        ctx.lineTo(x + 0.5, hh)
        ctx.stroke()
      }
      ctx.restore()
    }
    // Right-fixed borders
    if (fixedRightCols.value.length > 0) {
      let rx = cw - frw
      for (let i = 0; i < fixedRightCols.value.length; i++) {
        if (i > 0) {
          ctx.beginPath()
          ctx.moveTo(rx + 0.5, 0)
          ctx.lineTo(rx + 0.5, hh)
          ctx.stroke()
        }
        rx += widths[fixedRightCols.value[i].index]
      }
    }
    // Fixed boundary lines
    if (flw > 0) {
      ctx.beginPath()
      ctx.moveTo(flw + 0.5, 0)
      ctx.lineTo(flw + 0.5, hh)
      ctx.stroke()
    }
    if (frw > 0) {
      const rx = cw - frw
      ctx.beginPath()
      ctx.moveTo(rx + 0.5, 0)
      ctx.lineTo(rx + 0.5, hh)
      ctx.stroke()
    }
  }

  // 5. Shadows
  if (hasFixedCols.value) {
    drawFixedShadows(ctx, hh)
  }

  // 6. Resize handle highlight
  if (resizeState.value) {
    const ri = resizeState.value.colIndex
    let rx = -1
    if (props.columns[ri]?.fixed === 'left') {
      rx = lefts[ri] + widths[ri]
    } else if (props.columns[ri]?.fixed === 'right') {
      let x = cw - frw
      for (const { index } of fixedRightCols.value) {
        if (index === ri) { rx = x + widths[index]; break }
        x += widths[index]
      }
    } else {
      rx = lefts[ri] + widths[ri] - sl
    }
    if (rx >= 0) {
      ctx.strokeStyle = theme.accentColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(rx, 0)
      ctx.lineTo(rx, hh)
      ctx.stroke()
    }
  }
}

function drawExpandArrow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  expanded: boolean,
  theme: Required<Theme>
) {
  ctx.save()
  ctx.fillStyle = theme.cellText
  ctx.beginPath()
  if (expanded) {
    ctx.moveTo(cx - 4, cy - 2)
    ctx.lineTo(cx + 4, cy - 2)
    ctx.lineTo(cx, cy + 3)
  } else {
    ctx.moveTo(cx - 2, cy - 4)
    ctx.lineTo(cx + 3, cy)
    ctx.lineTo(cx - 2, cy + 4)
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawCellText(
  ctx: CanvasRenderingContext2D,
  col: Column,
  item: unknown,
  x: number,
  w: number,
  rowTop: number,
  rowH: number,
  indentPx: number = 0
) {
  if (col.type === 'html') return
  const raw = String(getCellValue(item, col.field) ?? '')
  const effectivePadLeft = CELL_PADDING_X + indentPx
  const textMaxW = w - effectivePadLeft - CELL_PADDING_X
  if (textMaxW <= 0) return
  const lines = wrapText(ctx, raw, textMaxW)
  const textBlockH = lines.length * DEFAULT_LINE_HEIGHT
  const textTop = rowTop + (rowH - textBlockH) / 2
  const align = col.align ?? 'left'

  if (align === 'center') {
    ctx.textAlign = 'center'
    lines.forEach((line, li) => {
      ctx.fillText(
        line,
        x + effectivePadLeft + textMaxW / 2,
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
        x + effectivePadLeft,
        textTop + li * DEFAULT_LINE_HEIGHT,
        textMaxW
      )
    })
  }
  ctx.textAlign = 'left'
}

function drawCellWithTree(
  ctx: CanvasRenderingContext2D,
  col: Column,
  colIdx: number,
  item: unknown,
  flatIndex: number,
  x: number,
  w: number,
  rowTop: number,
  rowH: number,
  theme: Required<Theme>
) {
  if (!isTreeMode.value || colIdx !== 0) {
    drawCellText(ctx, col, item, x, w, rowTop, rowH)
    return
  }
  const depth = getFlatNodeDepth(flatIndex)
  const hc = getFlatNodeHasChildren(flatIndex)
  const indentPx = depth * props.indent + (hc ? EXPAND_ARROW_SIZE + 6 : EXPAND_ARROW_SIZE + 6)

  if (hc) {
    const expanded = isFlatNodeExpanded(flatIndex)
    const arrowX = x + CELL_PADDING_X + depth * props.indent + EXPAND_ARROW_SIZE / 2
    const arrowY = rowTop + rowH / 2
    drawExpandArrow(ctx, arrowX, arrowY, expanded, theme)
  }

  drawCellText(ctx, col, item, x, w, rowTop, rowH, indentPx)
}

function render() {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas) return

  const theme = t.value
  const ratio = dpr.value
  const cw = containerWidth.value
  const ch = bodyHeight.value
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

  const { visibleItems, offsetY, startIndex } = range.value
  const cols = props.columns
  const widths = columnWidths.value
  const lefts = columnLefts.value
  const hasCols = cols.length > 0
  const sums = prefixSums.value
  const sl = scrollLeft.value
  const flw = fixedLeftWidth.value
  const frw = fixedRightWidth.value
  const scrollableArea = cw - flw - frw

  ctx.clearRect(0, 0, cw, ch)

  ctx.fillStyle = theme.rowBg
  ctx.fillRect(0, 0, cw, ch)

  // 1. Row backgrounds (full width)
  const selEnabled = props.selectionMode !== 'none'
  const selSet = selectedKeySet.value

  visibleItems.forEach((item, i) => {
    const index = startIndex + i
    const rowTop = sums[index] - offsetY
    const rowH = sums[index + 1] - sums[index]
    const isHovered = index === hoveredIndex.value
    const isSelected = selEnabled && selSet.has(getRowKey(item, index))

    if (isSelected) {
      ctx.fillStyle = theme.rowActiveBg
      ctx.fillRect(0, rowTop, cw, rowH)
    } else if (isHovered) {
      ctx.fillStyle = theme.rowHoverBg
      ctx.fillRect(0, rowTop, cw, rowH)
    } else if (props.striped && index % 2 === 1) {
      ctx.fillStyle = theme.rowAltBg
      ctx.fillRect(0, rowTop, cw, rowH)
    }
  })

  ctx.fillStyle = theme.cellText
  ctx.font = bodyFont.value
  ctx.textBaseline = 'top'

  if (hasCols) {
    // 2. Scrollable cells (clipped)
    if (scrollableArea > 0 && scrollableCols.value.length > 0) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(flw, 0, scrollableArea, ch)
      ctx.clip()

      visibleItems.forEach((item, i) => {
        const index = startIndex + i
        const rowTop = sums[index] - offsetY
        const rowH = sums[index + 1] - sums[index]

        ctx.fillStyle = theme.cellText
        ctx.font = bodyFont.value
        ctx.textBaseline = 'top'

        for (const { col, index: colIdx } of scrollableCols.value) {
          const w = widths[colIdx]
          const x = lefts[colIdx] - sl
          drawCellWithTree(ctx, col, colIdx, item, index, x, w, rowTop, rowH, theme)
        }
      })
      ctx.restore()
    }

    // 3. Left-fixed cells (with background)
    if (fixedLeftCols.value.length > 0) {
      visibleItems.forEach((item, i) => {
        const index = startIndex + i
        const rowTop = sums[index] - offsetY
        const rowH = sums[index + 1] - sums[index]
        const isHovered = index === hoveredIndex.value
        const isSelected = selEnabled && selSet.has(getRowKey(item, index))

        if (isSelected) {
          ctx.fillStyle = theme.rowActiveBg
        } else if (isHovered) {
          ctx.fillStyle = theme.rowHoverBg
        } else if (props.striped && index % 2 === 1) {
          ctx.fillStyle = theme.rowAltBg
        } else {
          ctx.fillStyle = theme.rowBg
        }
        ctx.fillRect(0, rowTop, flw, rowH)

        ctx.fillStyle = theme.cellText
        ctx.font = bodyFont.value
        ctx.textBaseline = 'top'

        for (const { col, index: colIdx } of fixedLeftCols.value) {
          const w = widths[colIdx]
          const x = lefts[colIdx]
          drawCellWithTree(ctx, col, colIdx, item, index, x, w, rowTop, rowH, theme)
        }
      })
    }

    // 4. Right-fixed cells (with background)
    if (fixedRightCols.value.length > 0) {
      visibleItems.forEach((item, i) => {
        const index = startIndex + i
        const rowTop = sums[index] - offsetY
        const rowH = sums[index + 1] - sums[index]
        const isHovered = index === hoveredIndex.value
        const isSelected = selEnabled && selSet.has(getRowKey(item, index))

        if (isSelected) {
          ctx.fillStyle = theme.rowActiveBg
        } else if (isHovered) {
          ctx.fillStyle = theme.rowHoverBg
        } else if (props.striped && index % 2 === 1) {
          ctx.fillStyle = theme.rowAltBg
        } else {
          ctx.fillStyle = theme.rowBg
        }
        const rxStart = cw - frw
        ctx.fillRect(rxStart, rowTop, frw, rowH)

        ctx.fillStyle = theme.cellText
        ctx.font = bodyFont.value
        ctx.textBaseline = 'top'

        let rx = cw - frw
        for (const { col, index: colIdx } of fixedRightCols.value) {
          const w = widths[colIdx]
          drawCellWithTree(ctx, col, colIdx, item, index, rx, w, rowTop, rowH, theme)
          rx += w
        }
      })
    }
  } else {
    // No columns: simple text rendering
    visibleItems.forEach((item, i) => {
      const index = startIndex + i
      const rowTop = sums[index] - offsetY
      const rowH = sums[index + 1] - sums[index]

      ctx.fillStyle = theme.cellText
      ctx.font = bodyFont.value
      ctx.textBaseline = 'top'

      const text = getItemText(item)
      const lines = wrapText(
        ctx,
        text,
        cw - CELL_PADDING_X * 2
      )
      const textBlockH = lines.length * DEFAULT_LINE_HEIGHT
      const textTop = rowTop + (rowH - textBlockH) / 2
      lines.forEach((line, li) => {
        ctx.fillText(
          line,
          CELL_PADDING_X,
          textTop + li * DEFAULT_LINE_HEIGHT
        )
      })
    })
  }

  // 5. Row separator lines
  visibleItems.forEach((_, i) => {
    const index = startIndex + i
    const rowTop = sums[index] - offsetY
    const rowH = sums[index + 1] - sums[index]

    ctx.strokeStyle = theme.border
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, rowTop + rowH - 0.5)
    ctx.lineTo(cw, rowTop + rowH - 0.5)
    ctx.stroke()
  })

  // 6. Bordered vertical lines
  if (hasCols && props.bordered) {
    ctx.strokeStyle = theme.border
    ctx.lineWidth = 1

    // Left-fixed borders
    for (const { index: colIdx } of fixedLeftCols.value) {
      if (colIdx === 0) continue
      const x = lefts[colIdx]
      ctx.beginPath()
      ctx.moveTo(x + 0.5, 0)
      ctx.lineTo(x + 0.5, ch)
      ctx.stroke()
    }

    // Scrollable borders (clipped)
    if (scrollableArea > 0) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(flw, 0, scrollableArea, ch)
      ctx.clip()
      for (const { index: colIdx } of scrollableCols.value) {
        const x = lefts[colIdx] - sl
        if (x <= flw) continue
        ctx.beginPath()
        ctx.moveTo(x + 0.5, 0)
        ctx.lineTo(x + 0.5, ch)
        ctx.stroke()
      }
      ctx.restore()
    }

    // Right-fixed borders
    if (fixedRightCols.value.length > 0) {
      let rx = cw - frw
      for (let i = 0; i < fixedRightCols.value.length; i++) {
        if (i > 0) {
          ctx.beginPath()
          ctx.moveTo(rx + 0.5, 0)
          ctx.lineTo(rx + 0.5, ch)
          ctx.stroke()
        }
        rx += widths[fixedRightCols.value[i].index]
      }
    }

    // Fixed boundary lines
    if (flw > 0) {
      ctx.beginPath()
      ctx.moveTo(flw + 0.5, 0)
      ctx.lineTo(flw + 0.5, ch)
      ctx.stroke()
    }
    if (frw > 0) {
      ctx.beginPath()
      ctx.moveTo(cw - frw + 0.5, 0)
      ctx.lineTo(cw - frw + 0.5, ch)
      ctx.stroke()
    }
  }

  // 7. Shadows
  if (hasFixedCols.value) {
    drawFixedShadows(ctx, ch)
  }
}

// ========== Public API ==========

function scrollToRow(index: number, align: 'start' | 'center' | 'end' = 'start') {
  const el = containerRef.value
  if (!el) return
  const total = flatItems.value.length
  if (index < 0 || index >= total) return

  const sums = prefixSums.value
  const rowTop = sums[index] ?? 0
  const rowH = (sums[index + 1] ?? rowTop) - rowTop
  const hh = effectiveHeaderHeight.value
  const viewH = bodyHeight.value

  let targetScroll: number
  if (align === 'center') {
    targetScroll = rowTop - (viewH - rowH) / 2
  } else if (align === 'end') {
    targetScroll = rowTop - viewH + rowH
  } else {
    targetScroll = rowTop
  }

  el.scrollTop = Math.max(0, targetScroll + hh)
}

function getSelectedKeys(): Array<string | number> {
  return Array.from(selectedKeySet.value)
}

function clearSelection() {
  internalSelectedKeys.value = new Set()
  emit('selection-change', [])
}

defineExpose({
  scrollToRow,
  selectAll,
  clearSelection,
  getSelectedKeys,
  isAllSelected,
  isIndeterminate,
  toggleExpand,
})

// ========== Lifecycle ==========

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
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)
})

watch(
  [
    range,
    containerWidth,
    columnWidths,
    hoveredIndex,
    scrollLeft,
    selectedKeySet,
    t,
    internalColumnWidths,
    expandedKeySet,
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
  min-width: 100%;
}

.cvt__header {
  position: sticky;
  top: 0;
  left: 0;
  display: block;
  z-index: 2;
}

.cvt__header-overlay {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
}

.cvt__header-cell {
  pointer-events: auto;
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
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.cvt__overlay--scrollable {
  overflow: hidden;
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
