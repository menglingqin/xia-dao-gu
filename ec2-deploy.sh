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
IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo "<EC2 IP>")
echo "✅ 部署完成！访问: http://$IP/"
