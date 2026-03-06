import { ref, computed, unref } from 'vue'
import type { Ref } from 'vue'

export interface UseVirtualListOptions {
  itemHeight: number
  containerHeight: number | Ref<number>
  bufferSize?: number
}

/**
 * 虚拟列表核心逻辑 Composable
 * 计算可视区域内的项目范围
 */
export function useVirtualList<T>(
  items: Ref<T[]>,
  options: UseVirtualListOptions
) {
  const { itemHeight, containerHeight: containerHeightOption, bufferSize = 3 } = options
  const scrollTop = ref(0)

  const totalHeight = computed(() => items.value.length * itemHeight)

  const range = computed(() => {
    const containerHeight = unref(containerHeightOption)
    const scroll = scrollTop.value
    const total = items.value.length
    const count = Math.ceil(containerHeight / itemHeight)
    const start = Math.max(0, Math.floor(scroll / itemHeight) - bufferSize)
    const end = Math.min(total, start + count + bufferSize * 2)
    return {
      startIndex: start,
      endIndex: end,
      visibleItems: items.value.slice(start, end),
      offsetY: start * itemHeight,
    }
  })

  const setScrollTop = (value: number) => {
    const containerHeight = unref(containerHeightOption)
    scrollTop.value = Math.max(0, Math.min(value, totalHeight.value - containerHeight))
  }

  return {
    scrollTop,
    totalHeight,
    range,
    setScrollTop,
  }
}
