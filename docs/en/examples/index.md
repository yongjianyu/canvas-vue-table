# Examples

This page showcases all features of Canvas Vue Table.

<script setup>
import { ref, h, computed, defineComponent } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const demoItems = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.floor(Math.random() * 1000),
    text: `Item ${i} - This is a long description text to demonstrate auto-wrapping behavior when content exceeds the column width, showing how the component handles text overflow gracefully.`
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'value', title: 'Value', width: 120, align: 'right' },
  { field: 'text', title: 'Description', width: 300 },
]

// --- Events ---
const eventLog = ref([])
function onRowClick(item, index) {
  eventLog.value = [`row-click: Row ${index}, name=${item.name}`]
}
function onCellClick(item, index, column) {
  eventLog.value = [`cell-click: Row ${index}, col=${column.title}, val=${item[column.field]}`]
}

const scrollOffset = ref(0)
function onScroll(offset) {
  scrollOffset.value = offset
}

// --- Hybrid Rendering (VNode) ---
const statusMap = { 0: 'Pending', 1: 'Approved', 2: 'Rejected' }
const statusColor = { 0: '#e6a23c', 1: '#67c23a', 2: '#f56c6c' }
const statusBg = { 0: '#fdf6ec', 1: '#f0f9eb', 2: '#fef0f0' }

const hybridItems = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: i % 3,
    score: Math.floor(Math.random() * 100),
  }))
)

const editingId = ref(null)
const selectedIds = ref(new Set())

function toggleSelect(id) {
  const s = new Set(selectedIds.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  selectedIds.value = s
}

const hybridColumns = [
  {
    field: 'id',
    title: '',
    width: 48,
    type: 'html',
    align: 'center',
    render: ({ item }) => h('input', {
      type: 'checkbox',
      checked: selectedIds.value.has(item.id),
      onChange: () => toggleSelect(item.id),
      style: {
        cursor: 'pointer',
        width: '15px',
        height: '15px',
        accentColor: '#409eff',
      },
    }),
  },
  { field: 'id', title: 'ID', width: 72, align: 'center' },
  { field: 'name', title: 'Name', width: 140 },
  { field: 'email', title: 'Email', width: 220 },
  { field: 'score', title: 'Score', width: 90, align: 'right' },
  {
    field: 'status',
    title: 'Status',
    width: 110,
    type: 'html',
    align: 'center',
    render: ({ item }) => h('span', {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '99px',
        fontSize: '12px',
        fontWeight: '500',
        color: statusColor[item.status],
        backgroundColor: statusBg[item.status],
        lineHeight: '1',
      },
    }, [
      h('span', {
        style: {
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: statusColor[item.status],
        }
      }),
      statusMap[item.status],
    ]),
  },
  {
    field: 'actions',
    title: 'Actions',
    width: 180,
    type: 'html',
    align: 'center',
    render: ({ item }) => h('div', {
      style: { display: 'flex', gap: '4px' }
    }, [
      h('button', {
        onClick: () => { editingId.value = item.id },
        style: btnStyle('#409eff'),
      }, 'Edit'),
      h('button', {
        onClick: () => { alert(`Delete ${item.name}?`) },
        style: btnStyle('#f56c6c'),
      }, 'Delete'),
      h('button', {
        onClick: () => { alert(JSON.stringify(item, null, 2)) },
        style: btnStyle('#909399'),
      }, 'Detail'),
    ]),
  },
]

function btnStyle(color) {
  return {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: color + '10',
    color,
    cursor: 'pointer',
    lineHeight: '1.5',
    transition: 'all 0.15s',
  }
}

// --- HTML String Rendering ---
const htmlStringItems = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    level: ['High', 'Medium', 'Low'][i % 3],
    tag: ['Hot', 'New', 'Sale', 'Limited'][i % 4],
  }))
)

const tagColorMap = {
  'Hot': { color: '#f56c6c', bg: '#fef0f0' },
  'New': { color: '#409eff', bg: '#ecf5ff' },
  'Sale': { color: '#e6a23c', bg: '#fdf6ec' },
  'Limited': { color: '#67c23a', bg: '#f0f9eb' },
}

