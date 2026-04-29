# 示例

本页面展示 Canvas Vue Table 的全部功能。

<script setup>
import { ref, h, computed, defineComponent } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const demoItems = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.floor(Math.random() * 1000),
    text: `Item ${i} - 需要将 button 组件 open-type 的值设置为 contact，当用户点击后就会进入客服会话，如果用户在会话中点击了小程序消息，则会返回到小程序，开发者可以通过 bindcontact 事件回调获取到用户所点消息的页面路径 path 和对应的参数 query。`
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '名称', width: 200 },
  { field: 'value', title: '数值', width: 120, align: 'right' },
  { field: 'text', title: '描述', width: 300 },
]

// --- 事件 ---
const eventLog = ref([])
function onRowClick(item, index) {
  eventLog.value = [`row-click: 第 ${index} 行, name=${item.name}`]
}
function onCellClick(item, index, column) {
  eventLog.value = [`cell-click: 第 ${index} 行, 列=${column.title}, 值=${item[column.field]}`]
}

const scrollOffset = ref(0)
function onScroll(offset) {
  scrollOffset.value = offset
}

// --- 混合渲染 (VNode) ---
const statusMap = { 0: '待审核', 1: '已通过', 2: '已拒绝' }
const statusColor = { 0: '#e6a23c', 1: '#67c23a', 2: '#f56c6c' }
const statusBg = { 0: '#fdf6ec', 1: '#f0f9eb', 2: '#fef0f0' }

const hybridItems = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
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
  { field: 'name', title: '姓名', width: 140 },
  { field: 'email', title: '邮箱', width: 220 },
  { field: 'score', title: '分数', width: 90, align: 'right' },
  {
    field: 'status',
    title: '状态',
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
    title: '操作',
    width: 180,
    type: 'html',
    align: 'center',
    render: ({ item }) => h('div', {
      style: { display: 'flex', gap: '4px' }
    }, [
      h('button', {
        onClick: () => { editingId.value = item.id },
        style: btnStyle('#409eff'),
      }, '编辑'),
      h('button', {
        onClick: () => { alert(`确认删除 ${item.name}？`) },
        style: btnStyle('#f56c6c'),
      }, '删除'),
      h('button', {
        onClick: () => { alert(JSON.stringify(item, null, 2)) },
        style: btnStyle('#909399'),
      }, '详情'),
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

// --- HTML 字符串渲染 ---
const htmlStringItems = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `产品 ${i + 1}`,
    level: ['高', '中', '低'][i % 3],
    tag: ['热销', '新品', '促销', '限量'][i % 4],
  }))
)

const tagColorMap = {
  '热销': { color: '#f56c6c', bg: '#fef0f0' },
  '新品': { color: '#409eff', bg: '#ecf5ff' },
  '促销': { color: '#e6a23c', bg: '#fdf6ec' },
  '限量': { color: '#67c23a', bg: '#f0f9eb' },
}

const levelColorMap = {
  '高': '#f56c6c',
  '中': '#e6a23c',
  '低': '#67c23a',
}

const htmlStringColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '产品名称', width: 200 },
  {
    field: 'tag',
    title: '标签',
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
    title: '优先级',
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

// --- 组件渲染 ---
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
    name: `商品 ${i + 1}`,
    rating: (i % 5) + 1,
    enabled: i % 3 !== 0,
    price: (Math.random() * 500 + 10).toFixed(2),
  }))
)

const componentColumns = [
  { field: 'id', title: 'ID', width: 72, align: 'center' },
  { field: 'name', title: '商品名称', width: 180 },
  { field: 'price', title: '价格', width: 100, align: 'right' },
  {
    field: 'rating',
    title: '评分',
    width: 140,
    type: 'html',
    align: 'center',
    component: RateStars,
    componentProps: { max: 5 },
  },
  {
    field: 'enabled',
    title: '状态',
    width: 100,
    type: 'html',
    align: 'center',
    component: SwitchToggle,
  },
]

// --- 进度条 ---
const progressItems = ref(
  Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    task: `任务 ${i + 1}`,
    progress: Math.floor(Math.random() * 100),
    assignee: ['张三', '李四', '王五', '赵六'][i % 4],
  }))
)

