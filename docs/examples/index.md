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
    text: `Item ${i} - 需要将 button 组件 open-type 的值设置为 contact，当用户点击后就会进入客服会话，如果用户在会话中点击了小程序消息，则会返回到小程序，开发者可以通过 bindcontact 事件回调获取到用户所点消息的页面路径 path 和对应的参数 query。`
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '名称', width: 200 },
  { field: 'value', title: '数值', width: 120 },
  { field: 'text', title: '描述', width: 240 },
]
</script>

## 基础用法（无表头）

<div class="demo-container">
  <CanvasVirtualList
    :items="demoItems"
    :min-item-height="40"
    :height="300"
  />
</div>

## 表格用法（带表头）

<div class="demo-container">
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :min-item-height="40"
    :height="600"
  />
</div>

<style scoped>
.demo-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}
</style>
