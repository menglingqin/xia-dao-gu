**EC2 部署说明**

- **脚本**: `ec2-deploy.sh`
- **用途**: 在 EC2 实例上构建并部署前端静态站点到 Nginx (`/var/www/html`)。脚本已支持幂等安装、备份 nginx 配置、并提供自检。

快速用法示例：

- 使用默认部署目录（`/home/ubuntu/xia-dao-gu`）执行：

```bash
sudo bash ec2-deploy.sh
```

- 指定部署目录：

```bash
sudo bash ec2-deploy.sh --deploy-dir /home/ubuntu/project
```

- 先做 dry-run 检查：

```bash
bash ec2-deploy.sh --deploy-dir /home/ubuntu/project --dry-run
```

- 跳过自检（例如 CI 或受限制的网络）：

```bash
sudo bash ec2-deploy.sh --skip-self-check
```

脚本要点：

- 幂等安装：仅在缺失时安装 `node`、`pnpm`、`nginx`。apt 更新只会运行一次。
- Nginx：会备份 `/etc/nginx/sites-available/default` 到 `${file}.bak.TIMESTAMP`，并在失败时恢复。
- 权限：脚本会尝试使用 `sudo`（若未以 root 运行）。
- 自检：会尝试访问实例的公网 IP（如存在），并在本机请求 `127.0.0.1`，同时打印 `index.html` 前 20 行以便排查。

建议：

- 在操作前在开发或预生产实例运行 `--dry-run`。
- 若你使用弹性 IP 或负载均衡器，请在应用 nginx 配置或 DNS 更改时谨慎操作。

**HTTPS 与 Let's Encrypt 自动化示例**

下面给出使用 `certbot`（Certbot Nginx 插件）为 Nginx 自动获取并续期证书的简要示例。该示例假定你已经将域名指向实例的公网 IP。

- 安装 Certbot（Ubuntu）:

```bash
$ sudo apt-get update
$ sudo apt-get install -y certbot python3-certbot-nginx
```

- 使用 Certbot 获取证书并自动配置 Nginx:

```bash
$ sudo certbot --nginx -d example.com -d www.example.com
```

- Certbot 会创建 systemd 定时任务或 cron 作业用于自动续期。你可以手动测试续期：

```bash
$ sudo certbot renew --dry-run
```

注意事项：

- 在运行 `certbot` 前请确保 DNS A 记录已正确指向服务器公网 IP，且安全组允许 TCP 80/443。
- 若你使用了自定义 Nginx 配置或反向代理，在运行 `certbot --nginx` 前备份配置。
- 若你希望在部署脚本中集成证书申请，可以在 `ec2-deploy.sh` 的部署完成阶段添加可选步骤：

```bash
# 在成功部署并确认域名解析后（可选择性运行）
sudo certbot --nginx -d example.com
```

若需更轻量或无 root 的 ACME 客户端，可考虑 `acme.sh` 或在 CI/CD 中使用 DNS-01 挑战自动化证书颁发。