const progressColumns = [
  { field: 'id', title: 'ID', width: 72, align: 'center' },
  { field: 'task', title: '任务名称', width: 180 },
  { field: 'assignee', title: '负责人', width: 100, align: 'center' },
  {
    field: 'progress',
    title: '进度',
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

// --- 滚动加载 ---
const PAGE_SIZE = 200
const loadMoreItems = ref(generateBatch(0, PAGE_SIZE))
const loadMoreLoading = ref(false)
const loadMoreTotal = ref(PAGE_SIZE)

function generateBatch(start, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i + 1,
    name: `用户 ${start + i + 1}`,
    department: ['研发部', '产品部', '设计部', '运营部', '市场部'][
      (start + i) % 5
    ],
    role: ['工程师', '经理', '总监', '实习生'][(start + i) % 4],
  }))
}

const loadMoreColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '姓名', width: 180 },
  { field: 'department', title: '部门', width: 150 },
  { field: 'role', title: '职位', width: 150 },
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

// --- 固定列 ---
const fixedColItems = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    dept: ['研发部', '产品部', '设计部', '运营部', '市场部'][i % 5],
    email: `user${i + 1}@example.com`,
    phone: `138${String(i).padStart(8, '0')}`,
    city: ['北京', '上海', '广州', '深圳', '杭州'][i % 5],
    joinDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-15`,
    role: ['工程师', '经理', '总监', '实习生'][i % 4],
    status: ['在职', '离职', '休假'][i % 3],
  }))
)

const fixedColumns = [
  { field: 'id', title: 'ID', width: 70, fixed: 'left', align: 'center' },
  { field: 'name', title: '姓名', width: 120, fixed: 'left' },
  { field: 'dept', title: '部门', width: 120 },
  { field: 'email', title: '邮箱', width: 220 },
  { field: 'phone', title: '电话', width: 150 },
  { field: 'city', title: '城市', width: 100 },
  { field: 'joinDate', title: '入职日期', width: 130 },
  { field: 'role', title: '职位', width: 100 },
  {
    field: 'status',
    title: '操作',
    width: 150,
    fixed: 'right',
    type: 'html',
    align: 'center',
    render: ({ item }) => h('div', { style: { display: 'flex', gap: '4px' } }, [
      h('button', {
        onClick: () => alert(`编辑 ${item.name}`),
        style: btnStyle('#409eff'),
      }, '编辑'),
      h('button', {
        onClick: () => alert(`删除 ${item.name}`),
        style: btnStyle('#f56c6c'),
      }, '删除'),
    ]),
  },
]

// --- 排序 ---
const sortItems = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `产品 ${i + 1}`,
    price: +(Math.random() * 1000).toFixed(2),
    sales: Math.floor(Math.random() * 5000),
    rating: +(Math.random() * 5).toFixed(1),
  }))
)

const sortColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center', sortable: true },
  { field: 'name', title: '产品名称', width: 180, sortable: true },
  { field: 'price', title: '价格', width: 120, align: 'right', sortable: true },
  { field: 'sales', title: '销量', width: 120, align: 'right', sortable: true },
  { field: 'rating', title: '评分', width: 100, align: 'center', sortable: true },
]

const currentSort = ref('')
function onSortChange(state) {
  if (state.order) {
    currentSort.value = `${state.field} ${state.order === 'asc' ? '↑' : '↓'}`
  } else {
    currentSort.value = ''
  }
}

// --- 固定列 + 排序组合 ---
const comboItems = ref(
  Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    name: `员工 ${i + 1}`,
    dept: ['研发部', '产品部', '设计部', '运营部', '市场部'][i % 5],
    salary: Math.floor(Math.random() * 30000 + 5000),
    performance: +(Math.random() * 100).toFixed(1),
    project: `项目-${String.fromCharCode(65 + (i % 8))}`,
    level: ['P5', 'P6', 'P7', 'P8'][i % 4],
  }))
)

const comboColumns = [
  { field: 'id', title: 'ID', width: 70, fixed: 'left', align: 'center', sortable: true },
  { field: 'name', title: '姓名', width: 130, fixed: 'left', sortable: true },
  { field: 'dept', title: '部门', width: 120, sortable: true },
  { field: 'level', title: '职级', width: 80, align: 'center', sortable: true },
  { field: 'project', title: '项目', width: 120 },
  { field: 'salary', title: '薪资', width: 120, align: 'right', sortable: true },
  { field: 'performance', title: '绩效', width: 100, align: 'right', sortable: true },
  {
    field: 'actions',
    title: '操作',
    width: 100,
    fixed: 'right',
    type: 'html',
    align: 'center',
    render: ({ item }) => h('button', {
      onClick: () => alert(JSON.stringify(item, null, 2)),
      style: btnStyle('#409eff'),
    }, '详情'),
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

// --- 行选择（多选） ---
const selectionItems = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `员工 ${i + 1}`,
    dept: ['研发部', '产品部', '设计部', '运营部', '市场部'][i % 5],
    role: ['工程师', '经理', '总监', '实习生'][i % 4],
  }))
)

const selectionColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '姓名', width: 180 },
  { field: 'dept', title: '部门', width: 150 },
  { field: 'role', title: '职位', width: 150 },
]

const multiSelectedKeys = ref([])
function onMultiSelectionChange(keys) {
  multiSelectedKeys.value = keys
}

const multiTableRef = ref()

// --- 行选择（单选） ---
const singleSelectedKeys = ref([])
function onSingleSelectionChange(keys) {
  singleSelectedKeys.value = keys
}

// --- scrollTo API ---
const scrollToRef = ref()
const scrollToItems = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `记录 ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
  }))
)
const scrollToColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '名称', width: 200 },
  { field: 'value', title: '数值', width: 120, align: 'right' },
]
const jumpIndex = ref(5000)

