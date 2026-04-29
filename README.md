# canvas-vue-table

基于 Canvas 的高性能 Vue 3 表格组件，专为海量数据渲染场景设计。

A high-performance Vue 3 table component based on Canvas, designed for massive data rendering.

📖 [在线文档 / Documentation](https://yongjianyu.github.io/canvas-vue-table)

---

**中文** | [English](#english)

---

通过 Canvas 绘制表格主体，结合虚拟滚动技术，轻松应对 **十万级** 数据量，同时支持 HTML 混合渲染满足交互需求。

## 特性

- **Canvas 渲染** — 表头与数据行使用原生 Canvas 绘制，DOM 节点极少，渲染性能远超传统方案
- **虚拟滚动** — 仅渲染可视区域行，内存占用恒定，滚动流畅
- **HTML 混合渲染** — 列级别可选 `html` 类型，支持 Vue 组件、渲染函数或 HTML 字符串，兼顾性能与交互
- **自动换行与动态行高** — 文本超出列宽自动换行，行高根据内容自适应
- **固定列** — 支持左右固定列，横向滚动时保持可见，自动阴影分隔
- **排序** — 点击表头在升序/降序/无排序之间切换
- **行选择** — 单选/多选模式，点击行自动高亮，提供 `selectAll`、`clearSelection` 等方法
- **列拖拽调宽** — 拖拽表头边缘调整列宽，支持最小/最大宽度限制
- **自定义表头渲染** — 表头支持 HTML 模式，可使用 Vue 组件或渲染函数
- **树形数据** — 支持树形结构展示，可展开/折叠子节点，支持缩进与受控展开
- **右键菜单** — 右键点击行触发事件，返回行数据、列信息和坐标
- **单元格编辑** — 双击单元格进入编辑模式，支持 Enter 确认和 Escape 取消
- **导出 CSV** — 支持组件实例方法和独立工具函数两种方式导出
- **scrollTo API** — `scrollToRow(index, align)` 精确定位到指定行
- **主题定制** — 通过 `theme` 属性一次性配置颜色、字体、间距
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
  { field: 'action', title: '操作', width: 120, fixed: 'right' },
]
```

## 排序

设置 `sortable: true` 开启列排序：

```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  @sort-change="onSortChange"
/>
```

## 行选择

设置 `selection-mode` 开启行选择：

```vue
<CanvasVirtualList
  ref="tableRef"
  :columns="columns"
  :items="items"
  row-key="id"
  selection-mode="multiple"
  @selection-change="onSelectionChange"
/>
```

## 单元格编辑

设置 `editable: true` 开启双击编辑：

```vue
<script setup lang="ts">
import type { CellEditParams } from 'canvas-vue-table'

const columns = [
  { field: 'name', title: '姓名', width: 150, editable: true },
  { field: 'email', title: '邮箱', width: 250, editable: true },
]

function onCellEdit(params: CellEditParams) {
  items.value[params.index][params.field] = params.newValue
}
</script>

<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    @cell-edit="onCellEdit"
  />
</template>
```

## 导出 CSV

两种方式导出表格数据为 CSV 文件：

```ts
// 方式一：组件实例方法
tableRef.value.exportToCsv({ filename: '数据.csv' })

// 方式二：独立工具函数
import { exportCsv } from 'canvas-vue-table'

exportCsv({
  columns,
  items: data,
  filename: '数据.csv',
})
```

## 树形数据

通过 `childrenField` 启用树形模式：

```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  row-key="id"
  children-field="children"
  :indent="24"
  default-expand-all
  @expand-change="onExpandChange"
/>
```

## 右键菜单

监听 `context-menu` 事件即可实现自定义右键菜单：

```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  @context-menu="onContextMenu"
/>
```

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
| `fixed` | `'left' \| 'right'` | 固定列 |
| `sortable` | `boolean` | 是否可排序 |
| `resizable` | `boolean` | 是否可拖拽调宽 |
| `minWidth` | `number` | 拖拽最小列宽（px） |
| `maxWidth` | `number` | 拖拽最大列宽（px） |
| `editable` | `boolean` | 是否可双击编辑 |
| `render` | `(params: CellRenderParams) => VNode \| string` | `type: 'html'` 时的渲染函数 |
| `component` | `Component` | `type: 'html'` 时直接传 Vue 组件 |
| `componentProps` | `Record \| Function` | 传给 component 的额外 props |
| `headerType` | `'text' \| 'html'` | 表头渲染模式 |
| `headerRender` | `(params: HeaderRenderParams) => VNode \| string` | 自定义表头渲染函数 |
| `headerComponent` | `Component` | 自定义表头组件 |
| `headerComponentProps` | `Record<string, unknown>` | 传给 headerComponent 的额外 props |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `scroll` | `offset: number` | 滚动时触发 |
| `row-click` | `item, index` | 行点击 |
| `cell-click` | `item, index, column` | 单元格点击 |
| `load-more` | — | 滚动到底部附近时触发 |
| `sort-change` | `{ field, order }` | 排序状态变化 |
| `selection-change` | `keys: Array<string \| number>` | 选中行变化 |
| `column-resize` | `columnIndex, width` | 列拖拽调宽结束 |
| `expand-change` | `keys: Array<string \| number>` | 树形节点展开状态变化 |
| `context-menu` | `ContextMenuParams` | 右键点击行 |
| `cell-edit` | `CellEditParams` | 单元格编辑完成 |

### Methods (通过 ref 调用)

| 方法 | 参数 | 说明 |
|------|------|------|
| `scrollToRow` | `(index, align?)` | 滚动到指定行 |
| `selectAll` | — | 全选（仅 multiple 模式） |
| `clearSelection` | — | 清空选择 |
| `getSelectedKeys` | — | 返回当前选中的 key 数组 |
| `toggleExpand` | `(item)` | 切换节点展开/折叠 |
| `cancelEdit` | — | 取消当前编辑 |
| `exportToCsv` | `(options?)` | 导出 CSV 文件 |

### Theme

```ts
interface Theme {
  headerBg?: string
  headerText?: string
  headerBorder?: string
  rowBg?: string
  rowAltBg?: string
  rowHoverBg?: string
  rowActiveBg?: string
  cellText?: string
  border?: string
  accentColor?: string
  fontFamily?: string
  fontSize?: number
  headerFontSize?: number
}
```

### Composable

```ts
import { useVirtualList } from 'canvas-vue-table'
```

`useVirtualList` 提供底层虚拟滚动逻辑，可用于自定义渲染场景。

## 开发

```bash
pnpm install
pnpm dev          # 启动 VitePress 文档
pnpm build        # 构建库
pnpm docs:build   # 构建文档
```

## License

MIT

---

<a id="english"></a>

# English

A high-performance Vue 3 table component based on Canvas, designed for massive data rendering scenarios.

The table body is drawn with Canvas combined with virtual scrolling, effortlessly handling **100,000+** rows while supporting HTML hybrid rendering for interactive needs.

## Features

- **Canvas Rendering** — Header and data rows drawn with native Canvas, minimal DOM nodes, far better performance than traditional solutions
- **Virtual Scrolling** — Only visible rows are rendered, constant memory usage, smooth scrolling
- **HTML Hybrid Rendering** — Column-level `html` type for Vue components, render functions, or HTML strings
- **Auto Wrap & Dynamic Row Height** — Text wraps automatically when exceeding column width, row height adapts to content
- **Fixed Columns** — Left/right fixed columns stay visible during horizontal scrolling with automatic shadow separators
- **Sorting** — Click header to toggle between ascending/descending/none
- **Row Selection** — Single/multiple selection modes with click-to-highlight and `selectAll`, `clearSelection` methods
- **Column Resize** — Drag header edges to resize columns with min/max width constraints
- **Custom Header Rendering** — Header supports HTML mode with Vue components or render functions
- **Tree Data** — Tree structure display with expand/collapse, indentation, and controlled expansion
- **Context Menu** — Right-click triggers events with row data, column info, and coordinates
- **Cell Editing** — Double-click cells to enter edit mode, confirm with Enter, cancel with Escape
- **Export CSV** — Export via component instance method or standalone utility function
- **scrollTo API** — `scrollToRow(index, align)` for precise row positioning
- **Theme Customization** — Configure colors, fonts, and spacing via `theme` prop
- **TypeScript** — Full type definitions, ready to use

## Installation

```bash
pnpm add canvas-vue-table
# or
npm install canvas-vue-table
```

> Requires Vue >= 3.3.0 as a peerDependency

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'
import type { Column } from 'canvas-vue-table'

const columns: Column[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 150 },
  { field: 'email', title: 'Email', width: 250 },
]

const items = ref(
  Array.from({ length: 100000 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
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

## HTML Hybrid Rendering

For columns that need interactivity, set `type: 'html'` to use Vue components or render functions:

```vue
<script setup lang="ts">
import { h } from 'vue'
import type { Column } from 'canvas-vue-table'

const columns: Column[] = [
  { field: 'name', title: 'Name', width: 150 },
  {
    field: 'action',
    title: 'Actions',
    width: 120,
    type: 'html',
    render: ({ item }) => h('button', {
      onClick: () => console.log(item),
    }, 'View'),
  },
]
</script>
```

Or pass a Vue component directly:

```ts
{
  field: 'status',
  title: 'Status',
  width: 100,
  type: 'html',
  component: StatusBadge,
  componentProps: ({ value }) => ({ status: value }),
}
```

## Fixed Columns

Set `fixed: 'left'` or `fixed: 'right'` to keep columns visible during horizontal scrolling:

```ts
const columns: Column[] = [
  { field: 'id', title: 'ID', width: 80, fixed: 'left' },
  { field: 'name', title: 'Name', width: 150, fixed: 'left' },
  { field: 'col1', title: 'Col 1', width: 200 },
  { field: 'col2', title: 'Col 2', width: 200 },
  { field: 'action', title: 'Actions', width: 120, fixed: 'right' },
]
```

## Sorting

Set `sortable: true` to enable column sorting:

```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  @sort-change="onSortChange"
/>
```

## Row Selection

Set `selection-mode` to enable row selection:

```vue
<CanvasVirtualList
  ref="tableRef"
  :columns="columns"
  :items="items"
  row-key="id"
  selection-mode="multiple"
  @selection-change="onSelectionChange"
/>
```

## Cell Editing

Set `editable: true` to enable double-click editing:

```vue
<script setup lang="ts">
import type { CellEditParams } from 'canvas-vue-table'

const columns = [
  { field: 'name', title: 'Name', width: 150, editable: true },
  { field: 'email', title: 'Email', width: 250, editable: true },
]

function onCellEdit(params: CellEditParams) {
  items.value[params.index][params.field] = params.newValue
}
</script>

<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    @cell-edit="onCellEdit"
  />
</template>
```

## Export CSV

Two ways to export table data as a CSV file:

```ts
// Option 1: Component instance method
tableRef.value.exportToCsv({ filename: 'data.csv' })

// Option 2: Standalone utility function
import { exportCsv } from 'canvas-vue-table'

exportCsv({
  columns,
  items: data,
  filename: 'data.csv',
})
```

## Tree Data

Enable tree mode with `childrenField`:

```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  row-key="id"
  children-field="children"
  :indent="24"
  default-expand-all
  @expand-change="onExpandChange"
/>
```

## Context Menu

Listen to the `context-menu` event for custom right-click menus:

```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  @context-menu="onContextMenu"
/>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Column[]` | `[]` | Column configuration |
| `items` | `unknown[]` | `[]` | Data source |
| `height` | `number` | `400` | Container height (px) |
| `minItemHeight` | `number` | `40` | Minimum row height (px) |
| `headerHeight` | `number` | `40` | Header height (px) |
| `bufferSize` | `number` | `3` | Buffer rows outside visible area |
| `loadMoreThreshold` | `number` | `200` | Distance to bottom to trigger load-more (px) |
| `theme` | `Theme` | `{}` | Theme configuration |
| `striped` | `boolean` | `false` | Zebra striping |
| `bordered` | `boolean` | `false` | Column borders |
| `loading` | `boolean` | `false` | Loading state |
| `loadingText` | `string` | `'加载中...'` | Loading text |
| `rowKey` | `string` | `'id'` | Unique row identifier field |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'none'` | Row selection mode |
| `selectedKeys` | `Array<string \| number>` | `[]` | Controlled selected keys |
| `childrenField` | `string` | `''` | Children field name for tree mode |
| `defaultExpandAll` | `boolean` | `false` | Expand all nodes by default |
| `expandedKeys` | `Array<string \| number>` | — | Controlled expanded keys |
| `indent` | `number` | `20` | Tree mode indentation per level (px) |

### Column

| Prop | Type | Description |
|------|------|-------------|
| `field` | `string` | Data field name |
| `title` | `string` | Column title |
| `width` | `number` | Column width (px) |
| `type` | `'text' \| 'html'` | Render mode, default `'text'` (Canvas) |
| `align` | `'left' \| 'center' \| 'right'` | Text alignment |
| `fixed` | `'left' \| 'right'` | Fixed column |
| `sortable` | `boolean` | Whether sortable |
| `resizable` | `boolean` | Whether resizable by dragging |
| `minWidth` | `number` | Minimum column width (px) |
| `maxWidth` | `number` | Maximum column width (px) |
| `editable` | `boolean` | Whether editable by double-click |
| `render` | `(params: CellRenderParams) => VNode \| string` | Render function for `type: 'html'` |
| `component` | `Component` | Vue component for `type: 'html'` |
| `componentProps` | `Record \| Function` | Extra props for component |
| `headerType` | `'text' \| 'html'` | Header render mode |
| `headerRender` | `(params: HeaderRenderParams) => VNode \| string` | Custom header render function |
| `headerComponent` | `Component` | Custom header component |
| `headerComponentProps` | `Record<string, unknown>` | Extra props for headerComponent |

### Events

| Event | Parameters | Description |
|-------|-----------|-------------|
| `scroll` | `offset: number` | Triggered on scroll |
| `row-click` | `item, index` | Row click |
| `cell-click` | `item, index, column` | Cell click |
| `load-more` | — | Triggered near bottom |
| `sort-change` | `{ field, order }` | Sort state changed |
| `selection-change` | `keys: Array<string \| number>` | Selected rows changed |
| `column-resize` | `columnIndex, width` | Column resize ended |
| `expand-change` | `keys: Array<string \| number>` | Tree node expand state changed |
| `context-menu` | `ContextMenuParams` | Right-click on row |
| `cell-edit` | `CellEditParams` | Cell edit completed |

### Methods (via ref)

| Method | Parameters | Description |
|--------|-----------|-------------|
| `scrollToRow` | `(index, align?)` | Scroll to specified row |
| `selectAll` | — | Select all (multiple mode only) |
| `clearSelection` | — | Clear selection |
| `getSelectedKeys` | — | Return selected key array |
| `toggleExpand` | `(item)` | Toggle node expand/collapse |
| `cancelEdit` | — | Cancel current editing |
| `exportToCsv` | `(options?)` | Export CSV file |

### Theme

```ts
interface Theme {
  headerBg?: string
  headerText?: string
  headerBorder?: string
  rowBg?: string
  rowAltBg?: string
  rowHoverBg?: string
  rowActiveBg?: string
  cellText?: string
  border?: string
  accentColor?: string
  fontFamily?: string
  fontSize?: number
  headerFontSize?: number
}
```

### Composable

```ts
import { useVirtualList } from 'canvas-vue-table'
```

`useVirtualList` provides low-level virtual scrolling logic for custom rendering scenarios.

## Development

```bash
pnpm install
pnpm dev          # Start VitePress docs
pnpm build        # Build library
pnpm docs:build   # Build docs
```

## License

MIT
