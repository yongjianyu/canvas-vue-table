<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const treeItems = ref([
  {
    id: 1, name: 'R&D Center', head: 'Director Zhang',
    children: [
      {
        id: 11, name: 'Frontend Team', head: 'Manager Li',
        children: [
          { id: 111, name: 'Vue Project', head: 'Engineer Wang' },
          { id: 112, name: 'React Project', head: 'Engineer Zhao' },
        ],
      },
      {
        id: 12, name: 'Backend Team', head: 'Manager Liu',
        children: [
          { id: 121, name: 'API Service', head: 'Engineer Sun' },
        ],
      },
    ],
  },
  {
    id: 2, name: 'Product Center', head: 'Director Huang',
    children: [
      { id: 21, name: 'Requirements', head: 'Manager Zheng' },
      { id: 22, name: 'UI Design', head: 'Manager Lin' },
    ],
  },
])

const treeColumns = [
  { field: 'name', title: 'Department / Project', width: 250 },
  { field: 'head', title: 'Owner', width: 120 },
]

const expandedKeys = ref([])
function onExpandChange(keys) {
  expandedKeys.value = keys
}
</script>

# Tree Data / Expandable Rows

Supports tree-structured data display with nested child nodes. Click the expand arrow to collapse/expand child rows.

## Basic Usage

Set `children-field` to specify the field name for child node data:

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">Organization Structure</span>
    <span class="demo-tag demo-tag--blue">{{ expandedKeys.length }} nodes expanded</span>
  </div>
  <CanvasVirtualList
    :columns="treeColumns"
    :items="treeItems"
    :height="400"
    children-field="children"
    default-expand-all
    row-key="id"
    striped
    @expand-change="onExpandChange"
  />
</div>

```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref([
  {
    id: 1,
    name: 'R&D Center',
    children: [
      { id: 11, name: 'Frontend Team' },
      { id: 12, name: 'Backend Team' },
    ],
  },
  {
    id: 2,
    name: 'Product Center',
    children: [
      { id: 21, name: 'Requirements' },
    ],
  },
])

const columns = [
  { field: 'name', title: 'Name', width: 250 },
]
</script>

<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="400"
    children-field="children"
    row-key="id"
  />
</template>
```

Rows with child nodes display an expand/collapse arrow in the first column. Click the arrow to toggle.

## Default Expand All

Set `default-expand-all` to expand all nodes on initialization:

```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  children-field="children"
  default-expand-all
  row-key="id"
/>
```

## Controlled Expansion

Control the expansion state via the `expanded-keys` prop:

```vue
<script setup>
const expandedKeys = ref([1, 11])

function onExpandChange(keys) {
  expandedKeys.value = keys
}
</script>

<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    children-field="children"
    :expanded-keys="expandedKeys"
    row-key="id"
    @expand-change="onExpandChange"
  />
</template>
```

## Indentation

Adjust the pixel indentation per level with `indent` (default 20px):

```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  children-field="children"
  :indent="30"
  row-key="id"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `childrenField` | `string` | `''` | Child node field name, empty disables tree mode |
| `defaultExpandAll` | `boolean` | `false` | Whether to expand all nodes by default |
| `expandedKeys` | `Array<string \| number>` | — | Controlled expanded node key list |
| `indent` | `number` | `20` | Indentation pixels per level |

## Events

| Event | Params | Description |
|-------|--------|-------------|
| `expand-change` | `keys: Array<string \| number>` | Triggered when expansion state changes |

## Methods

| Method | Params | Description |
|--------|--------|-------------|
| `toggleExpand` | `(item: unknown)` | Toggle the expansion state of a specific node |

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