function doScrollTo(align) {
  scrollToRef.value?.scrollToRow(jumpIndex.value - 1, align)
}

// --- 列拖拽调宽 ---
const resizeItems = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    dept: ['研发部', '产品部', '设计部', '运营部', '市场部'][i % 5],
    role: ['工程师', '经理', '总监', '实习生'][i % 4],
  }))
)

const resizeColumns = ref([
  { field: 'id', title: 'ID', width: 80, align: 'center', resizable: true, minWidth: 50, maxWidth: 150 },
  { field: 'name', title: '姓名', width: 150, resizable: true, minWidth: 80 },
  { field: 'email', title: '邮箱', width: 250, resizable: true, minWidth: 120 },
  { field: 'dept', title: '部门', width: 120, resizable: true, minWidth: 80 },
  { field: 'role', title: '职位', width: 120, resizable: true, minWidth: 80 },
])

const resizeLog = ref('')
function onColumnResize(colIndex, width) {
  const col = resizeColumns.value[colIndex]
  resizeLog.value = `${col.title} → ${Math.round(width)}px`
}

// --- 自定义表头渲染 ---
const filterValue = ref('')
const headerRenderItems = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    dept: ['研发部', '产品部', '设计部', '运营部', '市场部'][i % 5],
    role: ['工程师', '经理', '总监', '实习生'][i % 4],
    status: i % 3 === 0 ? '在职' : i % 3 === 1 ? '离职' : '休假',
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
  { field: 'name', title: '姓名', width: 150 },
  {
    field: 'dept',
    title: '部门',
    width: 180,
    headerType: 'html',
    headerRender: ({ column }) => h('div', {
      style: { display: 'flex', alignItems: 'center', gap: '6px', width: '100%' },
    }, [
      h('span', { style: { fontWeight: '600', fontSize: '14px', color: '#909399' } }, column.title),
      h('input', {
        type: 'text',
        placeholder: '筛选...',
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
  { field: 'role', title: '职位', width: 120 },
  {
    field: 'status',
    title: '状态',
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

// --- 树形数据 ---
const treeItems = ref([
  {
    id: 1,
    name: '研发中心',
    budget: 500000,
    head: '张总',
    children: [
      {
        id: 11,
        name: '前端组',
        budget: 200000,
        head: '李经理',
        children: [
          { id: 111, name: 'Vue 项目', budget: 80000, head: '王工' },
          { id: 112, name: 'React 项目', budget: 70000, head: '赵工' },
          { id: 113, name: '基础设施', budget: 50000, head: '陈工' },
        ],
      },
      {
        id: 12,
        name: '后端组',
        budget: 180000,
        head: '刘经理',
        children: [
          { id: 121, name: 'API 服务', budget: 100000, head: '孙工' },
          { id: 122, name: '数据库', budget: 80000, head: '周工' },
        ],
      },
      { id: 13, name: 'QA 组', budget: 120000, head: '吴经理' },
    ],
  },
  {
    id: 2,
    name: '产品中心',
    budget: 300000,
    head: '黄总',
    children: [
      { id: 21, name: '需求分析', budget: 150000, head: '郑经理' },
      {
        id: 22,
        name: 'UI 设计',
        budget: 150000,
        head: '林经理',
        children: [
          { id: 221, name: '视觉设计', budget: 80000, head: '何工' },
          { id: 222, name: '交互设计', budget: 70000, head: '罗工' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: '运营中心',
    budget: 200000,
    head: '马总',
    children: [
      { id: 31, name: '内容运营', budget: 100000, head: '许经理' },
      { id: 32, name: '用户运营', budget: 100000, head: '朱经理' },
    ],
  },
])

const treeColumns = [
  { field: 'name', title: '部门 / 项目', width: 250 },
  { field: 'head', title: '负责人', width: 120 },
  { field: 'budget', title: '预算', width: 120, align: 'right' },
]

const treeExpandedKeys = ref([])
function onExpandChange(keys) {
  treeExpandedKeys.value = keys
}

const treeTableRef = ref()

// --- 右键菜单 ---
const ctxMenuVisible = ref(false)
const ctxMenuPos = ref({ x: 0, y: 0 })
const ctxMenuItem = ref(null)
const ctxMenuColumn = ref(null)

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

// --- 暗色主题 ---
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

// --- 空状态 ---
const emptyItems = ref([])
const emptyColumns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '名称', width: 200 },
  { field: 'status', title: '状态', width: 120 },
]
</script>

## 基础表格

传入 `columns` 后自动显示表头，Canvas 高性能绘制所有单元格。设置 `striped` 开启斑马纹。

<div class="demo-block">
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :height="380"
    striped
  />
</div>

::: details 查看完整代码
```vue
<CanvasVirtualList
  :columns="columns"
  :items="items"
  :height="380"
  striped
/>
```
:::

## 带边框

设置 `bordered` 显示列分隔线，可与 `striped` 组合使用。

<div class="demo-block">
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :height="380"
    bordered
    striped
  />
</div>

::: details 查看完整代码
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

## 固定列

设置 `fixed: 'left'` 或 `fixed: 'right'` 将列固定在表格两侧，横向滚动时始终可见。固定列边界自动显示阴影。

<div class="demo-block">
  <CanvasVirtualList
    :columns="fixedColumns"
    :items="fixedColItems"
    :height="400"
    striped
    bordered
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref, h } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const columns = [
  { field: 'id', title: 'ID', width: 70, fixed: 'left', align: 'center' },
  { field: 'name', title: '姓名', width: 120, fixed: 'left' },
  { field: 'dept', title: '部门', width: 120 },
  { field: 'email', title: '邮箱', width: 220 },
  { field: 'phone', title: '电话', width: 150 },
  { field: 'city', title: '城市', width: 100 },
  { field: 'joinDate', title: '入职日期', width: 130 },
  { field: 'role', title: '职位', width: 100 },
  {
    field: 'status',
    title: '操作',
    width: 150,
    fixed: 'right',
    type: 'html',
    align: 'center',
    render: ({ item }) => h('div', { style: { display: 'flex', gap: '4px' } }, [
      h('button', { onClick: () => edit(item) }, '编辑'),
      h('button', { onClick: () => del(item) }, '删除'),
    ]),
  },
]
</script>
```
:::

## 排序

设置 `sortable: true` 的列可点击表头排序。点击循环切换：升序 → 降序 → 取消排序。当前排序方向以主题色高亮显示。

<div class="demo-block">
  <div class="demo-toolbar">
    <span v-if="currentSort" class="demo-tag demo-tag--blue">排序: {{ currentSort }}</span>
    <span v-else class="demo-tag">点击表头排序</span>
  </div>
  <CanvasVirtualList
    :columns="sortColumns"
    :items="sortItems"
    :height="380"
    striped
    @sort-change="onSortChange"
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'
import type { SortState } from 'canvas-vue-table'

const columns = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: '产品名称', width: 180, sortable: true },
  { field: 'price', title: '价格', width: 120, align: 'right', sortable: true },
  { field: 'sales', title: '销量', width: 120, align: 'right', sortable: true },
  { field: 'rating', title: '评分', width: 100, align: 'center', sortable: true },
]

function onSortChange(state: SortState) {
  console.log(state.field, state.order)
}
</script>
<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="380"
    striped
    @sort-change="onSortChange"
  />
</template>
```
:::

## 固定列 + 排序

固定列和排序可以组合使用，互不影响。

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">500 条数据</span>
    <span v-if="comboSort" class="demo-tag demo-tag--blue">排序: {{ comboSort }}</span>
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

::: details 查看完整代码
```vue
<script setup>
import { ref, h } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const columns = [
  { field: 'id', title: 'ID', width: 70, fixed: 'left', sortable: true },
  { field: 'name', title: '姓名', width: 130, fixed: 'left', sortable: true },
  { field: 'dept', title: '部门', width: 120, sortable: true },
  { field: 'level', title: '职级', width: 80, sortable: true },
  { field: 'project', title: '项目', width: 120 },
  { field: 'salary', title: '薪资', width: 120, align: 'right', sortable: true },
  { field: 'performance', title: '绩效', width: 100, align: 'right', sortable: true },
  {
    field: 'actions',
    title: '操作',
    width: 100,
    fixed: 'right',
    type: 'html',
    render: ({ item }) => h('button', { onClick: () => view(item) }, '详情'),
  },
]
</script>
```
:::

## 行/单元格点击事件

监听 `row-click`、`cell-click` 和 `scroll` 事件。

<div class="demo-block">
  <div class="demo-toolbar">
    <span v-if="eventLog.length" class="demo-tag demo-tag--blue">{{ eventLog[0] }}</span>
    <span v-else class="demo-tag">点击表格查看事件</span>
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

::: details 查看完整代码
```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.floor(Math.random() * 1000),
    text: `Item ${i} - 描述文本`,
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '名称', width: 200 },
  { field: 'value', title: '数值', width: 120, align: 'right' },
  { field: 'text', title: '描述', width: 300 },
]

const eventLog = ref([])
function onRowClick(item, index) {
  eventLog.value = [`row-click: 第 ${index} 行, name=${item.name}`]
}
function onCellClick(item, index, column) {
  eventLog.value = [`cell-click: 第 ${index} 行, 列=${column.title}`]
}

const scrollOffset = ref(0)
function onScroll(offset) {
  scrollOffset.value = offset
}
</script>
<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="300"
    @row-click="onRowClick"
    @cell-click="onCellClick"
    @scroll="onScroll"
  />
</template>
```
:::

## Canvas + HTML 混合渲染（VNode）

核心能力：`type: 'html'` 的列通过 HTML 覆盖层渲染真实组件，其余列由 Canvas 绘制。`render` 函数返回 VNode。

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag demo-tag--blue">已选中 {{ selectedIds.size }} 项</span>
    <span v-if="editingId" class="demo-tag demo-tag--green">编辑 ID: {{ editingId }}</span>
  </div>
  <CanvasVirtualList
    :columns="hybridColumns"
    :items="hybridItems"
    :height="460"
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref, h } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(/* ... */)
const selectedIds = ref(new Set())

const columns = [
  {
    field: 'id', title: '', width: 48,
    type: 'html', align: 'center',
    render: ({ item }) => h('input', {
      type: 'checkbox',
      checked: selectedIds.value.has(item.id),
      onChange: () => toggleSelect(item.id),
    }),
  },
  { field: 'id', title: 'ID', width: 72, align: 'center' },
  { field: 'name', title: '姓名', width: 140 },
  {
    field: 'status', title: '状态', width: 110,
    type: 'html', align: 'center',
    render: ({ item }) => h('span', { ... }, statusText),
  },
  {
    field: 'actions', title: '操作', width: 180,
    type: 'html', align: 'center',
    render: ({ item }) => h('div', {}, [
      h('button', { onClick: () => edit(item) }, '编辑'),
      h('button', { onClick: () => del(item) }, '删除'),
    ]),
  },
]
</script>
```
:::

## HTML 字符串渲染

`render` 函数也支持直接返回 HTML 字符串，适合简单的标签、徽章等场景，无需 `h()` 函数。

<div class="demo-block">
  <CanvasVirtualList
    :columns="htmlStringColumns"
    :items="htmlStringItems"
    :height="380"
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '产品名称', width: 200 },
  {
    field: 'tag',
    title: '标签',
    width: 140,
    type: 'html',
    align: 'center',
    // render 返回 HTML 字符串
    render: ({ value }) => {
      return `<span style="
        padding: 2px 10px;
        border-radius: 4px;
        font-size: 12px;
        color: #409eff;
        background: #ecf5ff;
      ">${value}</span>`
    },
  },
  {
    field: 'level',
    title: '优先级',
    width: 120,
    type: 'html',
    align: 'center',
    render: ({ value }) => {
      const color = { '高': '#f56c6c', '中': '#e6a23c', '低': '#67c23a' }[value]
      return `<span style="color:${color}">● ${value}</span>`
    },
  },
]
</script>
```
:::

## 组件渲染

通过 `component` 直接传入 Vue 组件，无需编写 `render` 和 `h()`。组件会收到 `CellRenderParams` 作为 props，`componentProps` 传递额外参数。

<div class="demo-block">
  <CanvasVirtualList
    :columns="componentColumns"
    :items="componentItems"
    :height="380"
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref, h, defineComponent } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

// 自定义评分组件
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
            color: i <= val ? '#e6a23c' : '#c0c4cc',
          },
        }, '★'))
      }
      return h('span', {}, stars)
    }
  },
})

// 自定义开关组件
const SwitchToggle = defineComponent({
  props: {
    item: Object,
    value: [Boolean, Number, String],
  },
  setup(props) {
    const active = ref(!!props.value)
    return () => h('span', {
      onClick: () => { active.value = !active.value },
      style: {
        width: '40px', height: '20px',
        borderRadius: '10px',
        backgroundColor: active.value ? '#409eff' : '#dcdfe6',
      },
    }, /* ... */)
  },
})

const columns = [
  { field: 'id', title: 'ID', width: 72 },
  { field: 'name', title: '商品名称', width: 180 },
  { field: 'price', title: '价格', width: 100, align: 'right' },
  {
    field: 'rating',
    title: '评分',
    width: 140,
    type: 'html',
    align: 'center',
    // 直接传组件，不需要 render + h()
    component: RateStars,
    // 额外 props
    componentProps: { max: 5 },
  },
  {
    field: 'enabled',
    title: '状态',
    width: 100,
    type: 'html',
    align: 'center',
    component: SwitchToggle,
  },
]
</script>
```
:::

## 进度条

`type: 'html'` 可以渲染任意 HTML，例如带颜色的进度条。

<div class="demo-block">
  <CanvasVirtualList
    :columns="progressColumns"
    :items="progressItems"
    :height="400"
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref, h } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(
  Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    task: `任务 ${i + 1}`,
    progress: Math.floor(Math.random() * 100),
    assignee: ['张三', '李四', '王五', '赵六'][i % 4],
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 72, align: 'center' },
  { field: 'task', title: '任务名称', width: 180 },
  { field: 'assignee', title: '负责人', width: 100, align: 'center' },
  {
    field: 'progress',
    title: '进度',
    width: 260,
    type: 'html',
    render: ({ item }) => {
      const pct = item.progress
      const color = pct >= 80 ? '#67c23a' : pct >= 50 ? '#e6a23c' : '#f56c6c'
      return h('div', {
        style: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%' },
      }, [
        h('div', {
          style: { flex: '1', height: '6px', backgroundColor: '#ebeef5', borderRadius: '3px', overflow: 'hidden' },
        }, [
          h('div', {
            style: { width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: '3px' },
          }),
        ]),
        h('span', { style: { fontSize: '12px', color: '#909399', minWidth: '38px', textAlign: 'right' } }, `${pct}%`),
      ])
    },
  },
]
</script>
<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="400"
  />
</template>
```
:::

## 滚动加载

滚动到底部自动触发 `load-more` 事件。传入 `loading` 后底部显示旋转加载动画，`loading-text` 自定义文案。

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">已加载 {{ loadMoreTotal }} 条</span>
    <span v-if="loadMoreLoading" class="demo-tag demo-tag--orange">加载中...</span>
  </div>
  <CanvasVirtualList
    :columns="loadMoreColumns"
    :items="loadMoreItems"
    :height="380"
    :loading="loadMoreLoading"
    :load-more-threshold="200"
    loading-text="正在加载更多数据..."
    @load-more="onLoadMore"
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(generateBatch(0, 200))
const loading = ref(false)

function onLoadMore() {
  if (loading.value) return
  loading.value = true
  setTimeout(() => {
    items.value = [
      ...items.value,
      ...generateBatch(items.value.length, 200),
    ]
    loading.value = false
  }, 800)
}
</script>
<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="380"
    :loading="loading"
    :load-more-threshold="200"
    loading-text="正在加载更多数据..."
    @load-more="onLoadMore"
  />
</template>
```
:::

## 行选择（多选）

设置 `selection-mode="multiple"` 开启多选，点击行切换选中状态。选中行以蓝色背景高亮。

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag demo-tag--blue">已选中 {{ multiSelectedKeys.length }} 项</span>
    <button class="demo-btn" @click="multiTableRef?.selectAll()">全选</button>
    <button class="demo-btn" @click="multiTableRef?.clearSelection()">清空</button>
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

::: details 查看完整代码
```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const tableRef = ref()
const selectedKeys = ref([])

const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '姓名', width: 180 },
  { field: 'dept', title: '部门', width: 150 },
  { field: 'role', title: '职位', width: 150 },
]

function onSelectionChange(keys) {
  selectedKeys.value = keys
}
</script>
<template>
  <button @click="tableRef.selectAll()">全选</button>
  <button @click="tableRef.clearSelection()">清空</button>
  <CanvasVirtualList
    ref="tableRef"
    :columns="columns"
    :items="items"
    :height="380"
    row-key="id"
    selection-mode="multiple"
    striped
    @selection-change="onSelectionChange"
  />
</template>
```
:::

## 行选择（单选）

`selection-mode="single"` 模式下，点击新行自动取消上一行的选中。

<div class="demo-block">
  <div class="demo-toolbar">
    <span v-if="singleSelectedKeys.length" class="demo-tag demo-tag--blue">选中 ID: {{ singleSelectedKeys[0] }}</span>
    <span v-else class="demo-tag">点击行选择</span>
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

::: details 查看完整代码
```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `员工 ${i + 1}`,
    dept: ['研发部', '产品部', '设计部', '运营部', '市场部'][i % 5],
    role: ['工程师', '经理', '总监', '实习生'][i % 4],
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '姓名', width: 180 },
  { field: 'dept', title: '部门', width: 150 },
  { field: 'role', title: '职位', width: 150 },
]

const selectedKeys = ref([])
function onSelectionChange(keys) {
  selectedKeys.value = keys
}
</script>
<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="380"
    row-key="id"
    selection-mode="single"
    @selection-change="onSelectionChange"
  />
</template>
```
:::

## scrollTo API

通过 `scrollToRow(index, align)` 精确定位到指定行。支持 `start`、`center`、`end` 三种对齐方式。

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">10000 条数据</span>
    <label style="font-size: 13px; color: #606266">
      跳转到第
      <input
        v-model.number="jumpIndex"
        type="number"
        min="1"
        max="10000"
        style="width: 70px; padding: 2px 6px; border: 1px solid #dcdfe6; border-radius: 4px; font-size: 13px"
      />
      行
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

::: details 查看完整代码
```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const tableRef = ref()
const items = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `记录 ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
  }))
)

