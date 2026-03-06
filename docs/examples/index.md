# 示例

本页面展示 Canvas Vue Table 的用法示例。

<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const demoItems = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.floor(Math.random() * 1000),
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '名称', width: 200 },
  { field: 'value', title: '数值', width: 120 },
]
</script>

## 基础用法（无表头）

<div class="demo-container">
  <CanvasVirtualList
    :items="demoItems"
    :item-height="40"
    :height="300"
  />
</div>

## 表格用法（带表头）

<div class="demo-container">
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :item-height="40"
    :height="300"
  />
</div>

<style scoped>
.demo-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}
</style>
