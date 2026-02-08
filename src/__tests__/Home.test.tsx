import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { Home } from "@/app/pages/Home";

describe("Home Page", () => {
  it("should render without crashing", () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
    expect(container).toBeInTheDocument();
  });

  it("should display the page content", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
    // 确保页面内容被渲染
    const content = document.body.textContent;
    expect(content?.length || 0).toBeGreaterThan(0);
  });

  it("should have learning modules", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
    // 检查是否渲染了学习模块
    const moduleElements = screen.queryAllByText(/词汇|语法|阅读|听力/);
    expect(moduleElements.length).toBeGreaterThan(0);
  });
});