function jumpTo(index, align) {
  tableRef.value.scrollToRow(index, align)
}
</script>
<template>
  <button @click="jumpTo(4999, 'start')">start</button>
  <button @click="jumpTo(4999, 'center')">center</button>
  <button @click="jumpTo(4999, 'end')">end</button>
  <CanvasVirtualList
    ref="tableRef"
    :columns="columns"
    :items="items"
    :height="380"
    striped
  />
</template>
```
:::

## 列拖拽调宽

拖动表头右侧边缘可调整列宽。设置 `resizable: true` 启用，支持 `minWidth` / `maxWidth` 约束。

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">拖动表头边缘调整列宽</span>
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

::: details 查看完整代码
```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const columns = ref([
  { field: 'id', title: 'ID', width: 80, resizable: true, minWidth: 50, maxWidth: 150 },
  { field: 'name', title: '姓名', width: 150, resizable: true, minWidth: 80 },
  { field: 'email', title: '邮箱', width: 250, resizable: true, minWidth: 120 },
  { field: 'dept', title: '部门', width: 120, resizable: true, minWidth: 80 },
  { field: 'role', title: '职位', width: 120, resizable: true, minWidth: 80 },
])

function onColumnResize(colIndex, width) {
  console.log(`列 ${colIndex} 宽度变为 ${width}px`)
}
</script>
<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="380"
    striped
    @column-resize="onColumnResize"
  />
