import { defineConfig } from 'vitepress'
import { resolve } from 'path'

export default defineConfig({
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
