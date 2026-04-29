<script setup>
import { ref } from 'vue'
import { CanvasVirtualList, exportCsv } from 'canvas-vue-table'

const tableRef = ref(null)

const items = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    department: ['研发部', '产品部', '设计部', '市场部'][i % 4],
    salary: (5000 + Math.floor(Math.random() * 15000)),
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '姓名', width: 150 },
  { field: 'email', title: '邮箱', width: 240 },
  { field: 'department', title: '部门', width: 120, align: 'center' },
  { field: 'salary', title: '薪资', width: 120, align: 'right' },
]

function handleExportInstance() {
  tableRef.value?.exportToCsv({ filename: '员工列表.csv' })
}

function handleExportUtil() {
  exportCsv({
    columns,
    items: items.value,
    filename: '员工列表_自定义.csv',
  })
}
</script>

# 导出 CSV

组件提供两种导出 CSV 的方式：

1. **组件实例方法** `exportToCsv()` — 直接导出当前表格的列和数据
2. **独立工具函数** `exportCsv()` — 传入任意列和数据进行导出

## 基本用法

### 方式一：组件实例方法

<div class="demo-block">
  <div class="demo-toolbar">
    <button class="demo-btn" @click="handleExportInstance">导出 CSV（实例方法）</button>
  </div>
  <CanvasVirtualList
    ref="tableRef"
    :columns="columns"
    :items="items"
    :height="300"
    striped
  />
</div>

```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const tableRef = ref()

function handleExport() {
  tableRef.value?.exportToCsv({ filename: '员工列表.csv' })
}
</script>

<template>
  <button @click="handleExport">导出 CSV</button>
  <CanvasVirtualList
    ref="tableRef"
    :columns="columns"
    :items="items"
  />
</template>
```

### 方式二：独立工具函数

<div class="demo-block">
  <div class="demo-toolbar">
    <button class="demo-btn" @click="handleExportUtil">导出 CSV（工具函数）</button>
  </div>
</div>

```vue
<script setup>
import { exportCsv } from 'canvas-vue-table'

function handleExport() {
  exportCsv({
    columns: [
      { field: 'name', title: '姓名', width: 150 },
      { field: 'email', title: '邮箱', width: 240 },
    ],
    items: myData,
    filename: '导出结果.csv',
  })
}
</script>
```

## API

### `exportToCsv(options?)` — 组件实例方法

通过 `ref` 调用，自动使用当前组件的 `columns` 和 `items`。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `filename` | `string` | `'export.csv'` | 下载文件名 |
| `separator` | `string` | `','` | 字段分隔符 |
| `withBOM` | `boolean` | `true` | 是否添加 UTF-8 BOM（Excel 兼容） |

### `exportCsv(options)` — 独立工具函数

从 `canvas-vue-table` 直接导入，可独立于组件使用。

```ts
interface ExportCsvOptions {
  columns: Column[]    // 列配置（使用 title 作为表头，field 取值）
  items: unknown[]     // 数据源
  filename?: string    // 下载文件名，默认 'export.csv'
  separator?: string   // 分隔符，默认 ','
  withBOM?: boolean    // UTF-8 BOM，默认 true
}
```

## 注意事项

- 默认添加 UTF-8 BOM，确保 Excel 打开时中文不乱码
- CSV 字段中包含逗号、双引号、换行符时会自动转义
- 组件实例方法导出的是当前视图数据（含排序、树形展开后的扁平化结果）
- `type: 'html'` 的列也会导出其原始字段值，不会导出渲染后的 HTML

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
.demo-btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}
.demo-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background: #ecf5ff;
}
</style>
