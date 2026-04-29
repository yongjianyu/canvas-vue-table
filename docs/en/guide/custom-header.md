<script setup>
import { ref, h, computed } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const filterValue = ref('')
const items = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    dept: ['R&D', 'Product', 'Design', 'Operations', 'Marketing'][i % 5],
    role: ['Engineer', 'Manager', 'Director', 'Intern'][i % 4],
  }))
)

const filteredItems = computed(() => {
  if (!filterValue.value) return items.value
  return items.value.filter((item) => item.dept.includes(filterValue.value))
})

const chColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: 'Name', width: 150 },
  {
    field: 'dept',
    title: 'Department',
    width: 180,
    headerType: 'html',
    headerRender: ({ column }) => h('div', {
      style: { display: 'flex', alignItems: 'center', gap: '6px', width: '100%' },
    }, [
      h('span', { style: { fontWeight: '600', fontSize: '14px', color: '#909399' } }, column.title),
      h('input', {
        type: 'text',
        placeholder: 'Filter...',
        value: filterValue.value,
        onInput: (e) => { filterValue.value = e.target.value },
        style: {
          flex: '1', minWidth: '0', padding: '2px 6px', fontSize: '12px',
          border: '1px solid #dcdfe6', borderRadius: '3px', outline: 'none',
        },
      }),
    ]),
  },
  { field: 'role', title: 'Role', width: 120 },
]
</script>

# Custom Header Rendering

Similar to body's `type: 'html'` hybrid rendering, headers also support HTML overlay layers, allowing you to place filters, icons, dropdowns, and other interactive elements in the header.

## Basic Usage

Set `headerType: 'html'` on the `Column` and provide a `headerRender` function:

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">Inline header filter</span>
    <span class="demo-tag demo-tag--blue">{{ filteredItems.length }} items</span>
  </div>
  <CanvasVirtualList :columns="chColumns" :items="filteredItems" :height="380" striped />
</div>

```ts
const columns: Column[] = [
  { field: 'name', title: 'Name', width: 150 },
  {
    field: 'dept',
    title: 'Department',
    width: 180,
    headerType: 'html',
    headerRender: ({ column, columnIndex }) => h('div', {
      style: { display: 'flex', alignItems: 'center', gap: '6px' },
    }, [
      h('span', {}, column.title),
      h('span', { style: { color: '#409eff' } }, '▼'),
    ]),
  },
]
```

`headerRender` receives `HeaderRenderParams`:

```ts
interface HeaderRenderParams {
  column: Column
  columnIndex: number
}
```

## Using Components

You can also pass a Vue component directly via `headerComponent`:

```ts
{
  field: 'status',
  title: 'Status',
  width: 120,
  headerType: 'html',
  headerComponent: HeaderFilter,
  headerComponentProps: { options: ['Active', 'Inactive', 'On Leave'] },
}
```

The component receives `HeaderRenderParams` and additional props from `headerComponentProps`.

## Header Filter Example

Combine `headerRender` with reactive data to embed real-time filtering in the header:

```vue
<script setup>
import { ref, h, computed } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'
import type { Column } from 'canvas-vue-table'

const filterValue = ref('')
const items = ref([/* ... */])

const filteredItems = computed(() => {
  if (!filterValue.value) return items.value
  return items.value.filter((it) => it.dept.includes(filterValue.value))
})

const columns: Column[] = [
  { field: 'name', title: 'Name', width: 150 },
  {
    field: 'dept',
    title: 'Department',
    width: 180,
    headerType: 'html',
    headerRender: ({ column }) => h('div', {
      style: { display: 'flex', alignItems: 'center', gap: '6px' },
    }, [
      h('span', {}, column.title),
      h('input', {
        type: 'text',
        placeholder: 'Filter...',
        value: filterValue.value,
        onInput: (e) => { filterValue.value = e.target.value },
      }),
    ]),
  },
]
</script>

<template>
  <CanvasVirtualList
    :columns="columns"
    :items="filteredItems"
    :height="400"
  />
</template>
```

## Column Properties

| Property | Type | Description |
|----------|------|-------------|
| `headerType` | `'text' \| 'html'` | Header rendering mode, defaults to `'text'` (Canvas drawn) |
| `headerRender` | `(params: HeaderRenderParams) => VNode \| string` | Custom header render function |
| `headerComponent` | `Component` | Custom header Vue component |
| `headerComponentProps` | `Record<string, unknown>` | Extra props passed to headerComponent |

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
