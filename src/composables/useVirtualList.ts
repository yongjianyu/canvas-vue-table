import { ref, computed, unref } from 'vue'
import type { Ref } from 'vue'

export interface UseVirtualListOptions {
  itemHeights: Ref<number[]>
  containerHeight: number | Ref<number>
  bufferSize?: number
}

export function useVirtualList<T>(
  items: Ref<T[]>,
  options: UseVirtualListOptions
) {
  const { itemHeights, containerHeight: containerHeightOption, bufferSize = 3 } = options
  const scrollTop = ref(0)

  const prefixSums = computed(() => {
    const heights = itemHeights.value
    const sums = new Array(heights.length + 1)
    sums[0] = 0
    for (let i = 0; i < heights.length; i++) {
      sums[i + 1] = sums[i] + heights[i]
    }
    return sums
  })

  const totalHeight = computed(() => {
    const sums = prefixSums.value
    return sums[sums.length - 1] ?? 0
  })

  const range = computed(() => {
    const containerHeight = unref(containerHeightOption)
    const scroll = scrollTop.value
    const total = items.value.length
    const sums = prefixSums.value

    let startIndex = binarySearch(sums, scroll)
    startIndex = Math.max(0, startIndex - bufferSize)

    let endIndex = binarySearch(sums, scroll + containerHeight)
    endIndex = Math.min(total, endIndex + bufferSize)

    return {
      startIndex,
      endIndex,
      visibleItems: items.value.slice(startIndex, endIndex),
      offsetY: sums[startIndex] ?? 0,
    }
  })

  const setScrollTop = (value: number) => {
    const containerHeight = unref(containerHeightOption)
    scrollTop.value = Math.max(0, Math.min(value, totalHeight.value - containerHeight))
  }

  return {
    scrollTop,
    totalHeight,
    prefixSums,
    range,
    setScrollTop,
  }
}

function binarySearch(sums: number[], target: number): number {
  let lo = 0
  let hi = sums.length - 2
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (sums[mid + 1] <= target) {
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return lo
}
