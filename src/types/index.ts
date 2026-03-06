/**
 * 虚拟列表类型定义
 */
export interface Column {
  field: string //字段路径，根据路径从数据源中获取数据
  title: string //列标题
  width: number //列宽度
}

export interface VirtualListProps {
  columns: Column[]
  /** 数据源 */
  items: unknown[]
  /** 每项高度 */
  itemHeight: number
  /** 容器高度 */
  height?: number
  /** 缓冲区大小（可视区域外预渲染的项目数） */
  bufferSize?: number,
  
}

export interface VirtualListEmits {
  (e: 'scroll', offset: number): void
}

export interface VirtualListState {
  /** 可视区域起始索引 */
  startIndex: number
  /** 可视区域结束索引 */
  endIndex: number
  /** 可视项目列表 */
  visibleItems: unknown[]
  /** 总高度 */
  totalHeight: number
  /** 偏移量 */
  offsetY: number
}
