import { ref, computed, unref, watch } from 'vue'
import type { Ref } from 'vue'

export interface UseVirtualListOptions {
  estimatedHeight: number
  containerHeight: number | Ref<number>
  bufferSize?: number
}

export function useVirtualList<T>(
  items: Ref<T[]>,
  options: UseVirtualListOptions
) {
  const {
    estimatedHeight,
    containerHeight: containerHeightOption,
    bufferSize = 3,
  } = options
  const scrollTop = ref(0)

  let heightCache: number[] = []
  let sumsCache: number[] = [0]
  let sumsDirtyFrom = 0

  function ensureCache(len: number) {
    if (heightCache.length < len) {
      const old = heightCache.length
      heightCache.length = len
      heightCache.fill(estimatedHeight, old, len)
      sumsDirtyFrom = Math.min(sumsDirtyFrom, old)
    } else if (heightCache.length > len) {
      heightCache.length = len
      sumsDirtyFrom = Math.min(sumsDirtyFrom, len)
    }
  }

  function rebuildSums() {
    const len = heightCache.length
    if (sumsCache.length !== len + 1) {
      sumsCache = new Array(len + 1)
      sumsCache[0] = 0
      sumsDirtyFrom = 0
    }
    const start = Math.max(0, sumsDirtyFrom)
    for (let i = start; i < len; i++) {
      sumsCache[i + 1] = sumsCache[i] + heightCache[i]
    }
    sumsDirtyFrom = len
  }

  function setHeight(index: number, height: number) {
    if (index < 0 || index >= heightCache.length) return
    if (heightCache[index] === height) return
    heightCache[index] = height
    if (index < sumsDirtyFrom) sumsDirtyFrom = index
  }

  const version = ref(0)

  function invalidate() {
    version.value++
  }

  watch(
    () => items.value.length,
    (len) => {
      ensureCache(len)
      rebuildSums()
      invalidate()
    },
    { immediate: true }
  )

  const totalHeight = computed(() => {
    version.value
    rebuildSums()
    return sumsCache[heightCache.length] ?? 0
  })

  const prefixSums = computed(() => {
    version.value
    rebuildSums()
    return sumsCache
  })

  const range = computed(() => {
    version.value
    const containerHeight = unref(containerHeightOption)
    const scroll = scrollTop.value
    const total = items.value.length
    rebuildSums()
    const sums = sumsCache

    let startIndex = binarySearch(sums, scroll, total)
    startIndex = Math.max(0, startIndex - bufferSize)

    let endIndex = binarySearch(sums, scroll + containerHeight, total)
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
    scrollTop.value = Math.max(
      0,
      Math.min(value, totalHeight.value - containerHeight)
    )
  }

  return {
    scrollTop,
    totalHeight,
    prefixSums,
    range,
    setScrollTop,
    setHeight,
    invalidate,
    getHeight: (index: number) => heightCache[index] ?? estimatedHeight,
  }
}

function binarySearch(
  sums: number[],
  target: number,
  maxIndex: number
): number {
  let lo = 0
  let hi = maxIndex - 1
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