const levelColorMap = {
  'High': '#f56c6c',
  'Medium': '#e6a23c',
  'Low': '#67c23a',
}

const htmlStringColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: 'Product Name', width: 200 },
  {
    field: 'tag',
    title: 'Tag',
    width: 140,
    type: 'html',
    align: 'center',
    render: ({ value }) => {
      const c = tagColorMap[value] || { color: '#909399', bg: '#f4f4f5' }
      return `<span style="
        display:inline-block;
        padding:2px 10px;
        border-radius:4px;
        font-size:12px;
        color:${c.color};
        background:${c.bg};
        border:1px solid ${c.color}20;
      ">${value}</span>`
    },
  },
  {
    field: 'level',
    title: 'Priority',
    width: 120,
    type: 'html',
    align: 'center',
    render: ({ value }) => {
      const color = levelColorMap[value] || '#909399'
      return `<span style="
        display:inline-flex;
        align-items:center;
        gap:5px;
        font-size:13px;
        color:${color};
      "><span style="
        width:8px;
        height:8px;
        border-radius:50%;
        background:${color};
      "></span>${value}</span>`
    },
  },
]

// --- Component Rendering ---
const RateStars = defineComponent({
  props: {
    item: Object,
    index: Number,
    column: Object,
    value: [Number, String],
    max: { type: Number, default: 5 },
  },
  setup(props) {
    return () => {
      const val = Number(props.value) || 0
      const stars = []
      for (let i = 1; i <= props.max; i++) {
        stars.push(h('span', {
          style: {
            fontSize: '14px',
            color: i <= val ? '#e6a23c' : '#c0c4cc',
            cursor: 'default',
          },
        }, '★'))
      }
      return h('span', {
        style: { display: 'inline-flex', gap: '1px' },
      }, stars)
    }
  },
})

const SwitchToggle = defineComponent({
  props: {
    item: Object,
    index: Number,
    column: Object,
    value: [Boolean, Number, String],
  },
  emits: ['change'],
  setup(props) {
    const active = ref(!!props.value)
    function toggle() {
      active.value = !active.value
    }
    return () => h('span', {
      onClick: toggle,
      style: {
        display: 'inline-block',
        width: '40px',
        height: '20px',
        borderRadius: '10px',
        backgroundColor: active.value ? '#409eff' : '#dcdfe6',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s',
      },
    }, [
      h('span', {
        style: {
          position: 'absolute',
          top: '2px',
          left: active.value ? '22px' : '2px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        },
      }),
    ])
  },
})

const componentItems = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    rating: (i % 5) + 1,
    enabled: i % 3 !== 0,
    price: (Math.random() * 500 + 10).toFixed(2),
  }))
)

const componentColumns = [
  { field: 'id', title: 'ID', width: 72, align: 'center' },
  { field: 'name', title: 'Product Name', width: 180 },
  { field: 'price', title: 'Price', width: 100, align: 'right' },
  {
    field: 'rating',
    title: 'Rating',
    width: 140,
    type: 'html',
    align: 'center',
    component: RateStars,
    componentProps: { max: 5 },
  },
  {
    field: 'enabled',
    title: 'Status',
    width: 100,
    type: 'html',
    align: 'center',
    component: SwitchToggle,
  },
]

// --- Progress Bar ---
const progressItems = ref(
  Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    task: `Task ${i + 1}`,
    progress: Math.floor(Math.random() * 100),
    assignee: ['Alice', 'Bob', 'Charlie', 'Diana'][i % 4],
  }))
)

