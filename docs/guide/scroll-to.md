<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const scrollToRef = ref()
const items = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `记录 ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
  }))
)

const stColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '名称', width: 200 },
  { field: 'value', title: '数值', width: 120, align: 'right' },
]

const jumpIndex = ref(5000)
function doScrollTo(align) {
  scrollToRef.value?.scrollToRow(jumpIndex.value - 1, align)
}
</script>

# scrollTo API

通过组件实例方法 `scrollToRow` 精确定位到指定行，适用于搜索定位、锚点跳转等场景。

## 基本用法

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">10000 条数据</span>
    <label style="font-size: 13px; color: #606266">
      跳转到第
      <input v-model.number="jumpIndex" type="number" min="1" max="10000" style="width: 70px; padding: 2px 6px; border: 1px solid #dcdfe6; border-radius: 4px; font-size: 13px" />
      行
    </label>
    <button class="demo-btn" @click="doScrollTo('start')">start</button>
    <button class="demo-btn" @click="doScrollTo('center')">center</button>
    <button class="demo-btn" @click="doScrollTo('end')">end</button>
  </div>
  <CanvasVirtualList ref="scrollToRef" :columns="stColumns" :items="items" :height="380" striped />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const tableRef = ref()

function jumpToRow(index: number) {
  tableRef.value.scrollToRow(index)
}
</script>

<template>
  <button @click="jumpToRow(999)">跳转到第 1000 行</button>
  <CanvasVirtualList
    ref="tableRef"
    :columns="columns"
    :items="items"
    :height="400"
  />
</template>
```

## 对齐方式

`scrollToRow` 接受第二个参数 `align`，控制目标行在视口中的位置：

```ts
// 目标行出现在视口顶部（默认）
tableRef.value.scrollToRow(100, 'start')

// 目标行出现在视口中央
tableRef.value.scrollToRow(100, 'center')

// 目标行出现在视口底部
tableRef.value.scrollToRow(100, 'end')
```

| 值 | 说明 |
|---|---|
| `'start'` | 目标行对齐到视口顶部（默认） |
| `'center'` | 目标行对齐到视口中央 |
| `'end'` | 目标行对齐到视口底部 |

## API 签名

```ts
scrollToRow(index: number, align?: 'start' | 'center' | 'end'): void
```

- `index` — 目标行索引（0-based），基于排序后的数据
- `align` — 对齐方式，默认 `'start'`
- 如果 `index` 超出范围，调用无效果

## 搜索定位示例

```vue
<script setup>
import { ref } from 'vue'

const tableRef = ref()
const keyword = ref('')

function search() {
  const index = items.value.findIndex(
    (item) => item.name.includes(keyword.value)
  )
  if (index >= 0) {
    tableRef.value.scrollToRow(index, 'center')
  }
}
</script>
```

## 与行选择配合

跳转后选中目标行：

```ts
function jumpAndSelect(index: number) {
  tableRef.value.scrollToRow(index, 'center')
  // 如果开启了 selectionMode，点击即可选中
  // 或手动控制 selectedKeys
}
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
