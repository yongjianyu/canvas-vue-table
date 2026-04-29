<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const treeItems = ref([
  {
    id: 1, name: '研发中心', head: '张总',
    children: [
      {
        id: 11, name: '前端组', head: '李经理',
        children: [
          { id: 111, name: 'Vue 项目', head: '王工' },
          { id: 112, name: 'React 项目', head: '赵工' },
        ],
      },
      {
        id: 12, name: '后端组', head: '刘经理',
        children: [
          { id: 121, name: 'API 服务', head: '孙工' },
        ],
      },
    ],
  },
  {
    id: 2, name: '产品中心', head: '黄总',
    children: [
      { id: 21, name: '需求分析', head: '郑经理' },
      { id: 22, name: 'UI 设计', head: '林经理' },
    ],
  },
])

const treeColumns = [
  { field: 'name', title: '部门 / 项目', width: 250 },
  { field: 'head', title: '负责人', width: 120 },
]

const expandedKeys = ref([])
function onExpandChange(keys) {
  expandedKeys.value = keys
}
</script>

# 树形数据 / 展开行

支持嵌套子节点的树形数据展示，点击展开箭头折叠/展开子行。

## 基本用法

设置 `children-field` 指定子节点数据的字段名：

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">组织架构</span>
    <span class="demo-tag demo-tag--blue">已展开 {{ expandedKeys.length }} 个节点</span>
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
    name: '研发中心',
    children: [
      { id: 11, name: '前端组' },
      { id: 12, name: '后端组' },
    ],
  },
  {
    id: 2,
    name: '产品中心',
    children: [
      { id: 21, name: '需求分析' },
    ],
  },
])

const columns = [
  { field: 'name', title: '名称', width: 250 },
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

有子节点的行会在第一列显示展开/折叠箭头，点击箭头切换。

## 默认全部展开

设置 `default-expand-all` 在初始化时展开所有节点：

```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  children-field="children"
  default-expand-all
  row-key="id"
/>
```

## 受控展开

通过 `expanded-keys` prop 控制展开状态：

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

## 缩进量

通过 `indent` 调整每层缩进的像素数（默认 20px）：

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

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `childrenField` | `string` | `''` | 子节点字段名，为空则不启用树形模式 |
| `defaultExpandAll` | `boolean` | `false` | 是否默认展开所有节点 |
| `expandedKeys` | `Array<string \| number>` | — | 受控展开的节点 key 列表 |
| `indent` | `number` | `20` | 每层缩进像素数 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `expand-change` | `keys: Array<string \| number>` | 展开状态变化时触发 |

## Methods

| 方法 | 参数 | 说明 |
|------|------|------|
| `toggleExpand` | `(item: unknown)` | 切换指定节点的展开状态 |

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
