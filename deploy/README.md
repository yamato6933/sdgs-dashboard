# SDGsダッシュボード サーバーデプロイガイド

## 概要
このガイドでは、さくらインターネットのVPSに独自ドメインでSDGsダッシュボードをデプロイする手順を説明します。

## 前提条件
- さくらのVPS（Ubuntu 22.04 LTS）
- 独自ドメイン（お名前.com、ムームードメインなど）
- SSH接続環境

## デプロイ手順

### 1. サーバー初期設定
```bash
# SSHでサーバーに接続
ssh username@your-server-ip

# 依存関係インストール
bash <(curl -s https://raw.githubusercontent.com/yamato6933/sdgs-dashboard/main/deploy/install-dependencies.sh)
```

### 2. DNS設定
**ドメイン管理画面で以下のレコードを追加：**
```
タイプ: A
名前: @
値: サーバーのIPアドレス

タイプ: A  
名前: www
値: サーバーのIPアドレス
```

### 3. アプリケーションデプロイ
```bash
# デプロイスクリプト実行
bash <(curl -s https://raw.githubusercontent.com/yamato6933/sdgs-dashboard/main/deploy/deploy-app.sh)

# 環境変数設定
sudo nano /var/www/sdgs-dashboard/.env.local
```

### 4. SSL証明書設定
```bash
# SSL設定スクリプト実行
# まずドメイン名とメールアドレスを設定
export DOMAIN="your-domain.com"
export EMAIL="your-email@example.com"

# SSL設定実行
bash <(curl -s https://raw.githubusercontent.com/yamato6933/sdgs-dashboard/main/deploy/setup-ssl.sh)
```

### 5. 自動更新設定
```bash
# SSL証明書自動更新
sudo crontab -e
# 以下の行を追加:
# 0 12 * * * /usr/bin/certbot renew --quiet

# アプリケーション自動再起動
pm2 startup
pm2 save
```

## 運用コマンド

### アプリケーション管理
```bash
# ステータス確認
pm2 status

# ログ確認  
pm2 logs sdgs-dashboard

# 再起動
pm2 restart sdgs-dashboard

# 停止
pm2 stop sdgs-dashboard
```

### システム管理
```bash
# Nginx設定テスト
sudo nginx -t

# Nginx再起動
sudo systemctl restart nginx

# SSL証明書更新
sudo certbot renew

# システム監視
htop
df -h
```

## トラブルシューティング

### 1. アプリケーションが起動しない
```bash
# ログ確認
pm2 logs sdgs-dashboard

# 手動起動テスト
cd /var/www/sdgs-dashboard
npm start
```

### 2. SSL証明書エラー
```bash
# DNS確認
nslookup your-domain.com

# 証明書確認
sudo certbot certificates
```

### 3. データベースエラー
```bash
# ファイル権限確認
ls -la /var/www/sdgs-dashboard/data/

# 権限修正
sudo chown -R $USER:$USER /var/www/sdgs-dashboard/data/
```

## セキュリティ対策

### ファイアウォール設定
```bash
sudo ufw status
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
```

### 定期バックアップ
```bash
# データベースバックアップ
cp /var/www/sdgs-dashboard/data/sdgs_scores.db ~/backup/$(date +%Y%m%d)_sdgs_scores.db
```

## 更新手順
```bash
cd /var/www/sdgs-dashboard
git pull origin main
npm install
npm run build
pm2 restart sdgs-dashboard
```

## サポート
問題が発生した場合は、以下を確認してください：
1. PM2ログ: `pm2 logs sdgs-dashboard`
2. Nginxログ: `sudo tail -f /var/log/nginx/error.log`
3. システムログ: `sudo journalctl -f`
