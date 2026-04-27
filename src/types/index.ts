import type { VNode, Component } from 'vue'

export interface Column {
  field: string
  title: string
  width: number
  /** 'text' 由 Canvas 绘制（默认），'html' 由 HTML 覆盖层渲染 */
  type?: 'text' | 'html'
  /**
   * type 为 'html' 时的渲染函数
   * 支持三种返回值：
   * - VNode: h('button', { onClick }, '点击')
   * - string: '<span class="tag">标签</span>'
   * - VNode（使用组件）: h(MyComponent, { item })
   */
  render?: (params: CellRenderParams) => VNode | string
  /**
   * type 为 'html' 时直接传 Vue 组件（免写 render 和 h）
   * 组件会收到 CellRenderParams 作为 props
   */
  component?: Component
  /** 传给 component 的额外 props */
  componentProps?:
    | Record<string, unknown>
    | ((params: CellRenderParams) => Record<string, unknown>)
  /** 文本对齐方式 */
  align?: 'left' | 'center' | 'right'
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
}

export interface VirtualListEmits {
  (e: 'scroll', offset: number): void
  (e: 'row-click', item: unknown, index: number): void
  (e: 'cell-click', item: unknown, index: number, column: Column): void
  (e: 'load-more'): void
}
