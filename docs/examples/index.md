# 示例

本页面展示 Canvas Vue Table 的全部功能。

<script setup>
import { ref, h, defineComponent } from 'vue'
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
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '名称', width: 200 },
  { field: 'value', title: '数值', width: 120, align: 'right' },
  { field: 'text', title: '描述', width: 300 },
]

// --- 事件 ---
const eventLog = ref([])
function onRowClick(item, index) {
  eventLog.value = [`row-click: 第 ${index} 行, name=${item.name}`]
}
function onCellClick(item, index, column) {
  eventLog.value = [`cell-click: 第 ${index} 行, 列=${column.title}, 值=${item[column.field]}`]
}

const scrollOffset = ref(0)
function onScroll(offset) {
  scrollOffset.value = offset
}

// --- 混合渲染 (VNode) ---
const statusMap = { 0: '待审核', 1: '已通过', 2: '已拒绝' }
const statusColor = { 0: '#e6a23c', 1: '#67c23a', 2: '#f56c6c' }
const statusBg = { 0: '#fdf6ec', 1: '#f0f9eb', 2: '#fef0f0' }

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
    width: 48,
    type: 'html',
    align: 'center',
    render: ({ item }) => h('input', {
      type: 'checkbox',
      checked: selectedIds.value.has(item.id),
      onChange: () => toggleSelect(item.id),
      style: {
        cursor: 'pointer',
        width: '15px',
        height: '15px',
        accentColor: '#409eff',
      },
    }),
  },
  { field: 'id', title: 'ID', width: 72, align: 'center' },
  { field: 'name', title: '姓名', width: 140 },
  { field: 'email', title: '邮箱', width: 220 },
  { field: 'score', title: '分数', width: 90, align: 'right' },
  {
    field: 'status',
    title: '状态',
    width: 110,
    type: 'html',
    align: 'center',
    render: ({ item }) => h('span', {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '99px',
        fontSize: '12px',
        fontWeight: '500',
        color: statusColor[item.status],
        backgroundColor: statusBg[item.status],
        lineHeight: '1',
      },
    }, [
      h('span', {
        style: {
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: statusColor[item.status],
        }
      }),
      statusMap[item.status],
    ]),
  },
  {
    field: 'actions',
    title: '操作',
    width: 180,
    type: 'html',
    align: 'center',
    render: ({ item }) => h('div', {
      style: { display: 'flex', gap: '4px' }
    }, [
      h('button', {
        onClick: () => { editingId.value = item.id },
        style: btnStyle('#409eff'),
      }, '编辑'),
      h('button', {
        onClick: () => { alert(`确认删除 ${item.name}？`) },
        style: btnStyle('#f56c6c'),
      }, '删除'),
      h('button', {
        onClick: () => { alert(JSON.stringify(item, null, 2)) },
        style: btnStyle('#909399'),
      }, '详情'),
    ]),
  },
]

function btnStyle(color) {
  return {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: color + '10',
    color,
    cursor: 'pointer',
    lineHeight: '1.5',
    transition: 'all 0.15s',
  }
}

// --- HTML 字符串渲染 ---
const htmlStringItems = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `产品 ${i + 1}`,
    level: ['高', '中', '低'][i % 3],
    tag: ['热销', '新品', '促销', '限量'][i % 4],
  }))
)

const tagColorMap = {
  '热销': { color: '#f56c6c', bg: '#fef0f0' },
  '新品': { color: '#409eff', bg: '#ecf5ff' },
  '促销': { color: '#e6a23c', bg: '#fdf6ec' },
  '限量': { color: '#67c23a', bg: '#f0f9eb' },
}

const levelColorMap = {
  '高': '#f56c6c',
  '中': '#e6a23c',
  '低': '#67c23a',
}

const htmlStringColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '产品名称', width: 200 },
  {
    field: 'tag',
    title: '标签',
    width: 140,
    type: 'html',
    align: 'center',
    render: ({ value }) => {
      const c = tagColorMap[value] || { color: '#909399', bg: '#f4f4f5' }
      return `<span style="
        display:inline-block;
        padding:2px 10px;
        border-radius:4px;
        font-size:12px;
        color:${c.color};
        background:${c.bg};
        border:1px solid ${c.color}20;
      ">${value}</span>`
    },
  },
  {
    field: 'level',
    title: '优先级',
    width: 120,
    type: 'html',
    align: 'center',
    render: ({ value }) => {
      const color = levelColorMap[value] || '#909399'
      return `<span style="
        display:inline-flex;
        align-items:center;
        gap:5px;
        font-size:13px;
        color:${color};
      "><span style="
        width:8px;
        height:8px;
        border-radius:50%;
        background:${color};
      "></span>${value}</span>`
    },
  },
]

