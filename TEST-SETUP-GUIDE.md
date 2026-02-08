# 自动化测试完整指南

## 项目概述

本项目已配置完整的自动化测试体系，包括：

- ✅ **Vitest** - 现代化 TypeScript 测试框架
- ✅ **React Testing Library** - React 组件测试库
- ✅ **GitHub Actions** - CI/CD 自动化测试
- ✅ **代码覆盖率** - 覆盖率报告生成

## 快速开始

### 运行测试

```bash
# 运行所有测试（watch 模式）
pnpm test

# 运行测试一次
pnpm test -- --run

# 使用 UI 界面查看测试
pnpm test:ui

# 生成代码覆盖率报告
pnpm test:coverage
```

## 项目结构

```
📁 项目根目录
├── 📄 vitest.config.ts           # Vitest 配置
├── 📄 vitest.setup.ts            # 测试环境设置
├── 📁 .github/workflows/
│   └── 📄 test.yml              # GitHub Actions 工作流
└── 📁 src/
    ├── __tests__/               # 测试文件目录
    │   ├── 📄 Home.test.tsx      # Home 页面测试
    │   ├── 📄 Button.test.tsx    # Button 组件测试
    │   ├── 📄 examples.test.tsx  # 高级测试示例
    │   └── 📄 test-utils.tsx     # 测试工具函数
    └── app/
        ├── components/          # React 组件
        └── pages/              # 页面组件
```

## 编写测试

### 1. 基础组件测试

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/app/components/ui/button'

describe('Button 组件', () => {
  it('应该渲染按钮文本', () => {
    render(<Button>点击我</Button>)
    expect(screen.getByRole('button', { name: /点击我/i }))
      .toBeInTheDocument()
  })
})
```

### 2. 用户交互测试

```typescript
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

it('应该处理点击事件', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()

  render(<Button onClick={handleClick}>点击</Button>)
  await user.click(screen.getByRole('button'))

  expect(handleClick).toHaveBeenCalled()
})
```

### 3. 异步操作测试

```typescript
import { waitFor } from '@testing-library/react'

it('应该加载数据', async () => {
  render(<DataComponent />)

  await waitFor(() => {
    expect(screen.getByText(/已加载/i)).toBeInTheDocument()
  })
})
```

### 4. 页面路由测试

```typescript
// 使用 test-utils 中的自定义 render
import { render, screen } from '@/__tests__/test-utils'
import { Home } from '@/app/pages/Home'

it('Home 页面应该渲染', () => {
  render(<Home />)  // 自动包装 BrowserRouter
  expect(document.body).toBeInTheDocument()
})
```

## 命令参考

### npm/pnpm 脚本

| 命令                 | 说明                        |
| -------------------- | --------------------------- |
| `pnpm test`          | Watch 模式运行所有测试      |
| `pnpm test -- --run` | 运行所有测试一次（用于 CI） |
| `pnpm test:ui`       | 在浏览器中打开 Vitest UI    |
| `pnpm test:coverage` | 生成代码覆盖率报告          |

### Vitest CLI 选项

```bash
# 运行特定文件的测试
pnpm test Home.test.tsx

# 只运行匹配名称的测试
pnpm test -- --grep "应该渲染"

# 生成覆盖率并打开报告
pnpm test:coverage

