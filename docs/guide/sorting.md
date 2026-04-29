<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `产品 ${i + 1}`,
    price: +(Math.random() * 1000).toFixed(2),
    sales: Math.floor(Math.random() * 5000),
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center', sortable: true },
  { field: 'name', title: '产品', width: 180, sortable: true },
  { field: 'price', title: '价格', width: 120, align: 'right', sortable: true },
  { field: 'sales', title: '销量', width: 120, align: 'right', sortable: true },
]

const currentSort = ref('')
function onSortChange(state) {
  currentSort.value = state.order ? `${state.field} ${state.order === 'asc' ? '↑' : '↓'}` : ''
}
</script>

# 排序

点击表头即可对数据进行排序，支持升序、降序和取消排序三种状态循环切换。

## 基本用法

在 `Column` 配置中设置 `sortable: true`：

<div class="demo-block">
  <div class="demo-toolbar">
    <span v-if="currentSort" class="demo-tag demo-tag--blue">排序: {{ currentSort }}</span>
    <span v-else class="demo-tag">点击表头排序</span>
  </div>
  <CanvasVirtualList :columns="columns" :items="items" :height="380" striped @sort-change="onSortChange" />
</div>

```ts
const columns = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: '姓名', width: 150, sortable: true },
  { field: 'email', title: '邮箱', width: 250 },
]
```

表头会自动显示排序指示箭头（上/下三角），当前排序方向以主题色高亮。

## 排序状态循环

点击同一列表头，排序状态按以下顺序切换：

```
无排序 → 升序(asc) → 降序(desc) → 无排序 → ...
```

点击不同列时，直接切换到该列的升序。

## 监听排序事件

通过 `sort-change` 事件获取排序状态：

```vue
<script setup>
import type { SortState } from 'canvas-vue-table'

function onSortChange(state: SortState) {
  console.log(state.field) // 排序字段，如 'name'
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

## 排序规则

内置排序支持以下类型：

| 数据类型 | 排序方式 |
|---------|---------|
| `number` | 数值比较 |
| `string` | `localeCompare` 字符串比较 |
| `null` / `undefined` | 排在最前（升序）或最后（降序） |

## 服务端排序

如果数据量极大需要服务端排序，监听 `sort-change` 事件后重新请求数据即可：

```vue
<script setup>
import { ref } from 'vue'

const items = ref([])

async function onSortChange({ field, order }) {
  // 请求服务端排序后的数据
  const data = await fetchData({ sortField: field, sortOrder: order })
  items.value = data
}
</script>
```

由于组件内部排序基于 `sortedItems` computed，当 `items` prop 更新时数据会自动刷新。

## 与固定列配合

排序和固定列互不影响，可同时使用：

```ts
const columns = [
  { field: 'id', title: 'ID', width: 80, fixed: 'left', sortable: true },
  { field: 'name', title: '姓名', width: 150, sortable: true },
  { field: 'score', title: '分数', width: 120, sortable: true },
  { field: 'action', title: '操作', width: 120, fixed: 'right' },
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
