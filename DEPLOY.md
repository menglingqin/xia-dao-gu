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
