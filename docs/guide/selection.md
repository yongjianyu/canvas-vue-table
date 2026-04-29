<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const tableRef = ref()
const items = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `员工 ${i + 1}`,
    dept: ['研发部', '产品部', '设计部', '运营部', '市场部'][i % 5],
    role: ['工程师', '经理', '总监', '实习生'][i % 4],
  }))
)

const selColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '姓名', width: 180 },
  { field: 'dept', title: '部门', width: 150 },
  { field: 'role', title: '职位', width: 150 },
]

const selectedKeys = ref([])
function onSelectionChange(keys) {
  selectedKeys.value = keys
}
</script>

# 行选择

支持单选和多选两种模式，点击行自动切换选中状态，选中行以 `rowActiveBg` 主题色高亮显示。

## 基本用法

通过 `selection-mode` 开启行选择，通过 `row-key` 指定唯一标识字段：

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag demo-tag--blue">已选中 {{ selectedKeys.length }} 项</span>
    <button class="demo-btn" @click="tableRef?.selectAll()">全选</button>
    <button class="demo-btn" @click="tableRef?.clearSelection()">清空</button>
  </div>
  <CanvasVirtualList
    ref="tableRef"
    :columns="selColumns"
    :items="items"
    :height="380"
    row-key="id"
    selection-mode="multiple"
    striped
    @selection-change="onSelectionChange"
  />
</div>

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

## 选择模式

| 值 | 说明 |
|---|---|
| `'none'` | 默认，不开启选择 |
| `'single'` | 单选，点击新行自动取消上一行 |
| `'multiple'` | 多选，点击切换选中/取消 |

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'none'` | 选择模式 |
| `rowKey` | `string` | `'id'` | 行数据中的唯一标识字段 |
| `selectedKeys` | `Array<string \| number>` | `[]` | 受控模式：外部传入选中的 key 列表 |

## 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `selection-change` | `keys: Array<string \| number>` | 选中项变化时触发 |

## 组件方法

通过 `ref` 获取组件实例后调用：

```ts
const tableRef = ref()

// 全选（仅 multiple 模式）
tableRef.value.selectAll()

// 清空选择
tableRef.value.clearSelection()

// 获取当前选中的 key 列表
const keys = tableRef.value.getSelectedKeys()

// 是否全选
tableRef.value.isAllSelected  // computed, boolean

// 是否部分选中
tableRef.value.isIndeterminate // computed, boolean
```

## 添加 Checkbox 列

组件本身只管理选中状态和行高亮，Checkbox UI 通过 `type: 'html'` 列自行渲染，灵活度更高：

```ts
import { h } from 'vue'

const columns = [
  {
    field: '_select',
    title: '',
    width: 48,
    type: 'html',
    fixed: 'left',
    align: 'center',
    render: ({ item }) => h('input', {
      type: 'checkbox',
      checked: selectedKeys.value.includes(item.id),
      onChange: () => toggleSelect(item.id),
      style: { cursor: 'pointer', accentColor: '#409eff' },
    }),
  },
  // ...其他列
]
```

## 受控模式

传入 `selected-keys` prop 可完全控制选中状态，适合配合外部状态管理：

```vue
<template>
  <CanvasVirtualList
    :selected-keys="store.selectedIds"
    selection-mode="multiple"
    row-key="id"
    @selection-change="store.setSelectedIds"
  />
</template>
```

## 与排序配合

选中状态基于 `rowKey`（数据标识），排序改变数据顺序不会影响已选中的行。

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
.demo-btn {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  color: #606266;
  cursor: pointer;
  transition: all 0.15s;
}
.demo-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background: #ecf5ff;
}
</style>
