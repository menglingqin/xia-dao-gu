#!/usr/bin/env bash
# Optimized EC2 deploy script
# - 更严格的错误处理
# - 日志函数 / 可选项 (--deploy-dir, --dry-run, --skip-self-check)
# - 幂等安装（仅在缺失时安装）

set -euo pipefail
IFS=$'\n\t'

LOG_PREFIX="[ec2-deploy]"
info(){ printf "%s %s\n" "$LOG_PREFIX" "$1"; }
warn(){ printf "%s WARN: %s\n" "$LOG_PREFIX" "$1"; }
err(){ printf "%s ERROR: %s\n" "$LOG_PREFIX" "$1"; }

usage(){
    cat <<EOF
Usage: $0 [--deploy-dir DIR] [--dry-run] [--skip-self-check]

Options:
    --deploy-dir DIR     本地项目路径（默认 /home/ubuntu/xia-dao-gu 或环境变量 DEPLOY_DIR）
    --dry-run            只打印将要执行的操作，不做修改
    --skip-self-check    跳过部署后的自检
    -h|--help            显示此帮助
EOF
}

# 默认值
DEPLOY_DIR="${DEPLOY_DIR:-/home/ubuntu/xia-dao-gu}"
DRY_RUN=false
SKIP_SELF_CHECK=false

# 解析参数
while [[ ${#} -gt 0 ]]; do
    case "$1" in
        --deploy-dir)
            DEPLOY_DIR="$2"; shift 2;;
        --dry-run)
            DRY_RUN=true; shift;;
        --skip-self-check)
            SKIP_SELF_CHECK=true; shift;;
        -h|--help)
            usage; exit 0;;
        *)
            err "未知参数: $1"; usage; exit 2;;
    esac
done

info "Using DEPLOY_DIR=${DEPLOY_DIR}"
if [ ! -d "$DEPLOY_DIR" ]; then
    err "部署目录不存在: $DEPLOY_DIR"
    exit 1
fi

# 需要 root 权限来安装/重载服务
SUDO=""
if [ "$EUID" -ne 0 ]; then
    if command -v sudo >/dev/null 2>&1; then
        SUDO=sudo
        info "未以 root 运行，将使用 sudo 执行需要提升权限的命令"
    else
        err "需要 root 权限或 sudo 可用"; exit 1
    fi
fi

APT_UPDATED=false
apt_update_if_needed(){
    if [ "$APT_UPDATED" = false ]; then
        info "apt-get update..."
        $SUDO apt-get update -y
        APT_UPDATED=true
    fi
}

ensure_package(){
    pkg_name="$1"
    if ! command -v "$pkg_name" >/dev/null 2>&1; then
        info "检测到缺少 $pkg_name，准备安装"
        apt_update_if_needed
        case "$pkg_name" in
            node)
                curl -fsSL https://deb.nodesource.com/setup_20.x | $SUDO bash -
                $SUDO apt-get install -y nodejs
                ;;
            pnpm)
                $SUDO npm install -g pnpm
                ;;
            nginx)
                $SUDO apt-get install -y nginx
                ;;
            *)
                $SUDO apt-get install -y "$pkg_name"
                ;;
        esac
    else
        info "$pkg_name 已安装"
    fi
}

if [ "$DRY_RUN" = true ]; then
    info "Dry-run 模式：不会对系统做出改变"
fi

# 安装依赖（幂等）
ensure_package node
ensure_package pnpm
ensure_package nginx

# 构建项目
info "构建项目"
cd "$DEPLOY_DIR"
if [ "$DRY_RUN" = true ]; then
    info "DRY RUN: pnpm install && pnpm build"
else
    pnpm install --frozen-lockfile || pnpm install
    pnpm build
fi

# 部署静态文件到 /var/www/html
WWW_DIR="/var/www/html"
info "部署静态文件到 $WWW_DIR"
if [ "$DRY_RUN" = true ]; then
    info "DRY RUN: rsync -a --delete dist/ $WWW_DIR/"
else
    $SUDO mkdir -p "$WWW_DIR"
    $SUDO rm -rf "$WWW_DIR"/* || true
    $SUDO rsync -a --delete "dist/" "$WWW_DIR/"
    $SUDO chown -R www-data:www-data "$WWW_DIR" || true
fi

# 应用安全的 nginx 默认配置（备份原配置）
NGINX_DEFAULT=/etc/nginx/sites-available/default
BACKUP_TS=$(date -u +%Y%m%dT%H%M%SZ)
info "备份并应用 $NGINX_DEFAULT（如有必要）"
if [ "$DRY_RUN" = true ]; then
    info "DRY RUN: backup $NGINX_DEFAULT -> ${NGINX_DEFAULT}.bak.$BACKUP_TS"
else
    $SUDO cp -a "$NGINX_DEFAULT" "${NGINX_DEFAULT}.bak.$BACKUP_TS" || true
    $SUDO tee "$NGINX_DEFAULT" > /dev/null <<'EOF'
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
    $SUDO nginx -t && $SUDO systemctl restart nginx && $SUDO systemctl enable nginx || {
        err "nginx 配置或重载失败，恢复备份"
        $SUDO cp -a "${NGINX_DEFAULT}.bak.$BACKUP_TS" "$NGINX_DEFAULT" || true
        exit 1
    }
fi

# 获取实例 IP（支持 IMDSv2）
get_instance_ip(){
    TOKEN=$(curl -m 2 -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" || true)
    if [ -n "$TOKEN" ]; then
        curl -m 2 -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || true
    else
        curl -m 2 -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || true
    fi
}

IP=$(get_instance_ip || true)
if [ -n "$IP" ]; then
    info "部署完成：访问 http://$IP/"
else
    LOCAL_IP=$(curl -m 2 -s http://169.254.169.254/latest/meta-data/local-ipv4 2>/dev/null || true)
    if [ -n "$LOCAL_IP" ]; then
        info "实例无公网 IP，私有 IP: http://$LOCAL_IP/ (仅内网可访问)"
    else
        info "部署完成，但无法从元数据获取 IP，请检查网络/安全组/弹性 IP 等"
    fi
fi

# 自检
if [ "$SKIP_SELF_CHECK" = true ]; then
    info "跳过自检 (SKIP_SELF_CHECK=true)"
else
    info "运行部署自检"
    if [ -n "$IP" ]; then
        info "外部检查: http://$IP/"
        curl -IL --max-time 10 "http://$IP/" || warn "外部请求失败或超时"
    else
        warn "无公网 IP，跳过外部自检"
    fi

    info "本机检查: http://127.0.0.1/"
    curl -I --max-time 5 http://127.0.0.1 || warn "本机请求失败"

    if [ -f /var/www/html/index.html ]; then
        info "index.html (前 20 行):"
        sed -n '1,20p' /var/www/html/index.html || true
    else
        warn "/var/www/html/index.html 不存在"
    fi
    info "自检完成"
fi

info "全部完成"