</template>
```
:::

## 自定义表头渲染

设置 `headerType: 'html'` 后，该列表头由 HTML 覆盖层渲染，支持 `headerRender` 返回 VNode 或 `headerComponent` 传入组件。适合在表头放筛选器、图标等交互元素。

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">表头内嵌筛选器</span>
    <span class="demo-tag demo-tag--blue">{{ filteredHeaderItems.length }} 条</span>
  </div>
  <CanvasVirtualList
    :columns="headerRenderColumns"
    :items="filteredHeaderItems"
    :height="380"
    striped
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref, h, computed } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const filterValue = ref('')
const items = ref([/* ... */])

const filteredItems = computed(() => {
  if (!filterValue.value) return items.value
  return items.value.filter((item) => item.dept.includes(filterValue.value))
})

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名', width: 150 },
  {
    field: 'dept',
    title: '部门',
    width: 180,
    headerType: 'html',
    headerRender: ({ column }) => h('div', {
      style: { display: 'flex', alignItems: 'center', gap: '6px', width: '100%' },
    }, [
      h('span', {}, column.title),
      h('input', {
        type: 'text',
        placeholder: '筛选...',
        value: filterValue.value,
        onInput: (e) => { filterValue.value = e.target.value },
        style: { flex: '1', padding: '2px 6px', border: '1px solid #dcdfe6', borderRadius: '3px' },
      }),
    ]),
  },
  { field: 'role', title: '职位', width: 120 },
  {
    field: 'status',
    title: '状态',
    width: 120,
    headerType: 'html',
    headerRender: ({ column }) => h('div', {
      style: { display: 'flex', alignItems: 'center', gap: '4px' },
    }, [
      h('span', { style: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#67c23a' } }),
      h('span', {}, column.title),
    ]),
  },
]
</script>
<template>
  <CanvasVirtualList
    :columns="columns"
    :items="filteredItems"
    :height="380"
    striped
  />
</template>
```
:::

