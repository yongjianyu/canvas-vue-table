# 介绍

Canvas Vue Table 是一个专为 Vue 3 设计的高性能虚拟列表/表格组件库，使用 Canvas 进行渲染，适合表格、列表等海量数据展示场景。默认采用 Element Plus 设计风格。

## 特性

- **Canvas 渲染**：不依赖 DOM 渲染单元格，性能优异
- **Canvas + HTML 混合渲染**：`type: 'html'` 列通过覆盖层渲染真实 DOM 组件（按钮、输入框、开关等）
- **虚拟滚动**：仅渲染可视区域，支持百万级数据流畅滚动
- **三种渲染模式**：`render` 返回 VNode、HTML 字符串，或直接传入 `component`
- **自动换行 & 行高自适应**：文本自动折行，每行高度按内容计算
- **主题系统**：14 个 token 全面定制色彩、字体，默认匹配 Element Plus 风格
- **滚动加载**：滚到底部触发 `load-more`，内置加载动画
- **斑马纹 & 边框**：`striped` / `bordered` 一键切换
- **空状态**：数据为空时自动展示占位图
- **Vue 3**：Composition API、TypeScript 全面支持
- **轻量**：零运行时依赖
