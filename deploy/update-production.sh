#!/bin/bash

# 本番環境更新スクリプト
# 使用方法: bash deploy/update-production.sh

APP_NAME="sdgs-dashboard"
APP_DIR="/var/www/$APP_NAME"

echo "=== SDGsダッシュボード 本番環境更新開始 ==="

# アプリケーションディレクトリに移動
cd $APP_DIR || {
    echo "エラー: アプリケーションディレクトリが見つかりません: $APP_DIR"
    exit 1
}

# 現在のブランチとコミット確認
echo "=== 更新前の状態 ==="
git branch
git log --oneline -1

# 最新コードを取得
echo "=== 最新コードを取得中 ==="
git pull origin main

if [ $? -ne 0 ]; then
    echo "エラー: Git pullに失敗しました"
    exit 1
fi

# 更新後の状態確認
echo "=== 更新後の状態 ==="
git log --oneline -1

# 依存関係の確認・更新
echo "=== 依存関係を確認中 ==="
npm install

if [ $? -ne 0 ]; then
    echo "エラー: npm installに失敗しました"
    exit 1
fi

# アプリケーションをビルド
echo "=== アプリケーションをビルド中 ==="
npm run build

if [ $? -ne 0 ]; then
    echo "エラー: buildに失敗しました"
    exit 1
fi

# PM2でアプリケーションを再起動
echo "=== アプリケーションを再起動中 ==="
pm2 restart $APP_NAME

if [ $? -ne 0 ]; then
    echo "エラー: PM2再起動に失敗しました"
    exit 1
fi

# デプロイ状況確認
echo "=== デプロイ状況確認 ==="
pm2 status
echo ""
echo "=== 最新ログ（直近10行） ==="
pm2 logs $APP_NAME --lines 10

echo ""
echo "=== 本番環境更新完了 ==="
echo "アプリケーション: $APP_NAME"
echo "ディレクトリ: $APP_DIR"
echo "ステータス確認: pm2 status"
echo "ログ確認: pm2 logs $APP_NAME"
echo "アプリケーションURL: https://your-domain.com"
