# canvas-vue-table

基于 Canvas 的高性能 Vue 3 表格组件，专为海量数据渲染场景设计。

📖 [在线文档](https://yongjianyu.github.io/canvas-vue-table)

通过 Canvas 绘制表格主体，结合虚拟滚动技术，轻松应对 **十万级** 数据量，同时支持 HTML 混合渲染满足交互需求。

## 特性

- **Canvas 渲染** — 表头与数据行使用原生 Canvas 绘制，DOM 节点极少，渲染性能远超传统方案
- **虚拟滚动** — 仅渲染可视区域行，内存占用恒定，滚动流畅
- **HTML 混合渲染** — 列级别可选 `html` 类型，支持 Vue 组件、渲染函数或 HTML 字符串，兼顾性能与交互
- **自动换行与动态行高** — 文本超出列宽自动换行，行高根据内容自适应
- **行选择** — 单选/多选模式，点击行自动高亮，提供 `selectAll`、`clearSelection` 等方法
- **scrollTo API** — `scrollToRow(index, align)` 精确定位到指定行
- **主题定制** — 通过 `theme` 属性一次性配置颜色、字体、间距
- **列拖拽调宽** — 拖拽表头边缘调整列宽，支持最小/最大宽度限制
- **自定义表头渲染** — 表头支持 HTML 模式，可使用 Vue 组件或渲染函数自定义表头内容
- **树形数据** — 支持树形结构展示，可展开/折叠子节点，支持缩进与受控展开
- **右键菜单** — 右键点击行触发事件，返回行数据、列信息和坐标，便于自定义菜单
- **TypeScript** — 完整类型定义，开箱即用

## 安装

```bash
pnpm add canvas-vue-table
# 或
npm install canvas-vue-table
```

> 需要 Vue >= 3.3.0 作为 peerDependency

## 快速开始

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'
import type { Column } from 'canvas-vue-table'

const columns: Column[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名', width: 150 },
  { field: 'email', title: '邮箱', width: 250 },
]

const items = ref(
  Array.from({ length: 100000 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }))
)
</script>

<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="600"
    striped
  />
</template>
```

## HTML 混合渲染

对需要交互的列，设置 `type: 'html'` 即可使用 Vue 组件或渲染函数：

```vue
<script setup lang="ts">
import { h } from 'vue'
import type { Column } from 'canvas-vue-table'

const columns: Column[] = [
  { field: 'name', title: '姓名', width: 150 },
  {
    field: 'action',
    title: '操作',
    width: 120,
    type: 'html',
    render: ({ item }) => h('button', {
      onClick: () => console.log(item),
    }, '查看'),
  },
]
</script>
```

也可直接传入 Vue 组件：

```ts
{
  field: 'status',
  title: '状态',
  width: 100,
  type: 'html',
  component: StatusBadge,
  componentProps: ({ value }) => ({ status: value }),
}
```

## 固定列

设置 `fixed: 'left'` 或 `fixed: 'right'` 使列在横向滚动时保持可见：

```ts
const columns: Column[] = [
  { field: 'id', title: 'ID', width: 80, fixed: 'left' },
  { field: 'name', title: '姓名', width: 150, fixed: 'left' },
  { field: 'col1', title: '列1', width: 200 },
  { field: 'col2', title: '列2', width: 200 },
  { field: 'col3', title: '列3', width: 200 },
  { field: 'action', title: '操作', width: 120, fixed: 'right' },
]
```

固定列之间会自动显示阴影分隔线。

## 排序

设置 `sortable: true` 开启列排序，点击表头在升序/降序/无排序之间切换：

```vue
<script setup lang="ts">
import type { Column, SortState } from 'canvas-vue-table'

const columns: Column[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: '姓名', width: 150, sortable: true },
  { field: 'email', title: '邮箱', width: 250 },
]

