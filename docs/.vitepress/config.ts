import { defineConfig } from 'vitepress'
import { resolve } from 'path'

export default defineConfig({
  base: '/canvas-vue-table/',
  title: 'Canvas Vue Table',
  description: '基于 Canvas 的高性能 Vue 3 虚拟列表组件库',
  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '指南', link: '/guide/' },
          { text: '示例', link: '/examples/' },
        ],
        sidebar: [
          {
            text: '指南',
            items: [
              { text: '介绍', link: '/guide/' },
              { text: '快速开始', link: '/guide/getting-started' },
              { text: '固定列', link: '/guide/fixed-columns' },
              { text: '排序', link: '/guide/sorting' },
              { text: '行选择', link: '/guide/selection' },
              { text: 'scrollTo API', link: '/guide/scroll-to' },
              { text: '列拖拽调宽', link: '/guide/column-resize' },
              { text: '自定义表头渲染', link: '/guide/custom-header' },
              { text: '树形数据', link: '/guide/tree-data' },
              { text: '右键菜单', link: '/guide/context-menu' },
              { text: '单元格编辑', link: '/guide/cell-edit' },
              { text: '导出 CSV', link: '/guide/export-csv' },
            ],
          },
          {
            text: '示例',
            items: [
              { text: '全部示例', link: '/examples/' },
            ],
          },
        ],
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      description: 'A high-performance Vue 3 virtual list component library based on Canvas',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide/' },
          { text: 'Examples', link: '/en/examples/' },
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Introduction', link: '/en/guide/' },
              { text: 'Getting Started', link: '/en/guide/getting-started' },
              { text: 'Fixed Columns', link: '/en/guide/fixed-columns' },
              { text: 'Sorting', link: '/en/guide/sorting' },
              { text: 'Row Selection', link: '/en/guide/selection' },
              { text: 'scrollTo API', link: '/en/guide/scroll-to' },
              { text: 'Column Resize', link: '/en/guide/column-resize' },
              { text: 'Custom Header', link: '/en/guide/custom-header' },
              { text: 'Tree Data', link: '/en/guide/tree-data' },
              { text: 'Context Menu', link: '/en/guide/context-menu' },
              { text: 'Cell Editing', link: '/en/guide/cell-edit' },
              { text: 'Export CSV', link: '/en/guide/export-csv' },
            ],
          },
          {
            text: 'Examples',
            items: [
              { text: 'All Examples', link: '/en/examples/' },
            ],
          },
        ],
      },
    },
  },
  vite: {
    resolve: {
      alias: {
        'canvas-vue-table': resolve(__dirname, '../../src/index.ts'),
      },
    },
  },
})
