import type { VNode, Component } from 'vue'

export interface Column {
  field: string
  title: string
  width: number
  /** 'text' 由 Canvas 绘制（默认），'html' 由 HTML 覆盖层渲染 */
  type?: 'text' | 'html'
  render?: (params: CellRenderParams) => VNode | string
  component?: Component
  componentProps?:
    | Record<string, unknown>
    | ((params: CellRenderParams) => Record<string, unknown>)
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  sortable?: boolean
  /** 是否可拖拽调宽 */
  resizable?: boolean
  /** 最小列宽 */
  minWidth?: number
  /** 最大列宽 */
  maxWidth?: number
  /** 表头渲染模式，'html' 时使用 headerRender 或 headerComponent */
  headerType?: 'text' | 'html'
  /** 自定义表头渲染函数 */
  headerRender?: (params: HeaderRenderParams) => VNode | string
  /** 自定义表头组件 */
  headerComponent?: Component
  /** 传给 headerComponent 的额外 props */
  headerComponentProps?: Record<string, unknown>
}

export interface Theme {
  headerBg?: string
  headerText?: string
  headerBorder?: string
  rowBg?: string
  rowAltBg?: string
  rowHoverBg?: string
  rowActiveBg?: string
  cellText?: string
  cellTextSecondary?: string
  border?: string
  accentColor?: string
  fontFamily?: string
  fontSize?: number
  headerFontSize?: number
}

export interface CellRenderParams {
  item: unknown
  index: number
  column: Column
  value: unknown
}

export interface HeaderRenderParams {
  column: Column
  columnIndex: number
}

export type SortOrder = 'asc' | 'desc' | null

export interface SortState {
  field: string
  order: SortOrder
}

export type SelectionMode = 'none' | 'single' | 'multiple'

export interface ContextMenuParams {
  item: unknown
  index: number
  column: Column | null
  columnIndex: number
  x: number
  y: number
}

export interface VirtualListProps {
  columns: Column[]
  items: unknown[]
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

export interface VirtualListEmits {
  (e: 'scroll', offset: number): void
  (e: 'row-click', item: unknown, index: number): void
  (e: 'cell-click', item: unknown, index: number, column: Column): void
  (e: 'load-more'): void
  (e: 'sort-change', sortState: SortState): void
  (e: 'selection-change', selectedKeys: Array<string | number>): void
  (e: 'column-resize', columnIndex: number, width: number): void
  (e: 'context-menu', params: ContextMenuParams): void
  (e: 'expand-change', expandedKeys: Array<string | number>): void
}
