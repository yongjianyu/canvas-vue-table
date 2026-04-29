<script setup>
import { ref, h } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    dept: ['研发部', '产品部', '设计部', '运营部', '市场部'][i % 5],
    email: `user${i + 1}@example.com`,
    phone: `138${String(i).padStart(8, '0')}`,
    city: ['北京', '上海', '广州', '深圳', '杭州'][i % 5],
    role: ['工程师', '经理', '总监', '实习生'][i % 4],
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 70, fixed: 'left', align: 'center' },
  { field: 'name', title: '姓名', width: 120, fixed: 'left' },
  { field: 'dept', title: '部门', width: 120 },
  { field: 'email', title: '邮箱', width: 220 },
  { field: 'phone', title: '电话', width: 150 },
  { field: 'city', title: '城市', width: 100 },
  { field: 'role', title: '职位', width: 100 },
  {
    field: 'action',
    title: '操作',
    width: 120,
    fixed: 'right',
    type: 'html',
    align: 'center',
    render: ({ item }) => h('button', {
      onClick: () => alert(`查看 ${item.name}`),
      style: {
        padding: '4px 12px', fontSize: '12px', border: 'none',
        borderRadius: '4px', backgroundColor: '#409eff10', color: '#409eff', cursor: 'pointer',
      },
    }, '查看'),
  },
]
</script>

# 固定列

当表格列数较多、总宽度超出容器时，可将关键列固定在左侧或右侧，横向滚动时始终可见。

## 基本用法

在 `Column` 配置中设置 `fixed` 属性：

<div class="demo-block">
  <CanvasVirtualList :columns="columns" :items="items" :height="380" striped bordered />
</div>

```ts
const columns = [
  { field: 'id', title: 'ID', width: 80, fixed: 'left' },
  { field: 'name', title: '姓名', width: 150, fixed: 'left' },
  { field: 'col1', title: '列1', width: 200 },
  { field: 'col2', title: '列2', width: 200 },
  { field: 'col3', title: '列3', width: 200 },
  { field: 'col4', title: '列4', width: 200 },
  { field: 'action', title: '操作', width: 120, fixed: 'right' },
]
```

- `fixed: 'left'` — 固定在左侧
- `fixed: 'right'` — 固定在右侧
- 不设置 `fixed` — 正常滚动列

## 实现原理

Canvas Vue Table 的固定列完全基于 Canvas 绘制，不依赖 DOM sticky 定位：

1. **Canvas 宽度 = 视口宽度**，spacer div 提供实际列总宽以驱动原生横向滚动
2. 渲染分三层：左固定 → 可滚动区域（clip 裁剪）→ 右固定
3. 固定列区域会重绘行背景，覆盖底层滚动内容
4. 固定列边界自动绘制渐变阴影，提示用户有隐藏内容

## 与 HTML 混合渲染配合

`type: 'html'` 的列同样支持 `fixed`。HTML overlay 会自动分成三组独立容器，可滚动区域的 overlay 带 `overflow: hidden` 裁剪，确保 Vue 组件不会溢出到固定列区域。

```ts
{
  field: 'action',
  title: '操作',
  width: 150,
  type: 'html',
  fixed: 'right',
  render: ({ item }) => h('button', { onClick: () => edit(item) }, '编辑'),
}
```

## 注意事项

- 固定列的 `width` 建议使用固定值（px），不参与自动拉伸
- 当所有列总宽小于容器宽度时，不会出现横向滚动条，固定列配置无实际效果
- 建议将 `fixed: 'left'` 的列放在 `columns` 数组前部，`fixed: 'right'` 放在后部，保持视觉顺序一致

<style scoped>
.demo-block {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
</style>