## 树形数据

设置 `children-field` 指定子节点字段，点击展开箭头切换子行显示。支持多层嵌套、默认全部展开。

<div class="demo-block">
  <div class="demo-toolbar">
    <span class="demo-tag">组织架构</span>
    <span class="demo-tag demo-tag--blue">已展开 {{ treeExpandedKeys.length }} 个节点</span>
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

::: details 查看完整代码
```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref([
  {
    id: 1,
    name: '研发中心',
    budget: 500000,
    head: '张总',
    children: [
      {
        id: 11,
        name: '前端组',
        budget: 200000,
        head: '李经理',
        children: [
          { id: 111, name: 'Vue 项目', budget: 80000, head: '王工' },
          { id: 112, name: 'React 项目', budget: 70000, head: '赵工' },
        ],
      },
      { id: 12, name: '后端组', budget: 180000, head: '刘经理' },
    ],
  },
  // ...
])

const columns = [
  { field: 'name', title: '部门 / 项目', width: 250 },
  { field: 'head', title: '负责人', width: 120 },
  { field: 'budget', title: '预算', width: 120, align: 'right' },
]

function onExpandChange(keys) {
  console.log('展开节点:', keys)
}
</script>
<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="400"
    children-field="children"
    default-expand-all
    row-key="id"
    striped
    @expand-change="onExpandChange"
  />
</template>
```
:::

