# 自动化测试指南

## 概述

本项目使用 **Vitest** 作为测试框架，**React Testing Library** 作为 React 组件测试库。

## 安装的依赖

- `vitest`: 现代化的 Vite 测试框架
- `@vitest/ui`: Vitest UI 界面
- `@testing-library/react`: React 组件测试库
- `@testing-library/jest-dom`: Jest DOM 匹配器
- `@testing-library/user-event`: 用户交互模拟
- `jsdom`/`happy-dom`: DOM 环境实现

## 项目结构

```
src/
├── __tests__/                 # 测试文件目录
│   ├── Home.test.tsx         # Home 页面测试
│   ├── Button.test.tsx       # Button 组件测试
│   └── ...                   # 其他测试文件
├── app/
│   ├── components/           # React 组件
│   ├── pages/               # 页面组件
│   └── ...
└── ...
```

## NPM 脚本

### 运行测试

```bash
pnpm test
```

在 watch 模式下运行所有测试。

### 运行测试 UI

```bash
pnpm test:ui
```

在浏览器中打开 Vitest UI 界面，可视化查看测试结果。

### 生成覆盖率报告

```bash
pnpm test:coverage
```

生成代码覆盖率报告并保存到 `coverage/` 目录。

## 编写测试

### 基本测试示例

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyComponent from '@/path/to/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText(/expected text/i)).toBeInTheDocument()
  })
})
```

### 测试用户交互

```typescript
import userEvent from '@testing-library/user-event'

it('should handle clicks', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()

  render(<Button onClick={handleClick}>Click</Button>)
  await user.click(screen.getByRole('button'))

  expect(handleClick).toHaveBeenCalled()
})
```

### 测试异步操作

```typescript
import { waitFor } from '@testing-library/react'

it('should load data', async () => {
  render(<DataComponent />)

  await waitFor(() => {
    expect(screen.getByText(/loaded/i)).toBeInTheDocument()
  })
})
```

## 配置文件

- `vitest.config.ts`: Vitest 配置
  - 配置测试环境（happy-dom）
  - 设置别名（@ -> src）
  - 配置覆盖率选项

- `vitest.setup.ts`: 测试环境设置
  - 导入 `@testing-library/jest-dom` 用于扩展匹配器
  - 配置全局 mock 和环境变量

## 最佳实践

1. **测试文件位置**: 将测试文件放在 `src/__tests__/` 目录下，或在组件同目录使用 `.test.tsx` 后缀

2. **命名约定**: 使用 `ComponentName.test.tsx` 格式

3. **测试覆盖**: 优先测试用户可见的行为，而不是实现细节

4. **使用 Testing Library**: 推荐使用 `getByRole`、`getByText` 等，避免依赖实现细节

5. **异步测试**: 使用 `waitFor` 处理异步操作，使用 `findBy*` 查询

## 常用的 API

### Vitest

- `describe()`: 分组测试
- `it()` / `test()`: 定义单个测试
- `expect()`: 进行断言
- `vi.fn()`: 创建 mock 函数
- `vi.mock()`: mock 模块

### React Testing Library

- `render()`: 渲染组件
- `screen`: 查询 DOM 元素
- `getByRole()`, `getByText()`: 查询元素
- `findBy*()`: 异步查询元素
- `waitFor()`: 等待异步操作

## 文件链接

- 配置文件: [vitest.config.ts](vitest.config.ts)
- 设置文件: [vitest.setup.ts](vitest.setup.ts)
- 示例测试 - Home 页面: [src/**tests**/Home.test.tsx](src/__tests__/Home.test.tsx)
- 示例测试 - Button 组件: [src/**tests**/Button.test.tsx](src/__tests__/Button.test.tsx)
