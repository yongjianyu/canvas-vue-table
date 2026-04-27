# 示例

本页面展示 Canvas Vue Table 的用法示例。

<script setup>
import { ref, h } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const demoItems = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.floor(Math.random() * 1000),
    text: `Item ${i} - 需要将 button 组件 open-type 的值设置为 contact，当用户点击后就会进入客服会话，如果用户在会话中点击了小程序消息，则会返回到小程序，开发者可以通过 bindcontact 事件回调获取到用户所点消息的页面路径 path 和对应的参数 query。`
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '名称', width: 200 },
  { field: 'value', title: '数值', width: 120 },
  { field: 'text', title: '描述', width: 240 },
]

const alignColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '名称（左对齐）', width: 200, align: 'left' },
  { field: 'value', title: '数值（右对齐）', width: 150, align: 'right' },
  { field: 'text', title: '描述（居中）', width: 300, align: 'center' },
]

const eventLog = ref([])
function onRowClick(item, index) {
  eventLog.value = [`row-click: 第 ${index} 行, name=${item.name}`]
}
function onCellClick(item, index, column) {
  eventLog.value = [`cell-click: 第 ${index} 行, 列=${column.title}, 值=${item[column.field]}`]
}

const statusMap = { 0: '待审核', 1: '已通过', 2: '已拒绝' }
const statusColor = { 0: '#e6a23c', 1: '#67c23a', 2: '#f56c6c' }

const hybridItems = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: i % 3,
    score: Math.floor(Math.random() * 100),
  }))
)

const editingId = ref(null)
const selectedIds = ref(new Set())

function toggleSelect(id) {
  const s = new Set(selectedIds.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  selectedIds.value = s
}

const hybridColumns = [
  {
    field: 'id',
    title: '',
    width: 50,
    type: 'html',
    align: 'center',
    render: ({ item }) => h('input', {
      type: 'checkbox',
      checked: selectedIds.value.has(item.id),
      onChange: () => toggleSelect(item.id),
      style: { cursor: 'pointer', width: '16px', height: '16px' },
    }),
  },
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '姓名', width: 150 },
  { field: 'email', title: '邮箱', width: 220 },
  { field: 'score', title: '分数', width: 100, align: 'right' },
  {
    field: 'status',
    title: '状态',
    width: 120,
    type: 'html',
    align: 'center',
    render: ({ item }) => h('span', {
      style: {
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '10px',
        fontSize: '12px',
        color: '#fff',
        backgroundColor: statusColor[item.status],
      },
    }, statusMap[item.status]),
  },
  {
    field: 'actions',
    title: '操作',
    width: 200,
    type: 'html',
    align: 'center',
    render: ({ item }) => h('div', { style: { display: 'flex', gap: '6px' } }, [
      h('button', {
        onClick: () => { editingId.value = item.id },
        style: btnStyle('#409eff'),
      }, '编辑'),
      h('button', {
        onClick: () => { alert(`删除 ${item.name}`) },
        style: btnStyle('#f56c6c'),
      }, '删除'),
      h('button', {
        onClick: () => { alert(JSON.stringify(item)) },
        style: btnStyle('#67c23a'),
      }, '详情'),
    ]),
  },
]

function btnStyle(color) {
  return {
    padding: '3px 10px',
    fontSize: '12px',
    border: `1px solid ${color}`,
    borderRadius: '4px',
    backgroundColor: '#fff',
    color,
    cursor: 'pointer',
    lineHeight: '1.4',
  }
}

const progressItems = ref(
  Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    task: `任务 ${i + 1}`,
    progress: Math.floor(Math.random() * 100),
    assignee: ['张三', '李四', '王五', '赵六'][i % 4],
  }))
)

const progressColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'task', title: '任务名称', width: 180 },
  { field: 'assignee', title: '负责人', width: 100, align: 'center' },
  {
    field: 'progress',
    title: '进度',
    width: 250,
    type: 'html',
    render: ({ item }) => {
      const pct = item.progress
      const color = pct >= 80 ? '#67c23a' : pct >= 50 ? '#e6a23c' : '#f56c6c'
      return h('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
        },
      }, [
        h('div', {
          style: {
            flex: '1',
            height: '8px',
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            overflow: 'hidden',
          },
        }, [
          h('div', {
            style: {
              width: `${pct}%`,
              height: '100%',
              backgroundColor: color,
              borderRadius: '4px',
              transition: 'width 0.3s',
            },
          }),
        ]),
        h('span', {
          style: { fontSize: '12px', color: '#666', minWidth: '36px' },
        }, `${pct}%`),
      ])
    },
  },
]
</script>

## 基础用法（无表头）

最简单的用法，只传入 `items`，不传 `columns` 时渲染为纯列表。

<div class="demo-container">
  <CanvasVirtualList
    :items="demoItems"
    :min-item-height="40"
    :height="300"
  />
</div>

```vue
<CanvasVirtualList
  :items="items"
  :min-item-height="40"
  :height="300"
/>
```