const progressColumns = [
  { field: 'id', title: 'ID', width: 72, align: 'center' },
  { field: 'task', title: 'Task Name', width: 180 },
  { field: 'assignee', title: 'Assignee', width: 100, align: 'center' },
  {
    field: 'progress',
    title: 'Progress',
    width: 260,
    type: 'html',
    render: ({ item }) => {
      const pct = item.progress
      const color = pct >= 80 ? '#67c23a' : pct >= 50 ? '#e6a23c' : '#f56c6c'
      return h('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
        },
      }, [
        h('div', {
          style: {
            flex: '1',
            height: '6px',
            backgroundColor: '#ebeef5',
            borderRadius: '3px',
            overflow: 'hidden',
          },
        }, [
          h('div', {
            style: {
              width: `${pct}%`,
              height: '100%',
              backgroundColor: color,
              borderRadius: '3px',
              transition: 'width 0.3s ease',
            },
          }),
        ]),
        h('span', {
          style: {
            fontSize: '12px',
            fontWeight: '500',
            fontVariantNumeric: 'tabular-nums',
            color: pct >= 80 ? '#67c23a' : '#909399',
            minWidth: '38px',
            textAlign: 'right',
          },
        }, `${pct}%`),
      ])
    },
  },
]

// --- Scroll Loading ---
const PAGE_SIZE = 200
const loadMoreItems = ref(generateBatch(0, PAGE_SIZE))
const loadMoreLoading = ref(false)
const loadMoreTotal = ref(PAGE_SIZE)

function generateBatch(start, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i + 1,
    name: `User ${start + i + 1}`,
    department: ['R&D', 'Product', 'Design', 'Operations', 'Marketing'][
      (start + i) % 5
    ],
    role: ['Engineer', 'Manager', 'Director', 'Intern'][(start + i) % 4],
  }))
}

const loadMoreColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: 'Name', width: 180 },
  { field: 'department', title: 'Department', width: 150 },
  { field: 'role', title: 'Role', width: 150 },
]

function onLoadMore() {
  if (loadMoreLoading.value) return
  loadMoreLoading.value = true
  setTimeout(() => {
    const start = loadMoreItems.value.length
    const batch = generateBatch(start, PAGE_SIZE)
    loadMoreItems.value = [...loadMoreItems.value, ...batch]
    loadMoreTotal.value = loadMoreItems.value.length
    loadMoreLoading.value = false
  }, 500)
}