// --- 组件渲染 ---
const RateStars = defineComponent({
  props: {
    item: Object,
    index: Number,
    column: Object,
    value: [Number, String],
    max: { type: Number, default: 5 },
  },
  setup(props) {
    return () => {
      const val = Number(props.value) || 0
      const stars = []
      for (let i = 1; i <= props.max; i++) {
        stars.push(h('span', {
          style: {
            fontSize: '14px',
            color: i <= val ? '#e6a23c' : '#c0c4cc',
            cursor: 'default',
          },
        }, '★'))
      }
      return h('span', {
        style: { display: 'inline-flex', gap: '1px' },
      }, stars)
    }
  },
})

const SwitchToggle = defineComponent({
  props: {
    item: Object,
    index: Number,
    column: Object,
    value: [Boolean, Number, String],
  },
  emits: ['change'],
  setup(props) {
    const active = ref(!!props.value)
    function toggle() {
      active.value = !active.value
    }
    return () => h('span', {
      onClick: toggle,
      style: {
        display: 'inline-block',
        width: '40px',
        height: '20px',
        borderRadius: '10px',
        backgroundColor: active.value ? '#409eff' : '#dcdfe6',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s',
      },
    }, [
      h('span', {
        style: {
          position: 'absolute',
          top: '2px',
          left: active.value ? '22px' : '2px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        },
      }),
    ])
  },
})

const componentItems = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `商品 ${i + 1}`,
    rating: (i % 5) + 1,
    enabled: i % 3 !== 0,
    price: (Math.random() * 500 + 10).toFixed(2),
  }))
)

const componentColumns = [
  { field: 'id', title: 'ID', width: 72, align: 'center' },
  { field: 'name', title: '商品名称', width: 180 },
  { field: 'price', title: '价格', width: 100, align: 'right' },
  {
    field: 'rating',
    title: '评分',
    width: 140,
    type: 'html',
    align: 'center',
    component: RateStars,
    componentProps: { max: 5 },
  },
  {
    field: 'enabled',
    title: '状态',
    width: 100,
    type: 'html',
    align: 'center',
    component: SwitchToggle,
  },
]

// --- 进度条 ---
const progressItems = ref(
  Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    task: `任务 ${i + 1}`,
    progress: Math.floor(Math.random() * 100),
    assignee: ['张三', '李四', '王五', '赵六'][i % 4],
  }))
)

const progressColumns = [
  { field: 'id', title: 'ID', width: 72, align: 'center' },
  { field: 'task', title: '任务名称', width: 180 },
  { field: 'assignee', title: '负责人', width: 100, align: 'center' },
  {
    field: 'progress',
    title: '进度',
    width: 260,
    type: 'html',
    render: ({ item }) => {
      const pct = item.progress
      const color = pct >= 80 ? '#67c23a' : pct >= 50 ? '#e6a23c' : '#f56c6c'
      return h('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
        },
      }, [
        h('div', {
          style: {
            flex: '1',
            height: '6px',
            backgroundColor: '#ebeef5',
            borderRadius: '3px',
            overflow: 'hidden',
          },
        }, [
          h('div', {
            style: {
              width: `${pct}%`,
              height: '100%',
              backgroundColor: color,
              borderRadius: '3px',
              transition: 'width 0.3s ease',
            },
          }),
        ]),
        h('span', {
          style: {
            fontSize: '12px',
            fontWeight: '500',
            fontVariantNumeric: 'tabular-nums',
            color: pct >= 80 ? '#67c23a' : '#909399',
            minWidth: '38px',
            textAlign: 'right',
          },
        }, `${pct}%`),
      ])
    },
  },
]

// --- 滚动加载 ---
const PAGE_SIZE = 200
const loadMoreItems = ref(generateBatch(0, PAGE_SIZE))
const loadMoreLoading = ref(false)
const loadMoreTotal = ref(PAGE_SIZE)

function generateBatch(start, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i + 1,
    name: `用户 ${start + i + 1}`,
    department: ['研发部', '产品部', '设计部', '运营部', '市场部'][
      (start + i) % 5
    ],
    role: ['工程师', '经理', '总监', '实习生'][(start + i) % 4],
  }))
}

const loadMoreColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '姓名', width: 180 },
  { field: 'department', title: '部门', width: 150 },
  { field: 'role', title: '职位', width: 150 },
]