function onSortChange(state: SortState) {
  console.log(state.field, state.order) // 'id', 'asc'
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

## 行选择

设置 `selection-mode` 开启行选择，点击行切换选中状态，选中行高亮显示：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const tableRef = ref()

function onSelectionChange(keys: Array<string | number>) {
  console.log('选中:', keys)
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

组件方法：
- `tableRef.value.selectAll()` — 全选
- `tableRef.value.clearSelection()` — 清空
- `tableRef.value.getSelectedKeys()` — 获取选中 key 列表

## 列拖拽调宽

设置 `resizable: true` 使列支持拖拽调整宽度，可通过 `minWidth` / `maxWidth` 限制范围：

```vue
<script setup lang="ts">
import type { Column } from 'canvas-vue-table'

const columns: Column[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名', width: 150, resizable: true, minWidth: 80, maxWidth: 300 },
  { field: 'email', title: '邮箱', width: 250, resizable: true, minWidth: 120 },
]

function onColumnResize(columnIndex: number, width: number) {
  console.log(`第 ${columnIndex} 列宽度变为 ${width}px`)
}
</script>

<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    @column-resize="onColumnResize"
  />
</template>
```

鼠标悬停在列边缘时光标变为拖拽样式，按住拖动即可调整列宽。

## 自定义表头渲染

设置 `headerType: 'html'` 开启自定义表头，支持渲染函数或 Vue 组件：

```vue
<script setup lang="ts">
import { h } from 'vue'
import type { Column } from 'canvas-vue-table'
import MyHeaderFilter from './MyHeaderFilter.vue'

const columns: Column[] = [
  { field: 'id', title: 'ID', width: 80 },
  {
    field: 'name',
    title: '姓名',
    width: 150,
    headerType: 'html',
    headerRender: ({ column }) => h('div', [
      h('span', column.title),
      h('i', { class: 'icon-filter' }),
    ]),
  },
  {
    field: 'status',
    title: '状态',
    width: 120,
    headerType: 'html',
    headerComponent: MyHeaderFilter,
    headerComponentProps: { placeholder: '筛选状态' },
  },
]
</script>
```

`headerRender` 接收 `{ column, columnIndex }` 参数；`headerComponent` 可以是任意 Vue 组件。

## 树形数据

通过 `childrenField` 指定子节点字段名即可启用树形模式：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const columns = [
  { field: 'name', title: '名称', width: 250 },
  { field: 'size', title: '大小', width: 100 },
]

const items = ref([
  {
    id: 1,
    name: '文档',
    size: '-',
    children: [
      { id: 11, name: '报告.docx', size: '2MB' },
      { id: 12, name: '数据.xlsx', size: '5MB' },
    ],
  },
  {
    id: 2,
    name: '图片',
    size: '-',
    children: [
      { id: 21, name: '封面.png', size: '1MB' },
    ],
  },
])

const tableRef = ref()

function onExpandChange(keys: Array<string | number>) {
  console.log('展开的节点:', keys)
}
</script>

<template>
  <CanvasVirtualList
    ref="tableRef"
    :columns="columns"
    :items="items"
    row-key="id"
    children-field="children"
    :indent="24"
    default-expand-all
    @expand-change="onExpandChange"
  />
</template>
```

- `childrenField` — 子节点字段名（如 `'children'`），不设置则不启用树形
- `indent` — 每层缩进像素，默认 `20`
- `defaultExpandAll` — 默认展开所有节点
- `expandedKeys` — 受控模式，手动控制展开的节点
- 通过 `ref` 调用 `toggleExpand(item)` 可手动切换节点展开/折叠

## 右键菜单

监听 `context-menu` 事件即可实现自定义右键菜单：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'
import type { ContextMenuParams } from 'canvas-vue-table'

const menuVisible = ref(false)
const menuPos = ref({ x: 0, y: 0 })
const menuItem = ref<unknown>(null)

function onContextMenu(params: ContextMenuParams) {
  menuItem.value = params.item
  menuPos.value = { x: params.x, y: params.y }
  menuVisible.value = true
}
</script>

<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    @context-menu="onContextMenu"
  />

  <div
    v-if="menuVisible"
    class="context-menu"
    :style="{ left: menuPos.x + 'px', top: menuPos.y + 'px' }"
  >
    <div @click="handleEdit">编辑</div>
    <div @click="handleDelete">删除</div>
  </div>
</template>
```

事件参数 `ContextMenuParams` 包含：`item`（行数据）、`index`（行索引）、`column`（列配置）、`columnIndex`（列索引）、`x` / `y`（鼠标坐标）。

## scrollTo API

通过 `ref` 调用 `scrollToRow` 定位到指定行：

```ts
const tableRef = ref()

// 跳转到第 1000 行，居中显示
tableRef.value.scrollToRow(999, 'center')
```

支持三种对齐：`'start'`（默认）、`'center'`、`'end'`。

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `Column[]` | `[]` | 列配置 |
| `items` | `unknown[]` | `[]` | 数据源 |
| `height` | `number` | `400` | 容器高度（px） |
| `minItemHeight` | `number` | `40` | 最小行高（px） |
| `headerHeight` | `number` | `40` | 表头高度（px） |
| `bufferSize` | `number` | `3` | 可视区域外缓冲行数 |
| `loadMoreThreshold` | `number` | `200` | 触发 load-more 的底部距离（px） |
| `theme` | `Theme` | `{}` | 主题配置 |
| `striped` | `boolean` | `false` | 斑马纹 |
| `bordered` | `boolean` | `false` | 列边框 |
| `loading` | `boolean` | `false` | 加载状态 |
| `loadingText` | `string` | `'加载中...'` | 加载提示文字 |
| `rowKey` | `string` | `'id'` | 行数据唯一标识字段 |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'none'` | 行选择模式 |
| `selectedKeys` | `Array<string \| number>` | `[]` | 受控模式：选中的 key 列表 |
| `childrenField` | `string` | `''` | 子节点字段名，启用树形模式 |
| `defaultExpandAll` | `boolean` | `false` | 默认展开所有节点 |
| `expandedKeys` | `Array<string \| number>` | — | 受控展开节点 key 列表 |
| `indent` | `number` | `20` | 树形模式每层缩进（px） |

### Column

| 属性 | 类型 | 说明 |
|------|------|------|
| `field` | `string` | 数据字段名 |
| `title` | `string` | 列标题 |
| `width` | `number` | 列宽（px） |
| `type` | `'text' \| 'html'` | 渲染模式，默认 `'text'`（Canvas 绘制） |
| `align` | `'left' \| 'center' \| 'right'` | 文本对齐 |
| `fixed` | `'left' \| 'right'` | 固定列，横向滚动时保持可见 |
| `sortable` | `boolean` | 是否可排序，点击表头切换升序/降序 |
| `render` | `(params: CellRenderParams) => VNode \| string` | `type: 'html'` 时的渲染函数 |
| `component` | `Component` | `type: 'html'` 时直接传 Vue 组件 |
| `componentProps` | `Record \| Function` | 传给 component 的额外 props |
| `headerType` | `'text' \| 'html'` | 表头渲染模式，默认 Canvas 绘制 |
| `headerRender` | `(params: HeaderRenderParams) => VNode \| string` | 自定义表头渲染函数 |
| `headerComponent` | `Component` | 自定义表头组件 |
| `headerComponentProps` | `Record<string, unknown>` | 传给 headerComponent 的额外 props |
| `resizable` | `boolean` | 是否可拖拽调宽 |
| `minWidth` | `number` | 拖拽最小列宽（px） |
| `maxWidth` | `number` | 拖拽最大列宽（px） |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `scroll` | `offset: number` | 滚动时触发 |
| `row-click` | `item, index` | 行点击 |
| `cell-click` | `item, index, column` | 单元格点击 |
| `load-more` | — | 滚动到底部附近时触发 |
| `sort-change` | `{ field, order }` | 排序状态变化，`order` 为 `'asc'` / `'desc'` / `null` |
| `selection-change` | `keys: Array<string \| number>` | 选中行变化 |
| `column-resize` | `columnIndex, width` | 列拖拽调宽结束 |
| `expand-change` | `keys: Array<string \| number>` | 树形节点展开状态变化 |
| `context-menu` | `ContextMenuParams` | 右键点击行，返回行数据、列和坐标 |

### Methods (通过 ref 调用)

| 方法 | 参数 | 说明 |
|------|------|------|
| `scrollToRow` | `(index: number, align?: 'start' \| 'center' \| 'end')` | 滚动到指定行 |
| `selectAll` | — | 全选（仅 multiple 模式） |
| `clearSelection` | — | 清空选择 |
| `getSelectedKeys` | — | 返回当前选中的 key 数组 |
| `toggleExpand` | `(item: unknown)` | 切换指定节点展开/折叠 |

### Theme

```ts
interface Theme {
  headerBg?: string        // 表头背景
  headerText?: string      // 表头文字颜色
  headerBorder?: string    // 表头底部边框
  rowBg?: string           // 行背景
  rowAltBg?: string        // 斑马纹行背景
  rowHoverBg?: string      // 悬停行背景
  rowActiveBg?: string     // 激活行背景
  cellText?: string        // 单元格文字颜色
  border?: string          // 边框颜色
  accentColor?: string     // 强调色
  fontFamily?: string      // 字体
  fontSize?: number        // 正文字号
  headerFontSize?: number  // 表头字号
}
```

### Composable

```ts
import { useVirtualList } from 'canvas-vue-table'
```

`useVirtualList` 提供底层虚拟滚动逻辑，可用于自定义渲染场景。返回 `scrollTop`、`totalHeight`、`range`、`setScrollTop` 等响应式状态与方法。

## 开发

```bash
pnpm install
pnpm dev          # 启动 VitePress 文档
pnpm build        # 构建库
pnpm docs:build   # 构建文档
```

## License

MIT
