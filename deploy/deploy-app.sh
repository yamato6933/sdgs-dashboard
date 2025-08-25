#!/bin/bash

# アプリケーションデプロイスクリプト

# 設定変数
APP_NAME="sdgs-dashboard"
APP_DIR="/var/www/$APP_NAME"
DOMAIN="your-domain.com"  # 実際のドメインに変更してください

echo "=== SDGsダッシュボード デプロイ開始 ==="

# アプリケーションディレクトリ作成
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Gitリポジトリからクローン
cd $APP_DIR
git clone https://github.com/yamato6933/sdgs-dashboard.git .

# 依存関係インストール
npm install

# 環境変数ファイル作成
cat > .env.local << EOF
# 本番環境設定
NODE_ENV=production
GEMINI_API_KEY=your_actual_gemini_api_key_here
DATABASE_URL=file:./data/sdgs_scores.db
EOF

echo "=== .env.localファイルを編集してください ==="
echo "sudo nano $APP_DIR/.env.local"
echo ""
echo "必要な環境変数:"
echo "- GEMINI_API_KEY: あなたのGemini APIキー"
echo ""

# ビルド
npm run build

# PM2でアプリケーション起動
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start npm --name "$APP_NAME" -- start
pm2 save
pm2 startup

echo "=== アプリケーションデプロイ完了 ==="
echo "アプリケーションディレクトリ: $APP_DIR"
echo "PM2 status: pm2 status"
echo "ログ確認: pm2 logs $APP_NAME"