## 右键菜单

右键点击行触发 `context-menu` 事件，返回行数据、列信息和鼠标坐标。菜单 UI 完全由用户自定义渲染。

<div class="demo-block" @click="closeCtxMenu" style="position: relative">
  <div class="demo-toolbar">
    <span class="demo-tag">右键点击行打开菜单</span>
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
    <div class="ctx-menu-item" @click.stop="ctxAction('打开')">📂 打开</div>
    <div class="ctx-menu-item" @click.stop="ctxAction('复制')">📋 复制</div>
    <div class="ctx-menu-item" @click.stop="ctxAction('重命名')">✏️ 重命名</div>
    <div class="ctx-menu-divider" />
    <div class="ctx-menu-item ctx-menu-item--danger" @click.stop="ctxAction('删除')">🗑️ 删除</div>
  </div>
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

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
</script>
<template>
  <div @click="menuVisible = false" style="position: relative">
    <CanvasVirtualList
      :columns="columns"
      :items="items"
      :height="380"
      @context-menu="onContextMenu"
    />
    <!-- 自定义菜单 -->
    <div
      v-if="menuVisible"
      :style="{
        position: 'fixed',
        left: menuPos.x + 'px',
        top: menuPos.y + 'px',
        background: '#fff',
        border: '1px solid #ebeef5',
        borderRadius: '4px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        padding: '4px 0',
        zIndex: 1000,
      }"
    >
      <div @click="doAction('打开')">打开</div>
      <div @click="doAction('复制')">复制</div>
      <div @click="doAction('删除')">删除</div>
    </div>
  </div>
</template>
```
:::

## 暗色主题

通过 `theme` prop 自定义全部色彩，支持 14 个 token。

<div class="demo-block demo-block--dark">
  <CanvasVirtualList
    :columns="columns"
    :items="demoItems"
    :height="380"
    :theme="darkTheme"
    striped
  />
</div>

::: details 查看 Theme 配置
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

## 空状态

数据为空时自动展示空状态占位。

<div class="demo-block">
  <CanvasVirtualList
    :columns="emptyColumns"
    :items="emptyItems"
    :height="280"
  />
</div>

::: details 查看完整代码
```vue
<script setup>
import { ref } from 'vue'
import { CanvasVirtualList } from 'canvas-vue-table'

const items = ref([])

const columns = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  { field: 'name', title: '名称', width: 200 },
  { field: 'status', title: '状态', width: 120 },
]
</script>
<template>
  <CanvasVirtualList
    :columns="columns"
    :items="items"
    :height="280"
  />
</template>
```
:::

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
