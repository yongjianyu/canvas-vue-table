# Introduction

Canvas Vue Table is a high-performance virtual list/table component library designed for Vue 3, using Canvas for rendering, suitable for massive data display scenarios such as tables and lists. It adopts Element Plus design style by default.

## Features

- **Canvas Rendering**: Does not rely on DOM for cell rendering, outstanding performance
- **Canvas + HTML Hybrid Rendering**: `type: 'html'` columns render real DOM components (buttons, inputs, switches, etc.) through an overlay layer
- **Virtual Scrolling**: Only renders the visible area, supports smooth scrolling with millions of rows
- **Three Rendering Modes**: `render` returns VNode, HTML string, or directly pass in `component`
- **Auto Wrap & Adaptive Row Height**: Text wraps automatically, row height adjusts based on content
- **Fixed Columns**: `fixed: 'left' | 'right'` freezes columns, stays visible during horizontal scrolling, with automatic shadow separators
- **Sorting**: `sortable: true` to toggle ascending/descending on header click, with built-in sort indicator arrows
- **Row Selection**: Supports single/multiple selection modes, click to highlight rows, provides `selectAll`, `clearSelection` and other methods
- **scrollTo API**: `scrollToRow(index, align)` precisely navigates to a specific row, supports start/center/end alignment
- **Theme System**: 14 tokens for full customization of colors, fonts, matching Element Plus style by default
- **Scroll Loading**: Triggers `load-more` at the bottom, with built-in loading animation
- **Striped & Bordered**: `striped` / `bordered` toggle with one prop
- **Empty State**: Automatically displays placeholder when data is empty
- **Vue 3**: Full Composition API and TypeScript support
- **Lightweight**: Zero runtime dependencies
