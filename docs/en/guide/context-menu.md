<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const ctxItems = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `File ${i + 1}`,
    type: ['Document', 'Image', 'Video', 'Audio'][i % 4],
    size: `${(Math.random() * 100).toFixed(1)} MB`,
  }))
)

const ctxColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: 'Filename', width: 200 },
  { field: 'type', title: 'Type', width: 120, align: 'center' },
  { field: 'size', title: 'Size', width: 120, align: 'right' },
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

# Context Menu

The component provides a `context-menu` event. When right-clicking a row, it returns the row data, column info, and mouse coordinates. The actual menu UI is fully customized by the user.

## Basic Usage

Listen to the `context-menu` event and render the menu based on the returned coordinates:

<div class="demo-block" @click="closeMenu" style="position: relative">
  <div class="demo-toolbar">
    <span class="demo-tag">Right-click a row to open menu</span>
  </div>
  <CanvasVirtualList :columns="ctxColumns" :items="ctxItems" :height="380" striped @context-menu="onContextMenu" />
  <div
    v-if="menuVisible"
    class="ctx-menu"
    :style="{ position: 'fixed', left: menuPos.x + 'px', top: menuPos.y + 'px' }"
  >
    <div class="ctx-menu-item" @click.stop="doAction('Open')">Open</div>
    <div class="ctx-menu-item" @click.stop="doAction('Copy')">Copy</div>
    <div class="ctx-menu-item ctx-menu-item--danger" @click.stop="doAction('Delete')">Delete</div>
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
      <div @click="doAction('edit')">Edit</div>
      <div @click="doAction('delete')">Delete</div>
    </div>
  </div>
</template>
```

## ContextMenuParams

The event parameter object:

```ts
interface ContextMenuParams {
  item: unknown        // Row data
  index: number        // Row index
  column: Column | null // Column where right-click occurred (null if no column hit)
  columnIndex: number  // Column index (-1 if no column hit)
  x: number            // Mouse clientX
  y: number            // Mouse clientY
}
```

## Notes

- The browser's default context menu is prevented via `preventDefault()` on right-click
- `x` / `y` are `clientX` / `clientY` (viewport coordinates), suitable for `position: fixed` menu positioning
- Menu close logic is controlled by the user (e.g., hide when clicking elsewhere)
- Compatible with fixed columns: `column` and `columnIndex` correctly identify fixed column areas

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