# 使用不同的环境
pnpm test -- --environment=jsdom
```

## 文件说明

### vitest.config.ts

配置 Vitest 框架，包括：

- DOM 环境: `happy-dom`（更快）或 `jsdom`
- 路径别名: `@` → `src`
- 覆盖率选项
- 全局变量启用（如 `describe`、`it`）

### vitest.setup.ts

测试环境初始化文件：

- 导入 `@testing-library/jest-dom`（扩展 expect 匹配器）
- 配置全局 mock
- 设置环境变量

### test-utils.tsx

导出自定义 render 函数，自动为组件包装：

- `BrowserRouter` - 用于需要路由的组件
- 可扩展用于添加其他全局 Provider

## GitHub Actions CI/CD

工作流文件: `.github/workflows/test.yml`

**自动触发场景：**

- ✅ 推送到 `main` 或 `develop` 分支
- ✅ 创建或更新 Pull Request

**工作流步骤：**

1. 检出代码
2. 安装 Node.js (18.x, 20.x)
3. 安装依赖（使用 pnpm）
4. 运行测试
5. 生成覆盖率报告
6. 上传至 Codecov（可选）
7. 构建项目

## 最佳实践

### ✅ 推荐

```typescript
// 1. 测试用户可见的行为
it('用户应该能输入文本', async () => {
  const user = userEvent.setup()
  render(<SearchBox />)

  await user.type(screen.getByRole('textbox'), '搜索')
  expect(screen.getByText('搜索结果')).toBeInTheDocument()
})

// 2. 使用语义化查询
screen.getByRole('button', { name: /确定/i })
screen.getByLabelText('邮箱')
screen.getByPlaceholderText('输入内容')

// 3. 为异步操作等待
await waitFor(() => {
  expect(element).toBeInTheDocument()
})

// 4. 清理状态
beforeEach(() => {
  vi.clearAllMocks()
})
```

### ❌ 避免

```typescript
// 1. 不要测试实现细节
it("should call useState", () => {}); // ❌

// 2. 避免使用私有属性
screen.getByTestId("private-id"); // ❌（除非必要）

// 3. 不要依赖 DOM 结构
wrapper.querySelector(".my-style"); // ❌

// 4. 避免同步等待
const element = screen.getByText("test"); // ❌（可能失败）
```

## 常用断言

### 存在性

```typescript
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeDisabled();
```

### 文本内容

```typescript
expect(screen.getByText(/搜索/i)).toBeInTheDocument();
expect(element).toHaveTextContent("检查此文本");
```

### 表单相关

```typescript
expect(screen.getByRole("textbox")).toHaveValue("input value");
expect(screen.getByRole("checkbox")).toBeChecked();
```

### Mock 函数

```typescript
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(mockFn).toHaveBeenCalledTimes(1);
```

## 测试覆盖率

### 生成报告

```bash
pnpm test:coverage
```

### 查看报告

覆盖率报告生成在 `coverage/` 目录

- `coverage/index.html` - 交互式 HTML 报告
- `coverage/coverage-final.json` - JSON 格式报告

### 覆盖率阈值建议

```json
{
  "lines": 80,
  "functions": 80,
  "branches": 75,
  "statements": 80
}
```

## 常见问题

### Q: 测试运行缓慢

**A:**

- 使用 `happy-dom` 而非 `jsdom`（已配置）
- 减少不必要的 render 调用
- 并行运行测试（Vitest 默认）

### Q: 测试找不到元素

**A:**

- 使用 `screen.debug()` 查看当前 DOM
- 检查元素是否异步渲染，使用 `waitFor` 或 `findBy*`
- 验证选择器语法是否正确

### Q: Mock 模块不工作

**A:**

```typescript
import { vi } from "vitest";

vi.mock("@/utils/api", () => ({
  fetchData: vi.fn(() => Promise.resolve({})),
}));
```

### Q: 样式/CSS 不生效

**A:**

- Happy-DOM 不支持 CSS，仅用于测试 DOM 逻辑
- 如需测试样式，使用 `jsdom` 或 `@testing-library/jest-dom`

## 相关文件链接

- [Vitest 官方文档](https://vitest.dev)
- [React Testing Library 文档](https://testing-library.com/react)
- [Jest DOM 匹配器](https://github.com/testing-library/jest-dom)
- [测试示例](src/__tests__/examples.test.tsx)

## 下一步

1. 👉 为现有组件添加更多测试
2. 📊 设置覆盖率目标
3. 🔗 集成 Codecov 或类似的覆盖率服务
4. 🚀 配置分支保护规则，要求通过测试
5. 📈 定期检查和改进测试质量

---

**需要帮助？** 查看 [examples.test.tsx](src/__tests__/examples.test.tsx) 了解更多高级用法。
