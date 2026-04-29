<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    dept: ['研发部', '产品部', '设计部', '运营部', '市场部'][i % 5],
  }))
)

const resColumns = ref([
  { field: 'id', title: 'ID', width: 80, align: 'center', resizable: true, minWidth: 50, maxWidth: 150 },
  { field: 'name', title: '姓名', width: 150, resizable: true, minWidth: 80 },
  { field: 'email', title: '邮箱', width: 250, resizable: true, minWidth: 120 },
  { field: 'dept', title: '部门', width: 120, resizable: true, minWidth: 80 },
])

const resizeLog = ref('')
function onColumnResize(colIndex, width) {
  resizeLog.value = `列 ${colIndex} → ${Math.round(width)}px`
}
</script>

# 列拖拽调宽

将鼠标悬停在表头列边缘时，光标变为 `col-resize`，按住拖动即可调整列宽。

## 基本用法

在 `Column` 上设置 `resizable: true` 即可启用拖拽调宽：

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">拖动表头边缘调整列宽</span>
    <span v-if="resizeLog" class="demo-tag demo-tag--blue">{{ resizeLog }}</span>
  </div>
  <CanvasVirtualList :columns="resColumns" :items="items" :height="380" striped @column-resize="onColumnResize" />
</div>

```ts
const columns: Column[] = [
  { field: 'id', title: 'ID', width: 80, resizable: true },
  { field: 'name', title: '姓名', width: 150, resizable: true },
  { field: 'email', title: '邮箱', width: 250, resizable: true },
]
```

## 最小/最大宽度

通过 `minWidth` 和 `maxWidth` 限制拖拽范围：

```ts
{
  field: 'name',
  title: '姓名',
  width: 150,
  resizable: true,
  minWidth: 80,   // 最小 80px
  maxWidth: 400,  // 最大 400px
}
```

## 监听事件

拖拽结束后触发 `column-resize` 事件：

```vue
<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    @column-resize="onColumnResize"
  />
</template>

<script setup>
function onColumnResize(columnIndex: number, width: number) {
  console.log(`第 ${columnIndex} 列宽度: ${width}px`)
}
</script>
```

## 与自动列宽配合

当所有列总宽小于容器宽度时，列宽会按比例自动伸缩填满容器。拖拽调宽后，该列使用拖拽后的宽度参与比例计算。

## Column 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `resizable` | `boolean` | `undefined` | 是否可拖拽调宽 |
| `minWidth` | `number` | `30` | 拖拽最小列宽（px） |
| `maxWidth` | `number` | — | 拖拽最大列宽（px） |

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
