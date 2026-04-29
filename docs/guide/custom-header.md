<script setup>
import { ref, h, computed } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const filterValue = ref('')
const items = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    dept: ['研发部', '产品部', '设计部', '运营部', '市场部'][i % 5],
    role: ['工程师', '经理', '总监', '实习生'][i % 4],
  }))
)

const filteredItems = computed(() => {
  if (!filterValue.value) return items.value
  return items.value.filter((item) => item.dept.includes(filterValue.value))
})

const chColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '姓名', width: 150 },
  {
    field: 'dept',
    title: '部门',
    width: 180,
    headerType: 'html',
    headerRender: ({ column }) => h('div', {
      style: { display: 'flex', alignItems: 'center', gap: '6px', width: '100%' },
    }, [
      h('span', { style: { fontWeight: '600', fontSize: '14px', color: '#909399' } }, column.title),
      h('input', {
        type: 'text',
        placeholder: '筛选...',
        value: filterValue.value,
        onInput: (e) => { filterValue.value = e.target.value },
        style: {
          flex: '1', minWidth: '0', padding: '2px 6px', fontSize: '12px',
          border: '1px solid #dcdfe6', borderRadius: '3px', outline: 'none',
        },
      }),
    ]),
  },
  { field: 'role', title: '职位', width: 120 },
]
</script>

# 自定义表头渲染

类似 body 的 `type: 'html'` 混合渲染，表头也支持 HTML 覆盖层，可以在表头中放置筛选器、图标、下拉菜单等交互元素。

## 基本用法

在 `Column` 上设置 `headerType: 'html'`，并提供 `headerRender` 函数：

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">表头内嵌筛选器</span>
    <span class="demo-tag demo-tag--blue">{{ filteredItems.length }} 条</span>
  </div>
  <CanvasVirtualList :columns="chColumns" :items="filteredItems" :height="380" striped />
</div>

```ts
const columns: Column[] = [
  { field: 'name', title: '姓名', width: 150 },
  {
    field: 'dept',
    title: '部门',
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

`headerRender` 接收 `HeaderRenderParams`：

```ts
interface HeaderRenderParams {
  column: Column
  columnIndex: number
}
```

## 使用组件

也可以通过 `headerComponent` 直接传入 Vue 组件：

```ts
{
  field: 'status',
  title: '状态',
  width: 120,
  headerType: 'html',
  headerComponent: HeaderFilter,
  headerComponentProps: { options: ['在职', '离职', '休假'] },
}
```

组件会接收 `HeaderRenderParams` 以及 `headerComponentProps` 中的额外 props。

## 表头筛选器示例

结合 `headerRender` 和响应式数据，可以在表头嵌入实时筛选：

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
  { field: 'name', title: '姓名', width: 150 },
  {
    field: 'dept',
    title: '部门',
    width: 180,
    headerType: 'html',
    headerRender: ({ column }) => h('div', {
      style: { display: 'flex', alignItems: 'center', gap: '6px' },
    }, [
      h('span', {}, column.title),
      h('input', {
        type: 'text',
        placeholder: '筛选...',
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

## Column 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `headerType` | `'text' \| 'html'` | 表头渲染模式，默认 `'text'`（Canvas 绘制） |
| `headerRender` | `(params: HeaderRenderParams) => VNode \| string` | 自定义表头渲染函数 |
| `headerComponent` | `Component` | 自定义表头 Vue 组件 |
| `headerComponentProps` | `Record<string, unknown>` | 传给 headerComponent 的额外 props |

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
