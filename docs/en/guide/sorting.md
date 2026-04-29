<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: +(Math.random() * 1000).toFixed(2),
    sales: Math.floor(Math.random() * 5000),
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center', sortable: true },
  { field: 'name', title: 'Product', width: 180, sortable: true },
  { field: 'price', title: 'Price', width: 120, align: 'right', sortable: true },
  { field: 'sales', title: 'Sales', width: 120, align: 'right', sortable: true },
]

const currentSort = ref('')
function onSortChange(state) {
  currentSort.value = state.order ? `${state.field} ${state.order === 'asc' ? '↑' : '↓'}` : ''
}
</script>

# Sorting

Click on column headers to sort data, supporting a three-state cycle: ascending, descending, and no sort.

## Basic Usage

Set `sortable: true` in the `Column` configuration:

<div class="demo-block">
  <div class="demo-toolbar">
    <span v-if="currentSort" class="demo-tag demo-tag--blue">Sort: {{ currentSort }}</span>
    <span v-else class="demo-tag">Click header to sort</span>
  </div>
  <CanvasVirtualList :columns="columns" :items="items" :height="380" striped @sort-change="onSortChange" />
</div>

```ts
const columns = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', width: 150, sortable: true },
  { field: 'email', title: 'Email', width: 250 },
]
```

The header automatically displays sort indicator arrows (up/down triangles), with the current sort direction highlighted in the theme color.

## Sort State Cycle

Clicking the same column header cycles through:

```
No sort → Ascending (asc) → Descending (desc) → No sort → ...
```

Clicking a different column switches directly to ascending order for that column.

## Listening to Sort Events

Get the sort state via the `sort-change` event:

```vue
<script setup>
import type { SortState } from 'canvas-vue-table'

function onSortChange(state: SortState) {
  console.log(state.field) // Sort field, e.g. 'name'
  console.log(state.order) // 'asc' | 'desc' | null
}
</script>

<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    @sort-change="onSortChange"
  />
</template>
```

## Sort Rules

Built-in sorting supports the following types:

| Data Type | Sort Method |
|-----------|-------------|
| `number` | Numeric comparison |
| `string` | `localeCompare` string comparison |
| `null` / `undefined` | Sorted first (ascending) or last (descending) |

## Server-Side Sorting

For very large datasets requiring server-side sorting, simply listen to the `sort-change` event and re-fetch data:

```vue
<script setup>
import { ref } from 'vue'

const items = ref([])

async function onSortChange({ field, order }) {
  const data = await fetchData({ sortField: field, sortOrder: order })
  items.value = data
}
</script>
```

Since the component's internal sorting is based on a `sortedItems` computed property, data refreshes automatically when the `items` prop updates.

## Combined with Fixed Columns

Sorting and fixed columns don't affect each other and can be used together:

```ts
const columns = [
  { field: 'id', title: 'ID', width: 80, fixed: 'left', sortable: true },
  { field: 'name', title: 'Name', width: 150, sortable: true },
  { field: 'score', title: 'Score', width: 120, sortable: true },
  { field: 'action', title: 'Action', width: 120, fixed: 'right' },
]
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
.demo-tag--blue {
  color: #409eff;
  background: #ecf5ff;
}
</style>
