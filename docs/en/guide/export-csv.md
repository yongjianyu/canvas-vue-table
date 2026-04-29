<script setup>
import { ref } from 'vue'
import { CanvasVirtualList, exportCsv } from 'canvas-vue-table'

const tableRef = ref(null)

const items = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    department: ['Engineering', 'Product', 'Design', 'Marketing'][i % 4],
    salary: (5000 + Math.floor(Math.random() * 15000)),
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: 'Name', width: 150 },
  { field: 'email', title: 'Email', width: 240 },
  { field: 'department', title: 'Department', width: 120, align: 'center' },
  { field: 'salary', title: 'Salary', width: 120, align: 'right' },
]

function handleExportInstance() {
  tableRef.value?.exportToCsv({ filename: 'employees.csv' })
}

function handleExportUtil() {
  exportCsv({
    columns,
    items: items.value,
    filename: 'employees_custom.csv',
  })
}
</script>

# Export CSV

The component provides two ways to export data as CSV:

1. **Component instance method** `exportToCsv()` — exports the current table's columns and data
2. **Standalone utility function** `exportCsv()` — accepts any columns and data

## Basic Usage

### Option 1: Component Instance Method

<div class="demo-block">
  <div class="demo-toolbar">
    <button class="demo-btn" @click="handleExportInstance">Export CSV (instance method)</button>
  </div>
  <CanvasVirtualList
    ref="tableRef"
    :columns="columns"
    :items="items"
    :height="300"
    striped
  />
</div>

```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const tableRef = ref()

function handleExport() {
  tableRef.value?.exportToCsv({ filename: 'employees.csv' })
}
</script>

<template>
  <button @click="handleExport">Export CSV</button>
  <CanvasVirtualList
    ref="tableRef"
    :columns="columns"
    :items="items"
  />
</template>
```

### Option 2: Standalone Utility Function

<div class="demo-block">
  <div class="demo-toolbar">
    <button class="demo-btn" @click="handleExportUtil">Export CSV (utility function)</button>
  </div>
</div>

```vue
<script setup>
import { exportCsv } from 'canvas-vue-table'

function handleExport() {
  exportCsv({
    columns: [
      { field: 'name', title: 'Name', width: 150 },
      { field: 'email', title: 'Email', width: 240 },
    ],
    items: myData,
    filename: 'result.csv',
  })
}
</script>
```

## API

### `exportToCsv(options?)` — Component Instance Method

Called via `ref`, automatically uses the component's current `columns` and `items`.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `filename` | `string` | `'export.csv'` | Download filename |
| `separator` | `string` | `','` | Field separator |
| `withBOM` | `boolean` | `true` | Add UTF-8 BOM (Excel compatibility) |

### `exportCsv(options)` — Standalone Utility Function

Import directly from `canvas-vue-table`, can be used independently of the component.

```ts
interface ExportCsvOptions {
  columns: Column[]    // Column config (uses title for header, field for value)
  items: unknown[]     // Data source
  filename?: string    // Download filename, default 'export.csv'
  separator?: string   // Separator, default ','
  withBOM?: boolean    // UTF-8 BOM, default true
}
```

## Notes

- UTF-8 BOM is added by default to ensure Chinese characters display correctly in Excel
- CSV fields containing commas, double quotes, or newlines are automatically escaped
- The instance method exports the current view data (including sorted order and flattened tree data)
- Columns with `type: 'html'` export their raw field values, not rendered HTML

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
.demo-btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}
.demo-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background: #ecf5ff;
}
</style>
