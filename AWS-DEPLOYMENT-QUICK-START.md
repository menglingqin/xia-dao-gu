# AWS 部署快速参考

## 30 秒快速开始

### 首次设置（一次性）

```bash
# 1. 配置 AWS 凭证
aws configure

# 2. 设置环境变量
export AWS_S3_BUCKET="your-bucket-name"
export AWS_CLOUDFRONT_DISTRIBUTION_ID="D123456ABCD"
export AWS_REGION="us-east-1"

# 3. 验证配置
aws s3 ls
```

### 部署代码

```bash
# 方式 1：使用 npm 脚本
pnpm deploy:build

# 方式 2：手动构建和部署
pnpm build
pnpm deploy

# 方式 3：使用 Python 脚本
python deploy.py
```

### GitHub Actions 自动部署

```bash
git add .
git commit -m "更新内容"
git push origin main

# ✅ GitHub Actions 自动部署！
```

## 常见命令

| 命令                       | 作用                 |
| -------------------------- | -------------------- |
| `pnpm build`               | 构建项目             |
| `pnpm deploy`              | 部署到 AWS           |
| `pnpm deploy:build`        | 构建并部署           |
| `pnpm deploy:python`       | 使用 Python 脚本部署 |
| `pnpm test && pnpm deploy` | 测试后部署           |

## AWS CLI 常用命令

```bash
# 列出 S3 中的文件
aws s3 ls s3://bucket-name --recursive

# 同步本地文件到 S3
aws s3 sync dist/ s3://bucket-name --delete

# 查看 CloudFront 分布
aws cloudfront list-distributions

# 清除 CloudFront 缓存
aws cloudfront create-invalidation \
  --distribution-id D123456ABCD \
  --paths "/*"

# 获取 S3 存储桶大小
aws s3 ls s3://bucket-name --summarize --human-readable --recursive
```

## 故障排除

### 问题：部署时"拒绝访问"

```bash
# 检查 AWS 凭证是否配置
aws sts get-caller-identity

# 应该输出：
# {
#     "UserId": "...",
#     "Account": "123456789",
#     "Arn": "arn:aws:iam::123456789:user/github-deployer"
# }
```

### 问题：S3 文件无法访问

```bash
# 检查存储桶策略
aws s3api get-bucket-policy --bucket bucket-name

# 检查存储桶 ACL
aws s3api get-bucket-acl --bucket bucket-name
```

### 问题：CloudFront 返回 404

1. 清除缓存：

```bash
aws cloudfront create-invalidation \
  --distribution-id D123456ABCD \
  --paths "/*"
```

2. 等待分布状态为"已启用"：

```bash
aws cloudfront get-distribution --id D123456ABCD \
  --query 'Distribution.Status'
```

## 环境变量设置

### macOS/Linux

```bash
# 临时设置（只在当前终端会话有效）
export AWS_S3_BUCKET="bucket-name"
export AWS_CLOUDFRONT_DISTRIBUTION_ID="D123456ABCD"

# 永久设置（添加到 ~/.bashrc 或 ~/.zshrc）
echo 'export AWS_S3_BUCKET="bucket-name"' >> ~/.zshrc
source ~/.zshrc
```

### Windows（PowerShell）

```powershell
# 临时设置
$env:AWS_S3_BUCKET = "bucket-name"
$env:AWS_CLOUDFRONT_DISTRIBUTION_ID = "D123456ABCD"

# 永久设置
[System.Environment]::SetEnvironmentVariable('AWS_S3_BUCKET', 'bucket-name', 'User')
```

## 验证部署成功

```bash
# 1. 检查文件是否上传
aws s3 ls s3://bucket-name

# 2. 访问网站
curl -I https://d123456.cloudfront.net

# 应该返回 200 OK

# 3. 检查文件内容
curl https://d123456.cloudfront.net/index.html | head -20
```

## 成本检查

```bash
# 获取当前 S3 存储大小
aws s3 ls s3://bucket-name --summarize --human-readable --recursive | grep "Total Size"

# 预计月成本（美国东部）
# S3 存储: $0.023/GB
# CloudFront: $0.085/GB（出站流量）
```

## GitHub Actions 状态

查看部署状态：

1. 进入仓库 → Actions 标签
2. 查看最新的"部署到 AWS S3 + CloudFront"工作流
3. 检查日志了解详细信息

## 回滚部署

如果部署出现问题，快速回滚：

```bash
# 从 S3 版本控制恢复（需提前启用版本控制）
aws s3api get-object-version-tagging \
  --bucket bucket-name \
  --key index.html

# 或简单地重新部署上一个版本
git revert HEAD
git push origin main
```

## 监控部署

**CloudWatch 监控**:

```bash
# 查看 CloudFront 性能
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name Requests \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

**AWS Billing 告警**:

```bash
# 查看当月成本
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

## 相关文件

- [完整部署指南](AWS-DEPLOYMENT-GUIDE.md)
- [脚本部署工具](deploy.sh)
- [Python 部署工具](deploy.py)
- [自动化 CI/CD](.github/workflows/deploy.yml)

---

**💡 提示**: 将此文件加入书签以便快速查阅！
