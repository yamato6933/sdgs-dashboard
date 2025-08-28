# 📚 SDGsダッシュボード デプロイメントガイド

## 🚀 本番環境更新方法（要因分解機能追加対応）

### 🔧 クイック更新（推奨）

サーバーにSSH接続後、以下のコマンドを実行：

```bash
# 1. アプリケーションディレクトリに移動
cd /var/www/sdgs-dashboard

# 2. 更新スクリプトを実行
bash deploy/update-production.sh
```

### 📋 手動更新手順

#### ステップ1: サーバーに接続
```bash
ssh username@your-server-ip
```

#### ステップ2: 最新コードを取得
```bash
cd /var/www/sdgs-dashboard
git pull origin main
```

#### ステップ3: 依存関係とビルド
```bash
# 依存関係更新（必要に応じて）
npm install

# アプリケーションビルド
npm run build
```

#### ステップ4: アプリケーション再起動
```bash
# PM2で再起動
pm2 restart sdgs-dashboard

# 状況確認
pm2 status
pm2 logs sdgs-dashboard
```

## 🆕 今回の更新内容（要因分解機能）

### 追加ファイル
- `src/app/sdgs/FactorDecomposition.tsx` - 要因分解コンポーネント
- `src/app/sdgs/feature-factors.ts` - SDGsゴール別特徴量データ
- `deploy/update-production.sh` - 本番環境更新スクリプト

### 変更ファイル
- `src/app/sdgs/page.tsx` - 要因分解コンポーネントの組み込み

### 新機能
1. **インタラクティブなSDGsゴール選択**
   - 17個のSDGsアイコンをクリック可能
   - 選択されたゴールのハイライト表示

2. **特徴量詳細表示**
   - 各ゴールの算出に使用された特徴量を表示
   - 番号付きリストで分かりやすく整理

3. **レスポンシブデザイン**
   - 画面サイズに応じたアイコンレイアウト
   - モバイル・タブレット・デスクトップ対応

## 🔍 動作確認方法

### 1. アプリケーション起動確認
```bash
pm2 status
# sdgs-dashboard が "online" 状態であることを確認
```

### 2. ログ確認
```bash
pm2 logs sdgs-dashboard
# エラーがないことを確認
```

### 3. ブラウザ確認
1. https://your-domain.com にアクセス
2. SDGsダッシュボードページに移動
3. 市区町村を選択
4. 「要因分解」セクションでSDGsアイコンをクリック
5. 特徴量が正しく表示されることを確認

## 🛠️ トラブルシューティング

### ビルドエラー
```bash
# ログ確認
npm run build 2>&1 | tee build.log

# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install
npm run build
```

### PM2起動エラー
```bash
# PM2プロセス確認
pm2 list

# 強制再起動
pm2 delete sdgs-dashboard
pm2 start npm --name "sdgs-dashboard" -- start
```

### 権限エラー
```bash
# ファイル権限確認
ls -la /var/www/sdgs-dashboard/

# 権限修正
sudo chown -R $USER:$USER /var/www/sdgs-dashboard/
```

## 📊 監視とログ

### リアルタイム監視
```bash
# PM2 監視
pm2 monit

# システムリソース
htop
```

### ログファイル
```bash
# アプリケーションログ
pm2 logs sdgs-dashboard

# Nginxログ
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# システムログ
sudo journalctl -u nginx -f
```

## 🔄 定期メンテナンス

### 週次
```bash
# システム更新
sudo apt update && sudo apt upgrade

# PM2プロセス確認
pm2 status
```

### 月次
```bash
# SSL証明書確認
sudo certbot certificates

# ディスク使用量確認
df -h

# ログローテーション
pm2 flush
```

## 📞 サポート

### よくある問題
1. **404エラー** → Nginx設定確認
2. **SSL証明書エラー** → certbot更新
3. **データベースエラー** → ファイル権限確認
4. **メモリ不足** → PM2 restart

### 緊急時連絡先
- 開発者: [連絡先情報]
- サーバー管理: [連絡先情報]

---

## 📝 更新履歴

| 日付 | バージョン | 更新内容 |
|------|------------|----------|
| 2024-XX-XX | v1.1.0 | 要因分解機能追加 |
| 2024-XX-XX | v1.0.0 | 初期リリース |