function onLoadMore() {
  if (loadMoreLoading.value) return
  loadMoreLoading.value = true
  setTimeout(() => {
    const start = loadMoreItems.value.length
    const batch = generateBatch(start, PAGE_SIZE)
    loadMoreItems.value = [...loadMoreItems.value, ...batch]
    loadMoreTotal.value = loadMoreItems.value.length
    loadMoreLoading.value = false
  }, 500)
}

// --- 暗色主题 ---
const darkTheme = {
  headerBg: '#1e293b',
  headerText: '#e2e8f0',
  headerBorder: '#334155',
  rowBg: '#0f172a',
  rowAltBg: '#1e293b',
  rowHoverBg: '#1e3a5f',
  rowActiveBg: '#1e40af',
  cellText: '#e2e8f0',
  cellTextSecondary: '#94a3b8',
  border: '#1e293b',
  accentColor: '#60a5fa',
}

// --- 空状态 ---
const emptyItems = ref([])
const emptyColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '名称', width: 200 },
  { field: 'status', title: '状态', width: 120 },
]
</script>

## 基础表格

传入 `columns` 后自动显示表头，Canvas 高性能绘制所有单元格。设置 `striped` 开启斑马纹。

<div class="demo-block">
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :height="380"
    striped
  />
</div>

```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  :height="380"
  striped
/>
```

## 带边框

设置 `bordered` 显示列分隔线，可与 `striped` 组合使用。

<div class="demo-block">
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :height="380"
    bordered
    striped
  />
</div>

```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  :height="380"
  bordered
  striped
/>
```

## 行/单元格点击事件

监听 `row-click`、`cell-click` 和 `scroll` 事件。

<div class="demo-block">
  <div class="demo-toolbar">
    <span v-if="eventLog.length" class="demo-tag demo-tag--blue">{{ eventLog[0] }}</span>
    <span v-else class="demo-tag">点击表格查看事件</span>
    <span class="demo-tag">scrollTop: {{ scrollOffset }}</span>
  </div>
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :height="300"
    @row-click="onRowClick"
    @cell-click="onCellClick"
    @scroll="onScroll"
  />
</div>

## Canvas + HTML 混合渲染（VNode）

核心能力：`type: 'html'` 的列通过 HTML 覆盖层渲染真实组件，其余列由 Canvas 绘制。`render` 函数返回 VNode。

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag demo-tag--blue">已选中 {{ selectedIds.size }} 项</span>
    <span v-if="editingId" class="demo-tag demo-tag--green">编辑 ID: {{ editingId }}</span>
  </div>
  <CanvasVirtualList
    :columns="hybridColumns"
    :items="hybridItems"
    :height="460"
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref, h } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(/* ... */)
const selectedIds = ref(new Set())

const columns = [
  {
    field: 'id', title: '', width: 48,
    type: 'html', align: 'center',
    render: ({ item }) => h('input', {
      type: 'checkbox',
      checked: selectedIds.value.has(item.id),
      onChange: () => toggleSelect(item.id),
    }),
  },
  { field: 'id', title: 'ID', width: 72, align: 'center' },
  { field: 'name', title: '姓名', width: 140 },
  {
    field: 'status', title: '状态', width: 110,
    type: 'html', align: 'center',
    render: ({ item }) => h('span', { ... }, statusText),
  },
  {
    field: 'actions', title: '操作', width: 180,
    type: 'html', align: 'center',
    render: ({ item }) => h('div', {}, [
      h('button', { onClick: () => edit(item) }, '编辑'),
      h('button', { onClick: () => del(item) }, '删除'),
    ]),
  },
]
</script>
```
:::

## HTML 字符串渲染

`render` 函数也支持直接返回 HTML 字符串，适合简单的标签、徽章等场景，无需 `h()` 函数。

<div class="demo-block">
  <CanvasVirtualList
    :columns="htmlStringColumns"
    :items="htmlStringItems"
    :height="380"
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '产品名称', width: 200 },
  {
    field: 'tag',
    title: '标签',
    width: 140,
    type: 'html',
    align: 'center',
    // render 返回 HTML 字符串
    render: ({ value }) => {
      return `<span style="
        padding: 2px 10px;
        border-radius: 4px;
        font-size: 12px;
        color: #409eff;
        background: #ecf5ff;
      ">${value}</span>`
    },
  },
  {
    field: 'level',
    title: '优先级',
    width: 120,
    type: 'html',
    align: 'center',
    render: ({ value }) => {
      const color = { '高': '#f56c6c', '中': '#e6a23c', '低': '#67c23a' }[value]
      return `<span style="color:${color}">● ${value}</span>`
    },
  },
]
</script>
```
:::

## 组件渲染

通过 `component` 直接传入 Vue 组件，无需编写 `render` 和 `h()`。组件会收到 `CellRenderParams` 作为 props，`componentProps` 传递额外参数。

<div class="demo-block">
  <CanvasVirtualList
    :columns="componentColumns"
    :items="componentItems"
    :height="380"
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref, h, defineComponent } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

// 自定义评分组件
const RateStars = defineComponent({
  props: {
    item: Object,
    index: Number,
    column: Object,
    value: [Number, String],
    max: { type: Number, default: 5 },
  },
  setup(props) {
    return () => {
      const val = Number(props.value) || 0
      const stars = []
      for (let i = 1; i <= props.max; i++) {
        stars.push(h('span', {
          style: {
            color: i <= val ? '#e6a23c' : '#c0c4cc',
          },
        }, '★'))
      }
      return h('span', {}, stars)
    }
  },
})

// 自定义开关组件
const SwitchToggle = defineComponent({
  props: {
    item: Object,
    value: [Boolean, Number, String],
  },
  setup(props) {
    const active = ref(!!props.value)
    return () => h('span', {
      onClick: () => { active.value = !active.value },
      style: {
        width: '40px', height: '20px',
        borderRadius: '10px',
        backgroundColor: active.value ? '#409eff' : '#dcdfe6',
      },
    }, /* ... */)
  },
})

const columns = [
  { field: 'id', title: 'ID', width: 72 },
  { field: 'name', title: '商品名称', width: 180 },
  { field: 'price', title: '价格', width: 100, align: 'right' },
  {
    field: 'rating',
    title: '评分',
    width: 140,
    type: 'html',
    align: 'center',
    // 直接传组件，不需要 render + h()
    component: RateStars,
    // 额外 props
    componentProps: { max: 5 },
  },
  {
    field: 'enabled',
    title: '状态',
    width: 100,
    type: 'html',
    align: 'center',
    component: SwitchToggle,
  },
]
</script>
```
:::

