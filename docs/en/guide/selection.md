<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const tableRef = ref()
const items = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    dept: ['R&D', 'Product', 'Design', 'Operations', 'Marketing'][i % 5],
    role: ['Engineer', 'Manager', 'Director', 'Intern'][i % 4],
  }))
)

const selColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: 'Name', width: 180 },
  { field: 'dept', title: 'Department', width: 150 },
  { field: 'role', title: 'Role', width: 150 },
]

const selectedKeys = ref([])
function onSelectionChange(keys) {
  selectedKeys.value = keys
}
</script>

# Row Selection

Supports single and multiple selection modes. Clicking a row automatically toggles its selection state, with selected rows highlighted using the `rowActiveBg` theme color.

## Basic Usage

Enable row selection via `selection-mode` and specify the unique identifier field with `row-key`:

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag demo-tag--blue">{{ selectedKeys.length }} selected</span>
    <button class="demo-btn" @click="tableRef?.selectAll()">Select All</button>
    <button class="demo-btn" @click="tableRef?.clearSelection()">Clear</button>
  </div>
  <CanvasVirtualList
    ref="tableRef"
    :columns="selColumns"
    :items="items"
    :height="380"
    row-key="id"
    selection-mode="multiple"
    striped
    @selection-change="onSelectionChange"
  />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const tableRef = ref()

function onSelectionChange(keys: Array<string | number>) {
  console.log('Selected:', keys)
}
</script>

<template>
  <CanvasVirtualList
    ref="tableRef"
    :columns="columns"
    :items="items"
    row-key="id"
    selection-mode="multiple"
    @selection-change="onSelectionChange"
  />
</template>
```

## Selection Modes

| Value | Description |
|-------|-------------|
| `'none'` | Default, selection disabled |
| `'single'` | Single selection, clicking a new row deselects the previous one |
| `'multiple'` | Multiple selection, clicking toggles selection |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'none'` | Selection mode |
| `rowKey` | `string` | `'id'` | Unique identifier field in row data |
| `selectedKeys` | `Array<string \| number>` | `[]` | Controlled mode: externally provided selected key list |

## Events

| Event | Params | Description |
|-------|--------|-------------|
| `selection-change` | `keys: Array<string \| number>` | Triggered when selection changes |

## Component Methods

Access via `ref`:

```ts
const tableRef = ref()

// Select all (multiple mode only)
tableRef.value.selectAll()

// Clear selection
tableRef.value.clearSelection()

// Get current selected key list
const keys = tableRef.value.getSelectedKeys()

// Whether all selected
tableRef.value.isAllSelected  // computed, boolean

// Whether partially selected
tableRef.value.isIndeterminate // computed, boolean
```

## Adding a Checkbox Column

The component only manages selection state and row highlighting. Checkbox UI is rendered via a `type: 'html'` column for maximum flexibility:

```ts
import { h } from 'vue'

const columns = [
  {
    field: '_select',
    title: '',
    width: 48,
    type: 'html',
    fixed: 'left',
    align: 'center',
    render: ({ item }) => h('input', {
      type: 'checkbox',
      checked: selectedKeys.value.includes(item.id),
      onChange: () => toggleSelect(item.id),
      style: { cursor: 'pointer', accentColor: '#409eff' },
    }),
  },
  // ...other columns
]
```

## Controlled Mode

Pass `selected-keys` prop to fully control the selection state, suitable for use with external state management:

```vue
<template>
  <CanvasVirtualList
    :selected-keys="store.selectedIds"
    selection-mode="multiple"
    row-key="id"
    @selection-change="store.setSelectedIds"
  />
</template>
```

## Combined with Sorting

Selection state is based on `rowKey` (data identifier), so sorting changes don't affect already selected rows.

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
