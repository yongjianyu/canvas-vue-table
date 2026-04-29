<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const ctxItems = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `文件 ${i + 1}`,
    type: ['文档', '图片', '视频', '音频'][i % 4],
    size: `${(Math.random() * 100).toFixed(1)} MB`,
  }))
)

const ctxColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '文件名', width: 200 },
  { field: 'type', title: '类型', width: 120, align: 'center' },
  { field: 'size', title: '大小', width: 120, align: 'right' },
]

const menuVisible = ref(false)
const menuPos = ref({ x: 0, y: 0 })
const menuItem = ref(null)

function onContextMenu(params) {
  menuItem.value = params.item
  menuPos.value = { x: params.x, y: params.y }
  menuVisible.value = true
}

function doAction(action) {
  alert(`${action}: ${menuItem.value?.name}`)
  menuVisible.value = false
}

function closeMenu() {
  menuVisible.value = false
}
</script>

# 右键菜单

组件提供 `context-menu` 事件，右键点击行时返回行数据、列信息和鼠标坐标，具体菜单 UI 完全由用户自定义渲染。

## 基本用法

监听 `context-menu` 事件，根据返回的坐标渲染菜单：

<div class="demo-block" @click="closeMenu" style="position: relative">
  <div class="demo-toolbar">
    <span class="demo-tag">右键点击行打开菜单</span>
  </div>
  <CanvasVirtualList :columns="ctxColumns" :items="ctxItems" :height="380" striped @context-menu="onContextMenu" />
  <div
    v-if="menuVisible"
    class="ctx-menu"
    :style="{ position: 'fixed', left: menuPos.x + 'px', top: menuPos.y + 'px' }"
  >
    <div class="ctx-menu-item" @click.stop="doAction('打开')">📂 打开</div>
    <div class="ctx-menu-item" @click.stop="doAction('复制')">📋 复制</div>
    <div class="ctx-menu-item ctx-menu-item--danger" @click.stop="doAction('删除')">🗑️ 删除</div>
  </div>
</div>

```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'
import type { ContextMenuParams } from 'canvas-vue-table'

const menuVisible = ref(false)
const menuPos = ref({ x: 0, y: 0 })
const menuItem = ref(null)

function onContextMenu(params: ContextMenuParams) {
  menuItem.value = params.item
  menuPos.value = { x: params.x, y: params.y }
  menuVisible.value = true
}
</script>

<template>
  <div @click="menuVisible = false">
    <CanvasVirtualList
      :columns="columns"
      :items="items"
      @context-menu="onContextMenu"
    />
    <div
      v-if="menuVisible"
      :style="{
        position: 'fixed',
        left: menuPos.x + 'px',
        top: menuPos.y + 'px',
      }"
    >
      <div @click="doAction('edit')">编辑</div>
      <div @click="doAction('delete')">删除</div>
    </div>
  </div>
</template>
```

## ContextMenuParams

事件返回的参数对象：

```ts
interface ContextMenuParams {
  item: unknown        // 行数据
  index: number        // 行索引
  column: Column | null // 右键所在列（null 表示未命中列）
  columnIndex: number  // 列索引（-1 表示未命中）
  x: number            // 鼠标 clientX
  y: number            // 鼠标 clientY
}
```

## 注意事项

- 右键点击时浏览器默认菜单会被 `preventDefault()` 阻止
- `x` / `y` 是 `clientX` / `clientY`（视口坐标），适合用 `position: fixed` 定位菜单
- 菜单关闭逻辑由用户控制（例如点击其他区域时隐藏）
- 与固定列兼容：`column` 和 `columnIndex` 会正确识别固定列区域

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
.ctx-menu {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  z-index: 1000;
  min-width: 140px;
}
.ctx-menu-item {
  padding: 8px 16px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  transition: background 0.15s;
}
.ctx-menu-item:hover {
  background: #f5f7fa;
}
.ctx-menu-item--danger {
  color: #f56c6c;
}
</style>
