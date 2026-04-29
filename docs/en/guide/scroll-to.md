<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const scrollToRef = ref()
const items = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `Record ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
  }))
)

const stColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'value', title: 'Value', width: 120, align: 'right' },
]

const jumpIndex = ref(5000)
function doScrollTo(align) {
  scrollToRef.value?.scrollToRow(jumpIndex.value - 1, align)
}
</script>

# scrollTo API

Use the `scrollToRow` method on the component instance to precisely navigate to a specific row, suitable for search positioning, anchor navigation, and similar scenarios.

## Basic Usage

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">10,000 rows</span>
    <label style="font-size: 13px; color: #606266">
      Jump to row
      <input v-model.number="jumpIndex" type="number" min="1" max="10000" style="width: 70px; padding: 2px 6px; border: 1px solid #dcdfe6; border-radius: 4px; font-size: 13px" />
    </label>
    <button class="demo-btn" @click="doScrollTo('start')">start</button>
    <button class="demo-btn" @click="doScrollTo('center')">center</button>
    <button class="demo-btn" @click="doScrollTo('end')">end</button>
  </div>
  <CanvasVirtualList ref="scrollToRef" :columns="stColumns" :items="items" :height="380" striped />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const tableRef = ref()

function jumpToRow(index: number) {
  tableRef.value.scrollToRow(index)
}
</script>

<template>
  <button @click="jumpToRow(999)">Jump to row 1000</button>
  <CanvasVirtualList
    ref="tableRef"
    :columns="columns"
    :items="items"
    :height="400"
  />
</template>
```

## Alignment

`scrollToRow` accepts a second parameter `align` to control the target row's position in the viewport:

```ts
// Target row appears at the top of the viewport (default)
tableRef.value.scrollToRow(100, 'start')

// Target row appears at the center of the viewport
tableRef.value.scrollToRow(100, 'center')

// Target row appears at the bottom of the viewport
tableRef.value.scrollToRow(100, 'end')
```

| Value | Description |
|-------|-------------|
| `'start'` | Align target row to the top of the viewport (default) |
| `'center'` | Align target row to the center of the viewport |
| `'end'` | Align target row to the bottom of the viewport |

## API Signature

```ts
scrollToRow(index: number, align?: 'start' | 'center' | 'end'): void
```

- `index` — Target row index (0-based), based on sorted data
- `align` — Alignment mode, defaults to `'start'`
- If `index` is out of range, the call has no effect

## Search Navigation Example

```vue
<script setup>
import { ref } from 'vue'

const tableRef = ref()
const keyword = ref('')

function search() {
  const index = items.value.findIndex(
    (item) => item.name.includes(keyword.value)
  )
  if (index >= 0) {
    tableRef.value.scrollToRow(index, 'center')
  }
}
</script>
```

## Combined with Row Selection

Navigate then select the target row:

```ts
function jumpAndSelect(index: number) {
  tableRef.value.scrollToRow(index, 'center')
  // If selectionMode is enabled, clicking selects the row
  // Or manually control selectedKeys
}
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
.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid #ebeef5;
  background: #f5f7fa;
}
.demo-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #909399;
  background: #f4f4f5;
}
.demo-btn {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  color: #606266;
  cursor: pointer;
  transition: all 0.15s;
}
.demo-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background: #ecf5ff;
}
</style>