// --- Fixed Columns ---
const fixedColItems = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    dept: ['R&D', 'Product', 'Design', 'Operations', 'Marketing'][i % 5],
    email: `user${i + 1}@example.com`,
    phone: `138${String(i).padStart(8, '0')}`,
    city: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hangzhou'][i % 5],
    joinDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-15`,
    role: ['Engineer', 'Manager', 'Director', 'Intern'][i % 4],
    status: ['Active', 'Inactive', 'On Leave'][i % 3],
  }))
)

const fixedColumns = [
  { field: 'id', title: 'ID', width: 70, fixed: 'left', align: 'center' },
  { field: 'name', title: 'Name', width: 120, fixed: 'left' },
  { field: 'dept', title: 'Dept', width: 120 },
  { field: 'email', title: 'Email', width: 220 },
  { field: 'phone', title: 'Phone', width: 150 },
  { field: 'city', title: 'City', width: 100 },
  { field: 'joinDate', title: 'Join Date', width: 130 },
  { field: 'role', title: 'Role', width: 100 },
  {
    field: 'status',
    title: 'Actions',
    width: 150,
    fixed: 'right',
    type: 'html',
    align: 'center',
    render: ({ item }) => h('div', { style: { display: 'flex', gap: '4px' } }, [
      h('button', {
        onClick: () => alert(`Edit ${item.name}`),
        style: btnStyle('#409eff'),
      }, 'Edit'),
      h('button', {
        onClick: () => alert(`Delete ${item.name}`),
        style: btnStyle('#f56c6c'),
      }, 'Delete'),
    ]),
  },
]

// --- Sorting ---
const sortItems = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: +(Math.random() * 1000).toFixed(2),
    sales: Math.floor(Math.random() * 5000),
    rating: +(Math.random() * 5).toFixed(1),
  }))
)

const sortColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center', sortable: true },
  { field: 'name', title: 'Product Name', width: 180, sortable: true },
  { field: 'price', title: 'Price', width: 120, align: 'right', sortable: true },
  { field: 'sales', title: 'Sales', width: 120, align: 'right', sortable: true },
  { field: 'rating', title: 'Rating', width: 100, align: 'center', sortable: true },
]

const currentSort = ref('')
function onSortChange(state) {
  if (state.order) {
    currentSort.value = `${state.field} ${state.order === 'asc' ? '↑' : '↓'}`
  } else {
    currentSort.value = ''
  }
}

// --- Fixed Columns + Sorting Combo ---
const comboItems = ref(
  Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    dept: ['R&D', 'Product', 'Design', 'Operations', 'Marketing'][i % 5],
    salary: Math.floor(Math.random() * 30000 + 5000),
    performance: +(Math.random() * 100).toFixed(1),
    project: `Project-${String.fromCharCode(65 + (i % 8))}`,
    level: ['P5', 'P6', 'P7', 'P8'][i % 4],
  }))
)

const comboColumns = [
  { field: 'id', title: 'ID', width: 70, fixed: 'left', align: 'center', sortable: true },
  { field: 'name', title: 'Name', width: 130, fixed: 'left', sortable: true },
  { field: 'dept', title: 'Dept', width: 120, sortable: true },
  { field: 'level', title: 'Level', width: 80, align: 'center', sortable: true },
  { field: 'project', title: 'Project', width: 120 },
  { field: 'salary', title: 'Salary', width: 120, align: 'right', sortable: true },
  { field: 'performance', title: 'Performance', width: 100, align: 'right', sortable: true },
  {
    field: 'actions',
    title: 'Actions',
    width: 100,
    fixed: 'right',
    type: 'html',
    align: 'center',
    render: ({ item }) => h('button', {
      onClick: () => alert(JSON.stringify(item, null, 2)),
      style: btnStyle('#409eff'),
    }, 'Detail'),
  },
]

const comboSort = ref('')
function onComboSortChange(state) {
  if (state.order) {
    comboSort.value = `${state.field} ${state.order === 'asc' ? '↑' : '↓'}`
  } else {
    comboSort.value = ''
  }
}

// --- Row Selection (Multiple) ---
const selectionItems = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    dept: ['R&D', 'Product', 'Design', 'Operations', 'Marketing'][i % 5],
    role: ['Engineer', 'Manager', 'Director', 'Intern'][i % 4],
  }))
)

const selectionColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: 'Name', width: 180 },
  { field: 'dept', title: 'Department', width: 150 },
  { field: 'role', title: 'Role', width: 150 },
]

const multiSelectedKeys = ref([])
function onMultiSelectionChange(keys) {
  multiSelectedKeys.value = keys
}

const multiTableRef = ref()

// --- Row Selection (Single) ---
const singleSelectedKeys = ref([])
function onSingleSelectionChange(keys) {
  singleSelectedKeys.value = keys
}

// --- scrollTo API ---
const scrollToRef = ref()
const scrollToItems = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `Record ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
  }))
)
const scrollToColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'value', title: 'Value', width: 120, align: 'right' },
]
const jumpIndex = ref(5000)

function doScrollTo(align) {
  scrollToRef.value?.scrollToRow(jumpIndex.value - 1, align)
}

// --- Column Resize ---
const resizeItems = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    dept: ['R&D', 'Product', 'Design', 'Operations', 'Marketing'][i % 5],
    role: ['Engineer', 'Manager', 'Director', 'Intern'][i % 4],
  }))
)

const resizeColumns = ref([
  { field: 'id', title: 'ID', width: 80, align: 'center', resizable: true, minWidth: 50, maxWidth: 150 },
  { field: 'name', title: 'Name', width: 150, resizable: true, minWidth: 80 },
  { field: 'email', title: 'Email', width: 250, resizable: true, minWidth: 120 },
  { field: 'dept', title: 'Dept', width: 120, resizable: true, minWidth: 80 },
  { field: 'role', title: 'Role', width: 120, resizable: true, minWidth: 80 },
])

const resizeLog = ref('')
function onColumnResize(colIndex, width) {
  const col = resizeColumns.value[colIndex]
  resizeLog.value = `${col.title} → ${Math.round(width)}px`
}

