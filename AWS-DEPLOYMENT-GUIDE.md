# AWS S3 + CloudFront 部署指南

## 概述

本指南介绍如何将英语学习网站部署到 AWS 的 S3 + CloudFront，实现全球加速和高可用性。

## 架构说明

```
┌─────────────────┐
│   本地开发      │
├─────────────────┤
│  pnpm build     │
│  dist/          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   GitHub Push   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   GitHub Actions (自动部署)     │
│ ├─ 运行测试                     │
│ ├─ 构建项目                     │
│ └─ 部署到 AWS                   │
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────┐      ┌─────────────────┐
│   AWS S3         │◄─────┤  CloudFront     │
│  (文件存储)      │      │  (全球加速)     │
└──────────────────┘      └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │                 │
                          │   用户访问      │
                          │                 │
                          └─────────────────┘
```

## 前置要求

- ✅ AWS 账户（已有）
- ✅ AWS CLI 已安装和配置
- ✅ GitHub 账户和仓库
- ✅ 项目已推送到 GitHub

## 任务清单

### 第 1 步：创建 S3 Bucket

#### 1.1 通过 AWS 控制台创建

1. 登录 [AWS 管理控制台](https://console.aws.amazon.com/)
2. 搜索 "S3" 服务
3. 点击 "创建存储桶"（Create bucket）
4. 配置：
   - **存储桶名称**: `your-domain-name`（必须全局唯一）
     推荐格式: `english-learning-site`
   - **AWS 区域**: `us-east-1`（推荐用于全球分发）
5. 取消勾选"阻止所有公共访问"
6. 点击创建

#### 1.2 配置 S3 存储桶策略

1. 选择创建的 Bucket
2. 点击 "权限"（Permissions）标签
3. 找到 "存储桶策略"（Bucket Policy）
4. 编辑策略，添加以下内容：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

➡️ **注意**: 将 `YOUR_BUCKET_NAME` 替换为实际的存储桶名称

#### 1.3 启用静态网站托管

1. 选择 Bucket
2. 点击 "属性"（Properties）标签
3. 找到 "静态网站托管"（Static website hosting）
4. 编辑并启用
5. 配置：
   - **索引文档**: `index.html`
   - **错误文档**: `index.html`（重要，用于 SPA 路由）
6. 保存

### 第 2 步：创建 CloudFront 分布

#### 2.1 创建 Distribution

1. 搜索 "CloudFront" 服务
2. 点击 "创建分布"（Create distribution）
3. 选择 "Web" 类型
4. 配置来源：
   - **Origin Domain Name**: `your-bucket.s3.amazonaws.com`
   - **Origin Path**: 留空
   - **HTTP/HTTPS**: 选择 "重定向 HTTP 到 HTTPS"

#### 2.2 配置缓存行为

1. **视图者协议策略**: "重定向 HTTP 到 HTTPS"
2. **允许的 HTTP 方法**: GET, HEAD
3. **缓存策略**: 创建新策略或使用现有的
4. **压缩**: 启用
5. **根对象**: `index.html`

#### 2.3 完成创建

- 点击 "创建分布"
- 等待状态变为"已启用"（通常需要 5-15 分钟）
- 复制分布域名（例如: `d123456.cloudfront.net`）

### 第 3 步：创建 IAM 用户和访问密钥

#### 3.1 创建 IAM 用户

1. 搜索 "IAM" 服务
2. 点击 "用户"（Users）
3. 点击 "创建用户"
4. **用户名**: `github-deployer`
5. 点击 "下一步"

#### 3.2 设置权限

1. 选择 "直接附加权限"（Attach policies directly）
2. 搜索并选择：
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`
3. 点击 "下一步" → "创建用户"

#### 3.3 创建访问密钥

1. 点击刚创建的用户
2. 点击 "安全凭证"（Security credentials）标签
3. 点击 "创建访问密钥"（Create access key）
4. 选择 "AWS CLI" 用例
5. **复制并保存**：
   - Access Key ID
   - Secret Access Key

⚠️ **重要**: 妥善保管这些凭证！

### 第 4 步：配置 GitHub Secrets

1. 进入 GitHub 仓库
2. 点击 "Settings" → "Secrets and variables" → "Actions"
3. 点击 "New repository secret"，添加以下密钥：

| 名称                             | 值                                             | 说明               |
| -------------------------------- | ---------------------------------------------- | ------------------ |
| `AWS_ROLE_TO_ASSUME`             | `arn:aws:iam::ACCOUNT_ID:role/github-deployer` | IAM 角色 ARN       |
| `AWS_S3_BUCKET`                  | `your-bucket-name`                             | S3 存储桶名称      |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | `D123456ABCD`                                  | CloudFront 分布 ID |
| `AWS_CLOUDFRONT_DOMAIN`          | `d123456.cloudfront.net`                       | CloudFront 域名    |
| `AWS_REGION`                     | `us-east-1`                                    | AWS 区域           |

### 第 5 步：本地部署配置

#### 5.1 安装 AWS CLI

```bash
# macOS (使用 Homebrew)
brew install awscli

# 或通过 pip
pip install awscliv2
```

#### 5.2 配置 AWS 凭证

```bash
aws configure

# 输入以下内容：
# AWS Access Key ID: [您的 Access Key]
# AWS Secret Access Key: [您的 Secret Key]
# Default region name: us-east-1
# Default output format: json
```

#### 5.3 测试配置

```bash
aws s3 ls

# 应该输出您的存储桶列表
```

## 部署

### 方式 1：GitHub Actions 自动部署（推荐）

**优点**:

- 自动运行测试
- 每次 push main 分支时自动部署
- 无需本地 AWS 凭证

**步骤**:

```bash
# 提交并推送代码
git add .
git commit -m "更新内容"
git push origin main

# GitHub Actions 自动部署
# → 运行测试 → 构建 → 上传 S3 → 清除 CloudFront 缓存
```

### 方式 2：本地手动部署

#### 2.1 使用 Shell 脚本（推荐）

```bash
# 设置环境变量
export AWS_S3_BUCKET="your-bucket-name"
export AWS_CLOUDFRONT_DISTRIBUTION_ID="D123456ABCD"
export AWS_REGION="us-east-1"

# 运行部署脚本
chmod +x deploy.sh
./deploy.sh
```

#### 2.2 使用 Python 脚本

```bash
# 安装依赖
pip install boto3

# 设置环境变量
export AWS_S3_BUCKET="your-bucket-name"
export AWS_CLOUDFRONT_DISTRIBUTION_ID="D123456ABCD"
export AWS_REGION="us-east-1"

# 运行脚本
python deploy.py
```

#### 2.3 使用 npm 脚本

```bash
# 在 package.json 中添加脚本后
pnpm run deploy
```

## 验证部署

### 检查 S3 上传

```bash
# 列出 S3 中的文件
aws s3 ls s3://your-bucket-name --recursive
```

### 检查 CloudFront 分布

```bash
# 查看分布状态
aws cloudfront get-distribution-config --id D123456ABCD
```

### 测试网站访问

1. **S3 直接 URL**: `https://your-bucket-name.s3.amazonaws.com`
2. **CloudFront URL**: `https://d123456.cloudfront.net`
3. **自定义域名**（可选）: `https://your-domain.com`

如果看到 404 错误，检查：

- ✅ index.html 已上传到 S3
- ✅ CloudFront 根对象设置为 index.html
- ✅ S3 存储桶策略允许公开读取

## 配置自定义域名（可选）

### 方式 1：使用 Route 53

1. 在 Route 53 中创建托管区域
2. 创建 A 记录，指向 CloudFront 分布
3. 在 CloudFront 中添加备用域名

### 方式 2：使用第三方 DNS

1. 在域名提示商处创建 CNAME 记录
2. 指向 CloudFront 域名: `d123456.cloudfront.net`

## 成本估算

**免费套餐**（12 个月）：

- S3: 5GB 存储空间 + 20,000 GET 请求
- CloudFront: 1TB 出站流量
- 完全免费！🎉

**付费**：

- S3 超额: $0.023/GB（存储）+ $0.0004/GET 请求
- CloudFront: $0.085/GB（美国）

## 监控和日志

### 启用 S3 访问日志

```bash
aws s3api put-bucket-logging \
  --bucket your-bucket-name \
  --bucket-logging-status file://logging.json
```

### 启用 CloudFront 日志

1. 到 CloudFront 分布设置
2. 启用"标准日志"（Standard Logging）
3. 指定日志 S3 Bucket

## 故障排除

### 问题 1: 访问被拒绝 (403 Forbidden)

**原因**: S3 存储桶策略不正确或未配置

**解决**:

```bash
# 检查存储桶策略
aws s3api get-bucket-policy --bucket your-bucket-name

# 检查权限
aws s3api get-bucket-acl --bucket your-bucket-name
```

### 问题 2: CloudFront 显示 404

**原因**: 根对象未设置或文件未找到

**解决**:

1. 确保 S3 中有 index.html
2. CloudFront 分布的"索引文档"设置为 index.html
3. 清除 CloudFront 缓存

### 问题 3: GitHub Actions 部署失败

**原因**: AWS 凭证错误或权限不足

**解决**:

1. 验证 GitHub Secrets 配置正确
2. 检查 IAM 用户权限
3. 查看 Actions 日志获取详细错误

```bash
# 查看日志
git log --oneline | head -5
```

## 最佳实践

### ✅ 推荐

- 使用 CloudFront 加速全球访问
- 启用 S3 版本控制便于回滚
- 定期备份重要文件
- 监控成本和流量
- 使用 IAM 角色而非长期凭证

### ❌ 避免

- 在代码中存储 AWS 凭证
- 过度宽泛的 S3 存储桶策略
- 禁用 CloudFront 日志和监控
- 存储大型媒体文件在 S3（使用 CDN）

## 环境变量示例

创建 `.env.production` 文件：

```bash
# AWS 配置
AWS_S3_BUCKET=english-learning-site
AWS_CLOUDFRONT_DISTRIBUTION_ID=D123456ABCD
AWS_CLOUDFRONT_DOMAIN=d123456.cloudfront.net
AWS_REGION=us-east-1

# API 端点（如果有）
VITE_API_URL=https://api.example.com
```

## 相关资源

- [AWS S3 官方文档](https://docs.aws.amazon.com/s3/)
- [CloudFront 官方文档](https://docs.aws.amazon.com/cloudfront/)
- [AWS CLI 参考](https://docs.aws.amazon.com/cli/)
- [GitHub Actions + AWS](https://github.com/aws-actions)

## 总结

| 步骤                 | 状态 |
| -------------------- | ---- |
| 创建 S3 Bucket       | ✅   |
| 创建 CloudFront 分布 | ✅   |
| 配置 IAM 用户        | ✅   |
| GitHub Secrets       | ✅   |
| 部署脚本             | ✅   |
| 自动化工作流         | ✅   |

🎉 现在您可以开始部署了！

---

**需要帮助？**

- 查看 GitHub Actions 日志：Settings → Actions → Recent runs
- 检查 S3 控制台上传的文件
- 查看 CloudFront 错误日志