## 表格用法（带表头）

传入 `columns` 后自动显示表头，Canvas 绘制所有单元格。

<div class="demo-container">
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :min-item-height="40"
    :height="400"
  />
</div>

```vue
<script setup>
const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '名称', width: 200 },
  { field: 'value', title: '数值', width: 120 },
  { field: 'text', title: '描述', width: 240 },
]
</script>
<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="400"
  />
</template>
```

## 列对齐

通过 `align` 属性控制列的文本对齐方式：`left`（默认）、`center`、`right`。

<div class="demo-container">
  <CanvasVirtualList
    :columns="alignColumns"
    :items="demoItems"
    :min-item-height="40"
    :height="400"
  />
</div>

```vue
const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '名称', width: 200, align: 'left' },
  { field: 'value', title: '数值', width: 150, align: 'right' },
  { field: 'text', title: '描述', width: 300, align: 'center' },
]
```

## 行/单元格点击事件

监听 `row-click` 和 `cell-click` 事件，获取点击行和单元格的信息。

<div class="demo-container">
  <div v-if="eventLog.length" class="event-log">
    <span v-for="(log, i) in eventLog" :key="i">{{ log }}</span>
  </div>
  <div v-else class="event-log">点击表格中的任意位置查看事件</div>
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :height="300"
    @row-click="onRowClick"
    @cell-click="onCellClick"
  />
</div>

```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  :height="300"
  @row-click="(item, index) => { ... }"
  @cell-click="(item, index, column) => { ... }"
/>
```

## Canvas + HTML 混合渲染

核心示例：将 `type: 'html'` 的列通过 HTML 覆盖层渲染，支持 checkbox、状态标签、操作按钮等真实 HTML 组件，其余列仍由 Canvas 高性能绘制。

<div class="demo-container">
  <div class="demo-info">
    已选中 <strong>{{ selectedIds.size }}</strong> 项
    <span v-if="editingId"> | 正在编辑 ID: <strong>{{ editingId }}</strong></span>
  </div>
  <CanvasVirtualList
    :columns="hybridColumns"
    :items="hybridItems"
    :height="500"
    :min-item-height="44"
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref, h } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: i % 3,
    score: Math.floor(Math.random() * 100),
  }))
)

const selectedIds = ref(new Set())

function toggleSelect(id) {
  const s = new Set(selectedIds.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  selectedIds.value = s
}

const columns = [
  {
    field: 'id',
    title: '',
    width: 50,
    type: 'html',
    align: 'center',
    render: ({ item }) => h('input', {
      type: 'checkbox',
      checked: selectedIds.value.has(item.id),
      onChange: () => toggleSelect(item.id),
    }),
  },
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '姓名', width: 150 },
  { field: 'email', title: '邮箱', width: 220 },
  { field: 'score', title: '分数', width: 100, align: 'right' },
  {
    field: 'status',
    title: '状态',
    width: 120,
    type: 'html',
    align: 'center',
    render: ({ item }) => h('span', {
      style: {
        padding: '2px 10px',
        borderRadius: '10px',
        fontSize: '12px',
        color: '#fff',
        backgroundColor: ['#e6a23c', '#67c23a', '#f56c6c'][item.status],
      },
    }, ['待审核', '已通过', '已拒绝'][item.status]),
  },
  {
    field: 'actions',
    title: '操作',
    width: 200,
    type: 'html',
    align: 'center',
    render: ({ item }) => h('div', { style: { display: 'flex', gap: '6px' } }, [
      h('button', { onClick: () => edit(item) }, '编辑'),
      h('button', { onClick: () => del(item) }, '删除'),
    ]),
  },
]
</script>
<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="500"
    :min-item-height="44"
  />
</template>
```
:::

## 自定义 HTML 进度条

`type: 'html'` 不局限于按钮，可以渲染任何 HTML 内容，例如进度条。

<div class="demo-container">
  <CanvasVirtualList
    :columns="progressColumns"
    :items="progressItems"
    :height="400"
    :min-item-height="44"
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { h } from 'vue'

const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'task', title: '任务名称', width: 180 },
  { field: 'assignee', title: '负责人', width: 100, align: 'center' },
  {
    field: 'progress',
    title: '进度',
    width: 250,
    type: 'html',
    render: ({ item }) => {
      const pct = item.progress
      const color = pct >= 80 ? '#67c23a' : pct >= 50 ? '#e6a23c' : '#f56c6c'
      return h('div', {
        style: { display: 'flex', alignItems: 'center', gap: '8px', width: '100%' },
      }, [
        h('div', {
          style: { flex: '1', height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px', overflow: 'hidden' },
        }, [
          h('div', { style: { width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: '4px' } }),
        ]),
        h('span', { style: { fontSize: '12px', color: '#666' } }, `${pct}%`),
      ])
    },
  },
]
</script>
```
:::

<style scoped>
.demo-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0;
}
.event-log {
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.demo-info {
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