// --- Custom Header Rendering ---
const filterValue = ref('')
const headerRenderItems = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    dept: ['R&D', 'Product', 'Design', 'Operations', 'Marketing'][i % 5],
    role: ['Engineer', 'Manager', 'Director', 'Intern'][i % 4],
    status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Inactive' : 'On Leave',
  }))
)

const filteredHeaderItems = computed(() => {
  if (!filterValue.value) return headerRenderItems.value
  return headerRenderItems.value.filter(
    (item) => item.dept.includes(filterValue.value)
  )
})

const headerRenderColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: 'Name', width: 150 },
  {
    field: 'dept',
    title: 'Department',
    width: 180,
    headerType: 'html',
    headerRender: ({ column }) => h('div', {
      style: { display: 'flex', alignItems: 'center', gap: '6px', width: '100%' },
    }, [
      h('span', { style: { fontWeight: '600', fontSize: '14px', color: '#909399' } }, column.title),
      h('input', {
        type: 'text',
        placeholder: 'Filter...',
        value: filterValue.value,
        onInput: (e) => { filterValue.value = e.target.value },
        style: {
          flex: '1',
          minWidth: '0',
          padding: '2px 6px',
          fontSize: '12px',
          border: '1px solid #dcdfe6',
          borderRadius: '3px',
          outline: 'none',
        },
      }),
    ]),
  },
  { field: 'role', title: 'Role', width: 120 },
  {
    field: 'status',
    title: 'Status',
    width: 120,
    align: 'center',
    headerType: 'html',
    headerRender: ({ column }) => h('div', {
      style: { display: 'flex', alignItems: 'center', gap: '4px' },
    }, [
      h('span', {
        style: {
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#67c23a',
        },
      }),
      h('span', { style: { fontWeight: '600', fontSize: '14px', color: '#909399' } }, column.title),
    ]),
  },
]

