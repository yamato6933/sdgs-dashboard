# サーバー設定コマンド集

## 即座に実行可能（ドメイン設定前）

### 1. サーバーに接続
```bash
ssh root@163.43.225.65
# または
ssh username@163.43.225.65
```

### 2. システム更新
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. 必要パッケージインストール
```bash
# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# その他必要パッケージ
sudo apt install -y git nginx certbot python3-certbot-nginx curl wget htop

# PM2 (プロセス管理)
sudo npm install -g pm2
```

### 4. ファイアウォール設定
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'  
sudo ufw --force enable
```

### 5. アプリケーションディレクトリ準備
```bash
sudo mkdir -p /var/www/sdgs-dashboard
sudo chown $USER:$USER /var/www/sdgs-dashboard
```

### 6. GitHubからクローン
```bash
cd /var/www/sdgs-dashboard
git clone https://github.com/yamato6933/sdgs-dashboard.git .
```

### 7. 依存関係インストール
```bash
npm install
```

### 8. 環境変数設定
```bash
cat > .env.local << EOF
NODE_ENV=production
GEMINI_API_KEY=your_actual_gemini_api_key_here
DATABASE_URL=file:./data/sdgs_scores.db
EOF

# 環境変数編集
nano .env.local
```

### 9. アプリケーションビルド
```bash
npm run build
```

### 10. PM2で起動テスト
```bash
pm2 start npm --name "sdgs-dashboard" -- start
pm2 status
pm2 logs sdgs-dashboard
```

## ドメイン設定後に実行

### Nginx設定
```bash
# 設定ファイルダウンロード
sudo wget -O /etc/nginx/sites-available/sdgs-dashboard \
  https://raw.githubusercontent.com/yamato6933/sdgs-dashboard/main/deploy/nginx-config.conf

# ドメイン名を置換（your-domain.comを実際のドメインに変更）
sudo sed -i 's/your-domain.com/実際のドメイン名/g' /etc/nginx/sites-available/sdgs-dashboard

# サイト有効化
sudo ln -s /etc/nginx/sites-available/sdgs-dashboard /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# 設定テスト
sudo nginx -t
sudo systemctl reload nginx
```

### SSL証明書取得
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com \
  --email your-email@example.com --agree-tos --no-eff-email --redirect
```
