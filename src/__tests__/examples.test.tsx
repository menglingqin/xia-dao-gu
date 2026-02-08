import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

/**
 * 异步操作测试示例
 * 演示如何测试带有异步操作的组件
 */
describe("异步操作测试示例", () => {
  it("应该在等待后显示数据", async () => {
    // 模拟一个会延迟返回数据的组件
    const TestComponent = () => {
      const [data, setData] = React.useState<string | null>(null);
      const [loading, setLoading] = React.useState(true);

      React.useEffect(() => {
        const timer = setTimeout(() => {
          setData("加载完成！");
          setLoading(false);
        }, 100);

        return () => clearTimeout(timer);
      }, []);

      if (loading) return <div>加载中...</div>;
      return <div>{data}</div>;
    };

    const { rerender } = render(<TestComponent />);

    // 首先应该显示加载文本
    expect(screen.getByText(/加载中/)).toBeInTheDocument();

    // 等待数据加载完成
    await waitFor(() => {
      expect(screen.getByText(/加载完成/)).toBeInTheDocument();
    });
  });

  it("应该处理用户输入", async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const [value, setValue] = React.useState("");

      return (
        <div>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="输入文本"
          />
          <div>{value && `你输入了: ${value}`}</div>
        </div>
      );
    };

    render(<TestComponent />);

    const input = screen.getByPlaceholderText("输入文本");

    // 用户输入
    await user.type(input, "Hello");

    // 验证输入被处理
    await waitFor(() => {
      expect(screen.getByText("你输入了: Hello")).toBeInTheDocument();
    });
  });
});

/**
 * Mock 函数测试示例
 */
describe("Mock 函数测试", () => {
  it("应该监听函数调用", () => {
    const mockFn = vi.fn();
    mockFn("test");

    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledWith("test");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("应该 mock 返回值", () => {
    const mockFn = vi.fn().mockReturnValue("mocked value");

    const result = mockFn();

    expect(result).toBe("mocked value");
  });
});

/**
 * Vitest 生命周期钩子示例
 */
describe("生命周期钩子", () => {
  beforeEach(() => {
    // 每个测试前执行
    console.log("测试前准备");
  });

  it("第一个测试", () => {
    expect(true).toBe(true);
  });

  it("第二个测试", () => {
    expect(1 + 1).toBe(2);
  });
});