// --- Tree Data ---
const treeItems = ref([
  {
    id: 1,
    name: 'R&D Center',
    budget: 500000,
    head: 'Director Zhang',
    children: [
      {
        id: 11,
        name: 'Frontend Team',
        budget: 200000,
        head: 'Manager Li',
        children: [
          { id: 111, name: 'Vue Project', budget: 80000, head: 'Engineer Wang' },
          { id: 112, name: 'React Project', budget: 70000, head: 'Engineer Zhao' },
          { id: 113, name: 'Infrastructure', budget: 50000, head: 'Engineer Chen' },
        ],
      },
      {
        id: 12,
        name: 'Backend Team',
        budget: 180000,
        head: 'Manager Liu',
        children: [
          { id: 121, name: 'API Service', budget: 100000, head: 'Engineer Sun' },
          { id: 122, name: 'Database', budget: 80000, head: 'Engineer Zhou' },
        ],
      },
      { id: 13, name: 'QA Team', budget: 120000, head: 'Manager Wu' },
    ],
  },
  {
    id: 2,
    name: 'Product Center',
    budget: 300000,
    head: 'Director Huang',
    children: [
      { id: 21, name: 'Requirements', budget: 150000, head: 'Manager Zheng' },
      {
        id: 22,
        name: 'UI Design',
        budget: 150000,
        head: 'Manager Lin',
        children: [
          { id: 221, name: 'Visual Design', budget: 80000, head: 'Designer He' },
          { id: 222, name: 'Interaction Design', budget: 70000, head: 'Designer Luo' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Operations Center',
    budget: 200000,
    head: 'Director Ma',
    children: [
      { id: 31, name: 'Content Ops', budget: 100000, head: 'Manager Xu' },
      { id: 32, name: 'User Ops', budget: 100000, head: 'Manager Zhu' },
    ],
  },
])

const treeColumns = [
  { field: 'name', title: 'Dept / Project', width: 250 },
  { field: 'head', title: 'Owner', width: 120 },
  { field: 'budget', title: 'Budget', width: 120, align: 'right' },
]

const treeExpandedKeys = ref([])
function onExpandChange(keys) {
  treeExpandedKeys.value = keys
}

const treeTableRef = ref()

// --- Context Menu ---
const ctxMenuVisible = ref(false)
const ctxMenuPos = ref({ x: 0, y: 0 })
const ctxMenuItem = ref(null)
const ctxMenuColumn = ref(null)

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

function onCtxMenu(params) {
  ctxMenuItem.value = params.item
  ctxMenuColumn.value = params.column
  ctxMenuPos.value = { x: params.x, y: params.y }
  ctxMenuVisible.value = true
}

function ctxAction(action) {
  alert(`${action}: ${ctxMenuItem.value?.name}`)
  ctxMenuVisible.value = false
}

function closeCtxMenu() {
  ctxMenuVisible.value = false
}

// --- Dark Theme ---
const darkTheme = {
  headerBg: '#1e293b',
  headerText: '#e2e8f0',
  headerBorder: '#334155',
  rowBg: '#0f172a',
  rowAltBg: '#1e293b',
  rowHoverBg: '#1e3a5f',
  rowActiveBg: '#1e40af',
  cellText: '#e2e8f0',
  cellTextSecondary: '#94a3b8',
  border: '#1e293b',
  accentColor: '#60a5fa',
}

// --- Empty State ---
const emptyItems = ref([])
const emptyColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'status', title: 'Status', width: 120 },
]
</script>

## Basic Table

Pass `columns` to automatically display headers, with all cells rendered by Canvas for high performance. Set `striped` to enable zebra striping.

<div class="demo-block">
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :height="380"
    striped
  />
</div>

::: details View full code
```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  :height="380"
  striped
/>
```
:::

## Bordered

Set `bordered` to display column dividers. Can be combined with `striped`.

<div class="demo-block">
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :height="380"
    bordered
    striped
  />
</div>

::: details View full code
```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  :height="380"
  bordered
  striped
/>
```
:::

## Fixed Columns

Set `fixed: 'left'` or `fixed: 'right'` to pin columns on either side of the table. They remain visible during horizontal scrolling with automatic shadow indicators.

<div class="demo-block">
  <CanvasVirtualList
    :columns="fixedColumns"
    :items="fixedColItems"
    :height="400"
    striped
    bordered
  />
</div>

## Sorting

Columns with `sortable: true` can be sorted by clicking the header. Clicking cycles through: ascending → descending → no sort. The current sort direction is highlighted in the theme color.

<div class="demo-block">
  <div class="demo-toolbar">
    <span v-if="currentSort" class="demo-tag demo-tag--blue">Sort: {{ currentSort }}</span>
    <span v-else class="demo-tag">Click header to sort</span>
  </div>
  <CanvasVirtualList
    :columns="sortColumns"
    :items="sortItems"
    :height="380"
    striped
    @sort-change="onSortChange"
  />
</div>

## Fixed Columns + Sorting

Fixed columns and sorting can be combined without affecting each other.

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">500 rows</span>
    <span v-if="comboSort" class="demo-tag demo-tag--blue">Sort: {{ comboSort }}</span>
  </div>
  <CanvasVirtualList
    :columns="comboColumns"
    :items="comboItems"
    :height="400"
    striped
    bordered
    @sort-change="onComboSortChange"
  />
</div>

## Row/Cell Click Events

Listen to `row-click`, `cell-click`, and `scroll` events.

<div class="demo-block">
  <div class="demo-toolbar">
    <span v-if="eventLog.length" class="demo-tag demo-tag--blue">{{ eventLog[0] }}</span>
    <span v-else class="demo-tag">Click table to see events</span>
    <span class="demo-tag">scrollTop: {{ scrollOffset }}</span>
  </div>
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :height="300"
    @row-click="onRowClick"
    @cell-click="onCellClick"
    @scroll="onScroll"
  />
</div>

## Canvas + HTML Hybrid Rendering (VNode)

Core feature: `type: 'html'` columns render real components through an HTML overlay, while other columns are drawn by Canvas. The `render` function returns VNode.

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag demo-tag--blue">{{ selectedIds.size }} selected</span>
    <span v-if="editingId" class="demo-tag demo-tag--green">Editing ID: {{ editingId }}</span>
  </div>
  <CanvasVirtualList
    :columns="hybridColumns"
    :items="hybridItems"
    :height="460"
  />
</div>

## HTML String Rendering

The `render` function also supports returning HTML strings directly, suitable for simple tags and badges without needing the `h()` function.

<div class="demo-block">
  <CanvasVirtualList
    :columns="htmlStringColumns"
    :items="htmlStringItems"
    :height="380"
  />
</div>

## Component Rendering

Pass a Vue component directly via `component`, no need for `render` and `h()`. The component receives `CellRenderParams` as props, with `componentProps` passing extra parameters.

<div class="demo-block">
  <CanvasVirtualList
    :columns="componentColumns"
    :items="componentItems"
    :height="380"
  />
</div>

## Progress Bar

`type: 'html'` can render any HTML, such as colored progress bars.

<div class="demo-block">
  <CanvasVirtualList
    :columns="progressColumns"
    :items="progressItems"
    :height="400"
  />
</div>

## Scroll Loading

Scrolling to the bottom automatically triggers the `load-more` event. With `loading` prop, a spinning loading animation appears at the bottom, and `loading-text` customizes the message.

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">{{ loadMoreTotal }} loaded</span>
    <span v-if="loadMoreLoading" class="demo-tag demo-tag--orange">Loading...</span>
  </div>
  <CanvasVirtualList
    :columns="loadMoreColumns"
    :items="loadMoreItems"
    :height="380"
    :loading="loadMoreLoading"
    :load-more-threshold="200"
    loading-text="Loading more data..."
    @load-more="onLoadMore"
  />
</div>

## Row Selection (Multiple)

Set `selection-mode="multiple"` to enable multi-selection. Click a row to toggle its selection state. Selected rows are highlighted with a blue background.

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag demo-tag--blue">{{ multiSelectedKeys.length }} selected</span>
    <button class="demo-btn" @click="multiTableRef?.selectAll()">Select All</button>
    <button class="demo-btn" @click="multiTableRef?.clearSelection()">Clear</button>
  </div>
  <CanvasVirtualList
    ref="multiTableRef"
    :columns="selectionColumns"
    :items="selectionItems"
    :height="380"
    row-key="id"
    selection-mode="multiple"
    striped
    @selection-change="onMultiSelectionChange"
  />
</div>

## Row Selection (Single)

In `selection-mode="single"` mode, clicking a new row automatically deselects the previous one.

<div class="demo-block">
  <div class="demo-toolbar">
    <span v-if="singleSelectedKeys.length" class="demo-tag demo-tag--blue">Selected ID: {{ singleSelectedKeys[0] }}</span>
    <span v-else class="demo-tag">Click a row to select</span>
  </div>
  <CanvasVirtualList
    :columns="selectionColumns"
    :items="selectionItems"
    :height="380"
    row-key="id"
    selection-mode="single"
    @selection-change="onSingleSelectionChange"
  />
</div>

## scrollTo API

Use `scrollToRow(index, align)` to precisely navigate to a specific row. Supports `start`, `center`, and `end` alignment modes.

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">10,000 rows</span>
    <label style="font-size: 13px; color: #606266">
      Jump to row
      <input
        v-model.number="jumpIndex"
        type="number"
        min="1"
        max="10000"
        style="width: 70px; padding: 2px 6px; border: 1px solid #dcdfe6; border-radius: 4px; font-size: 13px"
      />
    </label>
    <button class="demo-btn" @click="doScrollTo('start')">start</button>
    <button class="demo-btn" @click="doScrollTo('center')">center</button>
    <button class="demo-btn" @click="doScrollTo('end')">end</button>
  </div>
  <CanvasVirtualList
    ref="scrollToRef"
    :columns="scrollToColumns"
    :items="scrollToItems"
    :height="380"
    striped
  />
</div>

## Column Resize

Drag the right edge of a header to resize columns. Set `resizable: true` to enable, with `minWidth` / `maxWidth` constraints.

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">Drag header edge to resize</span>
    <span v-if="resizeLog" class="demo-tag demo-tag--blue">{{ resizeLog }}</span>
  </div>
  <CanvasVirtualList
    :columns="resizeColumns"
    :items="resizeItems"
    :height="380"
    striped
    @column-resize="onColumnResize"
  />
</div>

## Custom Header Rendering

Set `headerType: 'html'` to render the column header via an HTML overlay layer, supporting `headerRender` returning VNode or `headerComponent` passing a component. Ideal for embedding filters, icons, and other interactive elements in headers.

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">Inline header filter</span>
    <span class="demo-tag demo-tag--blue">{{ filteredHeaderItems.length }} items</span>
  </div>
  <CanvasVirtualList
    :columns="headerRenderColumns"
    :items="filteredHeaderItems"
    :height="380"
    striped
  />
</div>

## Tree Data

Set `children-field` to specify the child node field. Click the expand arrow to toggle child row display. Supports multi-level nesting and default expand all.

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">Organization Structure</span>
    <span class="demo-tag demo-tag--blue">{{ treeExpandedKeys.length }} nodes expanded</span>
  </div>
  <CanvasVirtualList
    ref="treeTableRef"
    :columns="treeColumns"
    :items="treeItems"
    :height="400"
    children-field="children"
    default-expand-all
    row-key="id"
    striped
    @expand-change="onExpandChange"
  />
</div>

## Context Menu

Right-clicking a row triggers the `context-menu` event, returning row data, column info, and mouse coordinates. The menu UI is fully user-customized.

<div class="demo-block" @click="closeCtxMenu" style="position: relative">
  <div class="demo-toolbar">
    <span class="demo-tag">Right-click a row to open menu</span>
  </div>
  <CanvasVirtualList
    :columns="ctxColumns"
    :items="ctxItems"
    :height="380"
    striped
    @context-menu="onCtxMenu"
  />
  <div
    v-if="ctxMenuVisible"
    class="ctx-menu"
    :style="{ position: 'fixed', left: ctxMenuPos.x + 'px', top: ctxMenuPos.y + 'px' }"
  >
    <div class="ctx-menu-item" @click.stop="ctxAction('Open')">Open</div>
    <div class="ctx-menu-item" @click.stop="ctxAction('Copy')">Copy</div>
    <div class="ctx-menu-item" @click.stop="ctxAction('Rename')">Rename</div>
    <div class="ctx-menu-divider" />
    <div class="ctx-menu-item ctx-menu-item--danger" @click.stop="ctxAction('Delete')">Delete</div>
  </div>
</div>

## Dark Theme

Customize all colors via the `theme` prop, supporting 14 tokens.

<div class="demo-block demo-block--dark">
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :height="380"
    :theme="darkTheme"
    striped
  />
</div>

::: details View Theme config
```ts
const darkTheme = {
  headerBg: '#1e293b',
  headerText: '#e2e8f0',
  headerBorder: '#334155',
  rowBg: '#0f172a',
  rowAltBg: '#1e293b',
  rowHoverBg: '#1e3a5f',
  rowActiveBg: '#1e40af',
  cellText: '#e2e8f0',
  cellTextSecondary: '#94a3b8',
  border: '#1e293b',
  accentColor: '#60a5fa',
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  headerFontSize: 14,
}
```
:::

## Empty State

Automatically displays an empty state placeholder when data is empty.

<div class="demo-block">
  <CanvasVirtualList
    :columns="emptyColumns"
    :items="emptyItems"
    :height="280"
  />
</div>

<style scoped>
.demo-block {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.demo-block--dark {
  background: #0f172a;
  border-color: #334155;
}
.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid #ebeef5;
  background: #f5f7fa;
}
.demo-block--dark .demo-toolbar {
  background: #1e293b;
  border-color: #334155;
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
.demo-tag--green {
  color: #67c23a;
  background: #f0f9eb;
}
.demo-tag--orange {
  color: #e6a23c;
  background: #fdf6ec;
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
.ctx-menu-item--danger:hover {
  background: #fef0f0;
}
.ctx-menu-divider {
  height: 1px;
  background: #ebeef5;
  margin: 4px 0;
}
</style>
