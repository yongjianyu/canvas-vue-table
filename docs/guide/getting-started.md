# 快速开始

## 安装

```bash
npm install canvas-vue-table vue
# 或
pnpm add canvas-vue-table vue
```

## 使用

```vue
<script setup>
import { CanvasVirtualList } from 'canvas-vue-table'

const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }))
</script>

<template>
  <CanvasVirtualList
    :items="items"
    :item-height="40"
    :height="400"
  />
</template>
```
