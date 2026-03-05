# canvas-vue-table

基于 Canvas 的高性能 Vue 3 虚拟列表组件库，专为海量数据渲染场景设计。

## 项目结构

```
canvas-vue-table/
├── src/                      # 库源码
│   ├── index.ts             # 入口文件
│   ├── components/          # Vue 组件
│   │   └── CanvasVirtualList.vue
│   ├── composables/         # 组合式函数
│   │   └── useVirtualList.ts
│   └── types/               # 类型定义
│       └── index.ts
├── docs/                    # VitePress 文档与示例
│   ├── .vitepress/
│   │   └── config.ts
│   ├── guide/
│   ├── examples/
│   └── index.md
├── dist/                    # 构建输出 (gitignore)
├── package.json
├── vite.config.ts           # 库构建配置
├── vite.demo.config.ts      # 示例开发配置
└── tsconfig.json
```

## 技术栈

| 用途 | 库 | 说明 |
|------|-----|------|
| 框架 | Vue 3 | 核心框架 |
| 构建 | Vite 5 | 快速构建与 HMR |
| 类型 | TypeScript 5 | 类型安全 |
| 渲染 | Canvas API | 原生 Canvas，无需额外库 |
| 声明文件 | vite-plugin-dts | 自动生成 .d.ts |

## 使用方式

```bash
# 安装依赖
pnpm install

# 启动 VitePress 文档与示例
pnpm dev

# 构建文档
pnpm docs:build

# 构建库
pnpm build
```

## API（规划中）

- `CanvasVirtualList` - 虚拟列表组件
- `useVirtualList` - 虚拟列表核心逻辑 composable

## License

MIT
