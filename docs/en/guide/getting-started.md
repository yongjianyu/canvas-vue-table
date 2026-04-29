<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(
  Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'value', title: 'Value', width: 120, align: 'right' },
]
</script>

# Getting Started

## Installation

```bash
npm install canvas-vue-table vue
# or
pnpm add canvas-vue-table vue
```

## Usage

<div class="demo-block">
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="300"
    striped
  />
</div>

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

<style scoped>
.demo-block {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
</style>
