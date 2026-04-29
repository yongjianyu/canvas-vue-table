<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: 20 + (i % 40),
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '姓名', width: 200, editable: true },
  { field: 'email', title: '邮箱', width: 260, editable: true },
  { field: 'age', title: '年龄', width: 100, align: 'center', editable: true },
]

function onCellEdit(params) {
  const item = items.value.find((_, i) => i === params.index)
  if (item) {
    item[params.field] = params.newValue
  }
}
</script>

# 单元格编辑

通过在列配置中设置 `editable: true`，用户可以**双击单元格**进入编辑模式。编辑器是覆盖在 Canvas 之上的原生 `<input>` 元素，编辑完成后触发 `cell-edit` 事件。

## 基本用法

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">双击可编辑列的单元格进行编辑</span>
  </div>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="380"
    striped
    @cell-edit="onCellEdit"
  />
</div>

```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'
import type { CellEditParams } from 'canvas-vue-table'

const items = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', age: 28 },
  { id: 2, name: '李四', email: 'lisi@example.com', age: 32 },
])

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名', width: 200, editable: true },
  { field: 'email', title: '邮箱', width: 260, editable: true },
  { field: 'age', title: '年龄', width: 100, editable: true },
]

function onCellEdit(params: CellEditParams) {
  const item = items.value[params.index]
  if (item) {
    item[params.field] = params.newValue
  }
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

## Column 配置

在列定义中添加 `editable: true` 即可启用该列的双击编辑：

```ts
const columns = [
  { field: 'id', title: 'ID', width: 80 },            // 不可编辑
  { field: 'name', title: '姓名', width: 200, editable: true }, // 可编辑
]
```

## CellEditParams

`cell-edit` 事件返回的参数对象：

```ts
interface CellEditParams {
  item: unknown    // 行数据对象
  index: number    // 行索引
  column: Column   // 列配置
  field: string    // 字段名
  oldValue: unknown // 编辑前的值
  newValue: string  // 编辑后的值（字符串）
}
```

## 键盘操作

| 按键 | 行为 |
|------|------|
| `Enter` | 确认编辑并关闭输入框 |
| `Escape` | 取消编辑，恢复原值 |
| 点击输入框外部 | 确认编辑并关闭输入框 |

## 注意事项

- 仅 `editable: true` 的列支持双击编辑，其他列双击无效
- `cell-edit` 事件中 `newValue` 始终为字符串类型，如需其他类型请在事件处理中自行转换
- 编辑器是覆盖在 Canvas 之上的原生 `<input>`，与固定列兼容
- 可通过组件实例的 `cancelEdit()` 方法手动取消编辑

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
</style>
