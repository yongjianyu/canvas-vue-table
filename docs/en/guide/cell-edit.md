<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: 20 + (i % 40),
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: 'Name', width: 200, editable: true },
  { field: 'email', title: 'Email', width: 260, editable: true },
  { field: 'age', title: 'Age', width: 100, align: 'center', editable: true },
]

function onCellEdit(params) {
  const item = items.value.find((_, i) => i === params.index)
  if (item) {
    item[params.field] = params.newValue
  }
}
</script>

# Cell Editing

Set `editable: true` on a column to allow users to **double-click a cell** to enter edit mode. The editor is a native `<input>` element overlaid on top of the Canvas. When editing is complete, a `cell-edit` event is emitted.

## Basic Usage

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">Double-click editable cells to edit</span>
  </div>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="380"
    striped
    @cell-edit="onCellEdit"
  />
</div>

```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'
import type { CellEditParams } from 'canvas-vue-table'

const items = ref([
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 28 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 32 },
])

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200, editable: true },
  { field: 'email', title: 'Email', width: 260, editable: true },
  { field: 'age', title: 'Age', width: 100, editable: true },
]

function onCellEdit(params: CellEditParams) {
  const item = items.value[params.index]
  if (item) {
    item[params.field] = params.newValue
  }
}
</script>

<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    @cell-edit="onCellEdit"
  />
</template>
```

## Column Configuration

Add `editable: true` to a column definition to enable double-click editing:

```ts
const columns = [
  { field: 'id', title: 'ID', width: 80 },              // not editable
  { field: 'name', title: 'Name', width: 200, editable: true }, // editable
]
```

## CellEditParams

The parameter object returned by the `cell-edit` event:

```ts
interface CellEditParams {
  item: unknown    // row data object
  index: number    // row index
  column: Column   // column configuration
  field: string    // field name
  oldValue: unknown // value before editing
  newValue: string  // value after editing (always a string)
}
```

## Keyboard Shortcuts

| Key | Behavior |
|-----|----------|
| `Enter` | Confirm edit and close input |
| `Escape` | Cancel edit, restore original value |
| Click outside | Confirm edit and close input |

## Notes

- Only columns with `editable: true` support double-click editing
- `newValue` in the `cell-edit` event is always a string; convert to other types in your handler if needed
- The editor is a native `<input>` overlaid on the Canvas, compatible with fixed columns
- You can call `cancelEdit()` on the component instance to programmatically cancel editing

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
</style>
