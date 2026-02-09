#!/bin/bash
# EC2 部署脚本 - 前端静态站点（Nginx）
# 适用于 Ubuntu 22.04+，需 root 权限

set -e
# 可配置部署目录：优先使用第一个脚本参数，其次使用环境变量 `DEPLOY_DIR`，否则回退到默认路径
DEPLOY_DIR="${1:-${DEPLOY_DIR:-/home/ubuntu/xia-dao-gu}}"
echo "Using DEPLOY_DIR=${DEPLOY_DIR}"
if [ ! -d "$DEPLOY_DIR" ]; then
    echo "❌ 部署目录不存在: $DEPLOY_DIR"
    exit 1
fi

# 1. 安装 Node.js & pnpm
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pnpm

# 2. 安装 Nginx
apt-get update
apt-get install -y nginx

# 3. 构建前端项目
cd "$DEPLOY_DIR"
pnpm install
pnpm build

# 4. 部署到 Nginx
# 4. 部署到 Nginx
rm -rf /var/www/html/*
cp -r dist/* /var/www/html/
chown -R www-data:www-data /var/www/html || true

# 5. 配置 Nginx
cat > /etc/nginx/sites-available/default <<EOF
server {
    listen 80;
    server_name _;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 6. 启动 Nginx
systemctl restart nginx
systemctl enable nginx

# 7. 输出结果
## 获取实例 IP（支持 IMDSv2），带多重回退
# 使用短超时以防止脚本长时间阻塞
TOKEN=$(curl -m 2 -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" || true)
if [ -n "$TOKEN" ]; then
    IP=$(curl -m 2 -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4 || true)
else
    IP=$(curl -m 2 -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || true)
fi

if [ -n "$IP" ]; then
    echo "✅ 部署完成！访问: http://$IP/"
else
    # 回退到私有 IP（如果没有公网 IP）
    LOCAL_IP=$(curl -m 2 -s http://169.254.169.254/latest/meta-data/local-ipv4 2>/dev/null || true)
    if [ -n "$LOCAL_IP" ]; then
        echo "✅ 部署完成！实例无公网 IP，私有 IP: http://$LOCAL_IP/（仅在同一 VPC/内网可访问）"
    else
        echo "✅ 部署完成！无法从实例元数据获取 IP。请检查实例是否有公网 IP，或元数据服务 IMDSv2 访问是否被限制。"
    fi
fi
