#!/bin/bash

# Archived: 原 AWS S3 部署脚本 - 用于上传到 S3 并清除 CloudFront 缓存
# 已归档到 deploy/archive/，保留以便审计

set -e  # 任何错误就退出

# 配置变量
S3_BUCKET="${AWS_S3_BUCKET:-}"
CLOUDFRONT_DISTRIBUTION_ID="${AWS_CLOUDFRONT_DISTRIBUTION_ID:-}"
AWS_REGION="${AWS_REGION:-us-east-1}"
BUILD_DIR="dist"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查环境变量
check_env() {
  if [ -z "$S3_BUCKET" ]; then
    echo -e "${RED}❌ 错误: 未设置 AWS_S3_BUCKET 环境变量${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ S3 Bucket: $S3_BUCKET${NC}"
}

# 检查构建文件
check_build() {
  if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${YELLOW}⚠️  构建目录不存在，开始构建...${NC}"
    pnpm build
  else
    echo -e "${GREEN}✅ 构建文件已存在${NC}"
  fi
}

# 上传到 S3
upload_to_s3() {
  echo -e "${YELLOW}📤 上传文件到 S3...${NC}"
  
  aws s3 sync "$BUILD_DIR" "s3://$S3_BUCKET" \
    --region "$AWS_REGION" \
    --delete \
    --cache-control "public, max-age=3600" \
    --exclude "*.html" \
    --exclude "*.json"
  
  # 不缓存 HTML 和 JSON 文件
  aws s3 cp "$BUILD_DIR/index.html" "s3://$S3_BUCKET/index.html" \
    --region "$AWS_REGION" \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "text/html"
  
  # 上传其他 HTML 文件（如果有）
  find "$BUILD_DIR" -name "*.html" ! -name "index.html" -exec \
    aws s3 cp {} "s3://$S3_BUCKET/{}" \
    --region "$AWS_REGION" \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "text/html" \;
  
  echo -e "${GREEN}✅ 文件上传完成${NC}"
}

# 清除 CloudFront 缓存
invalidate_cloudfront() {
  if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}⚠️  未设置 CloudFront Distribution ID，跳过缓存清除${NC}"
    return
  fi
  
  echo -e "${YELLOW}🔄 清除 CloudFront 缓存...${NC}"
  
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*" \
    --region "$AWS_REGION"
  
  echo -e "${GREEN}✅ CloudFront 缓存已清除${NC}"
}

# 主函数
main() {
  echo -e "${YELLOW}🚀 启动 AWS 部署流程${NC}"
  echo "---"
  
  check_env
  check_build
  upload_to_s3
  invalidate_cloudfront
  
  echo "---"
  echo -e "${GREEN}🎉 部署完成！${NC}"
  echo -e "${GREEN}网站已发布到: https://$S3_BUCKET.s3.$AWS_REGION.amazonaws.com${NC}"
}

main
