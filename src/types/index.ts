import type { VNode } from 'vue'

export interface Column {
  field: string
  title: string
  width: number
  /** 'text' 由 Canvas 绘制（默认），'html' 由 HTML 覆盖层渲染 */
  type?: 'text' | 'html'
  /** type 为 'html' 时的渲染函数，返回 VNode */
  render?: (params: CellRenderParams) => VNode
  /** 文本对齐方式 */
  align?: 'left' | 'center' | 'right'
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
}

export interface VirtualListEmits {
  (e: 'scroll', offset: number): void
  (e: 'row-click', item: unknown, index: number): void
  (e: 'cell-click', item: unknown, index: number, column: Column): void
}
