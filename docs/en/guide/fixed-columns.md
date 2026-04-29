<script setup>
import { ref, h } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    dept: ['R&D', 'Product', 'Design', 'Operations', 'Marketing'][i % 5],
    email: `user${i + 1}@example.com`,
    phone: `138${String(i).padStart(8, '0')}`,
    city: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hangzhou'][i % 5],
    role: ['Engineer', 'Manager', 'Director', 'Intern'][i % 4],
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 70, fixed: 'left', align: 'center' },
  { field: 'name', title: 'Name', width: 120, fixed: 'left' },
  { field: 'dept', title: 'Department', width: 120 },
  { field: 'email', title: 'Email', width: 220 },
  { field: 'phone', title: 'Phone', width: 150 },
  { field: 'city', title: 'City', width: 100 },
  { field: 'role', title: 'Role', width: 100 },
  {
    field: 'action',
    title: 'Action',
    width: 120,
    fixed: 'right',
    type: 'html',
    align: 'center',
    render: ({ item }) => h('button', {
      onClick: () => alert(`View ${item.name}`),
      style: {
        padding: '4px 12px', fontSize: '12px', border: 'none',
        borderRadius: '4px', backgroundColor: '#409eff10', color: '#409eff', cursor: 'pointer',
      },
    }, 'View'),
  },
]
</script>

# Fixed Columns

When the table has many columns and the total width exceeds the container, you can fix key columns on the left or right side so they remain visible during horizontal scrolling.

## Basic Usage

Set the `fixed` property in the `Column` configuration:

<div class="demo-block">
  <CanvasVirtualList :columns="columns" :items="items" :height="380" striped bordered />
</div>

```ts
const columns = [
  { field: 'id', title: 'ID', width: 80, fixed: 'left' },
  { field: 'name', title: 'Name', width: 150, fixed: 'left' },
  { field: 'col1', title: 'Column 1', width: 200 },
  { field: 'col2', title: 'Column 2', width: 200 },
  { field: 'col3', title: 'Column 3', width: 200 },
  { field: 'col4', title: 'Column 4', width: 200 },
  { field: 'action', title: 'Action', width: 120, fixed: 'right' },
]
```

- `fixed: 'left'` — Fixed on the left side
- `fixed: 'right'` — Fixed on the right side
- No `fixed` — Normal scrollable column

## How It Works

Canvas Vue Table's fixed columns are entirely Canvas-based, without DOM sticky positioning:

1. **Canvas width = viewport width**, a spacer div provides the actual total column width to drive native horizontal scrolling
2. Rendering has three layers: left fixed → scrollable area (clip cropped) → right fixed
3. Fixed column areas redraw row backgrounds, covering the underlying scrolled content
4. Gradient shadows are automatically drawn at fixed column boundaries to indicate hidden content

## Working with HTML Hybrid Rendering

`type: 'html'` columns also support `fixed`. HTML overlays are automatically split into three independent containers, with the scrollable area overlay having `overflow: hidden` clipping, ensuring Vue components don't overflow into fixed column areas.

```ts
{
  field: 'action',
  title: 'Action',
  width: 150,
  type: 'html',
  fixed: 'right',
  render: ({ item }) => h('button', { onClick: () => edit(item) }, 'Edit'),
}
```

## Notes

- Fixed columns' `width` should use fixed values (px) and don't participate in auto-stretching
- When the total width of all columns is less than the container width, no horizontal scrollbar appears, and the fixed column configuration has no effect
- It's recommended to place `fixed: 'left'` columns at the beginning of the `columns` array and `fixed: 'right'` at the end, maintaining consistent visual order

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