## 进度条

`type: 'html'` 可以渲染任意 HTML，例如带颜色的进度条。

<div class="demo-block">
  <CanvasVirtualList
    :columns="progressColumns"
    :items="progressItems"
    :height="400"
  />
</div>

## 滚动加载

滚动到底部自动触发 `load-more` 事件。传入 `loading` 后底部显示旋转加载动画，`loading-text` 自定义文案。

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">已加载 {{ loadMoreTotal }} 条</span>
    <span v-if="loadMoreLoading" class="demo-tag demo-tag--orange">加载中...</span>
  </div>
  <CanvasVirtualList
    :columns="loadMoreColumns"
    :items="loadMoreItems"
    :height="380"
    :loading="loadMoreLoading"
    :load-more-threshold="200"
    loading-text="正在加载更多数据..."
    @load-more="onLoadMore"
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(generateBatch(0, 200))
const loading = ref(false)

function onLoadMore() {
  if (loading.value) return
  loading.value = true
  setTimeout(() => {
    items.value = [
      ...items.value,
      ...generateBatch(items.value.length, 200),
    ]
    loading.value = false
  }, 800)
}
</script>
<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="380"
    :loading="loading"
    :load-more-threshold="200"
    loading-text="正在加载更多数据..."
    @load-more="onLoadMore"
  />
</template>
```
:::

## 暗色主题

通过 `theme` prop 自定义全部色彩，支持 14 个 token。

<div class="demo-block demo-block--dark">
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :height="380"
    :theme="darkTheme"
    striped
  />
</div>

::: details 查看 Theme 配置
```ts
const darkTheme = {
  headerBg: '#1e293b',
  headerText: '#e2e8f0',
  headerBorder: '#334155',
  rowBg: '#0f172a',
  rowAltBg: '#1e293b',
  rowHoverBg: '#1e3a5f',
  rowActiveBg: '#1e40af',
  cellText: '#e2e8f0',
  cellTextSecondary: '#94a3b8',
  border: '#1e293b',
  accentColor: '#60a5fa',
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  headerFontSize: 14,
}
```
:::

## 空状态

数据为空时自动展示空状态占位。

<div class="demo-block">
  <CanvasVirtualList
    :columns="emptyColumns"
    :items="emptyItems"
    :height="280"
  />
</div>

<style scoped>
.demo-block {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.demo-block--dark {
  background: #0f172a;
  border-color: #334155;
}
.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid #ebeef5;
  background: #f5f7fa;
}
.demo-block--dark .demo-toolbar {
  background: #1e293b;
  border-color: #334155;
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
.demo-tag--green {
  color: #67c23a;
  background: #f0f9eb;
}
.demo-tag--orange {
  color: #e6a23c;
  background: #fdf6ec;
}
</style>
