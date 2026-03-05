# 示例

本页面展示 Canvas Vue Table 的用法示例。

<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const demoItems = ref(
  Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))
)
</script>

## 基础用法

<div class="demo-container">
  <CanvasVirtualList
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
