# EC2 部署指南（Nginx + Node.js）

## 步骤一：创建 EC2 实例

1. 登录 AWS 控制台 → EC2
2. 创建新实例
   - 操作系统：Ubuntu 22.04 LTS（推荐）
   - 类型：t2.micro（免费套餐）
   - 配置安全组：开放 80（HTTP）、443（HTTPS）、22（SSH）端口
3. 获取实例公网 IP

## 步骤二：连接到 EC2

```bash
ssh -i ~/.ssh/your-key.pem ubuntu@<EC2-IP>
```

## 步骤三：上传项目代码

1. 使用 scp 或 git clone 上传代码

```bash
# 方式一：使用 scp
scp -i ~/.ssh/your-key.pem -r ./英语学习网站 ubuntu@<EC2-IP>:/home/ubuntu/english-site

# 方式二：使用 git clone
sudo apt-get install -y git
git clone https://github.com/menglingqin/xia-dao-gu.git /home/ubuntu/english-site
```

## 步骤四：运行部署脚本

```bash
cd /home/ubuntu/english-site
sudo bash ec2-deploy.sh
```

## 步骤五：访问网站

- 浏览器访问：http://<EC2-IP>/

## 可选：配置 HTTPS（SSL）

1. 安装 Certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

2. 获取证书

```bash
sudo certbot --nginx
```

3. 按提示完成域名绑定和证书申请

## 故障排查

- Nginx 启动失败：检查配置文件 `/etc/nginx/sites-available/default`
- 端口未开放：检查 AWS 安全组
- 构建失败：检查 Node.js/pnpm 版本

## 优化建议

- 使用 t3.small 或更高配置提升性能
- 配置自动重启（systemd）
- 配置 CDN 加速（可选）

---

如需详细操作，请参考 [AWS-DEPLOYMENT-GUIDE.md](AWS-DEPLOYMENT-GUIDE.md) 并结合 EC2 部署部分。
