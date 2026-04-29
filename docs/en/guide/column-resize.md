<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    dept: ['R&D', 'Product', 'Design', 'Operations', 'Marketing'][i % 5],
  }))
)

const resColumns = ref([
  { field: 'id', title: 'ID', width: 80, align: 'center', resizable: true, minWidth: 50, maxWidth: 150 },
  { field: 'name', title: 'Name', width: 150, resizable: true, minWidth: 80 },
  { field: 'email', title: 'Email', width: 250, resizable: true, minWidth: 120 },
  { field: 'dept', title: 'Department', width: 120, resizable: true, minWidth: 80 },
])

const resizeLog = ref('')
function onColumnResize(colIndex, width) {
  resizeLog.value = `Column ${colIndex} → ${Math.round(width)}px`
}
</script>

# Column Resize

When hovering over the header column edge, the cursor changes to `col-resize`. Hold and drag to adjust column width.

## Basic Usage

Set `resizable: true` on the `Column` to enable drag resizing:

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">Drag header edge to resize</span>
    <span v-if="resizeLog" class="demo-tag demo-tag--blue">{{ resizeLog }}</span>
  </div>
  <CanvasVirtualList :columns="resColumns" :items="items" :height="380" striped @column-resize="onColumnResize" />
</div>

```ts
const columns: Column[] = [
  { field: 'id', title: 'ID', width: 80, resizable: true },
  { field: 'name', title: 'Name', width: 150, resizable: true },
  { field: 'email', title: 'Email', width: 250, resizable: true },
]
```

## Min/Max Width

Limit the drag range with `minWidth` and `maxWidth`:

```ts
{
  field: 'name',
  title: 'Name',
  width: 150,
  resizable: true,
  minWidth: 80,   // Minimum 80px
  maxWidth: 400,  // Maximum 400px
}
```

## Listening to Events

The `column-resize` event fires when dragging ends:

```vue
<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    @column-resize="onColumnResize"
  />
</template>

<script setup>
function onColumnResize(columnIndex: number, width: number) {
  console.log(`Column ${columnIndex} width: ${width}px`)
}
</script>
```

## Combined with Auto Column Width

When the total width of all columns is less than the container width, column widths automatically stretch proportionally to fill the container. After drag resizing, the column uses the new width for proportional calculations.

## Column Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `resizable` | `boolean` | `undefined` | Whether drag resizing is enabled |
| `minWidth` | `number` | `30` | Minimum column width when dragging (px) |
| `maxWidth` | `number` | — | Maximum column width when dragging (px) |

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
.demo-tag--blue {
  color: #409eff;
  background: #ecf5ff;
}
</style>
