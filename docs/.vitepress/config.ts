import { defineConfig } from 'vitepress'
import { resolve } from 'path'

export default defineConfig({
  base: '/canvas-vue-table/',
  title: 'Canvas Vue Table',
  description: '基于 Canvas 的高性能 Vue 3 虚拟列表组件库',
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
  vite: {
    resolve: {
      alias: {
        'canvas-vue-table': resolve(__dirname, '../../src/index.ts'),
      },
    },
  },
})
