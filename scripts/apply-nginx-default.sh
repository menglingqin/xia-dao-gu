#!/bin/bash
# 将仓库中的默认 Nginx 配置应用到系统（需 sudo）
set -e
SRC="$(pwd)/deploy/nginx-default.conf"
DEST="/etc/nginx/sites-available/default"

if [ ! -f "$SRC" ]; then
  echo "源文件不存在: $SRC"
  exit 1
fi

echo "备份现有配置到 ${DEST}.bak"
sudo cp -v "$DEST" "${DEST}.bak" || true

echo "拷贝新的配置"
sudo cp -v "$SRC" "$DEST"

echo "测试 Nginx 配置"
sudo nginx -t

echo "重载 Nginx"
sudo systemctl reload nginx

echo "已应用新的 Nginx 默认配置。"
