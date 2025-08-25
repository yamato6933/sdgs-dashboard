#!/bin/bash

# サーバー初期設定スクリプト
# Ubuntu 22.04 LTS用

echo "=== サーバー初期設定開始 ==="

# システムアップデート
sudo apt update && sudo apt upgrade -y

# 必要なパッケージのインストール
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

# Node.js 20.x のインストール
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2のインストール（プロセス管理）
sudo npm install -g pm2

# ファイアウォール設定
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Nginx開始・自動起動設定
sudo systemctl start nginx
sudo systemctl enable nginx

echo "=== 依存関係インストール完了 ==="
echo "Node.js バージョン: $(node --version)"
echo "npm バージョン: $(npm --version)"
echo "=== 次のステップ: アプリケーションのデプロイ ==="
