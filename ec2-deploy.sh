#!/bin/bash
# EC2 部署脚本 - 前端静态站点（Nginx）
# 适用于 Ubuntu 22.04+，需 root 权限

set -e

# 1. 安装 Node.js & pnpm
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pnpm

# 2. 安装 Nginx
apt-get update
apt-get install -y nginx

# 3. 构建前端项目
cd /home/ubuntu/xia-dao-gu  # 请根据实际路径修改
pnpm install
pnpm build

# 4. 部署到 Nginx
rm -rf /var/www/html/*
cp -r dist/* /var/www/html/

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
