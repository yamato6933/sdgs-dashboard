#!/bin/bash

# サーバー状態確認スクリプト
# lsi-dashboard.org用

echo "=== サーバー情報確認 ==="

# 基本情報
echo "ホスト名: $(hostname)"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME)"
echo "アーキテクチャ: $(uname -m)"
echo "カーネル: $(uname -r)"

# リソース確認
echo ""
echo "=== リソース情報 ==="
echo "CPU: $(nproc) コア"
echo "メモリ: $(free -h | grep Mem | awk '{print $2}')"
echo "ディスク使用量:"
df -h | grep -E "/$|/dev/"

# ネットワーク確認
echo ""
echo "=== ネットワーク情報 ==="
echo "IPアドレス: $(curl -s ifconfig.me || echo "取得失敗")"
echo "ポート確認:"
ss -tlnp | grep -E ":80|:443|:22|:3000"

# インストール済みソフトウェア確認
echo ""
echo "=== インストール状況 ==="
echo "Node.js: $(node --version 2>/dev/null || echo "未インストール")"
echo "npm: $(npm --version 2>/dev/null || echo "未インストール")"
echo "Nginx: $(nginx -v 2>&1 | head -1 || echo "未インストール")"
echo "PM2: $(pm2 --version 2>/dev/null || echo "未インストール")"
echo "Git: $(git --version 2>/dev/null || echo "未インストール")"
echo "Certbot: $(certbot --version 2>/dev/null || echo "未インストール")"

# セキュリティ確認
echo ""
echo "=== セキュリティ状況 ==="
echo "UFW状態: $(sudo ufw status | head -1)"
echo "SELinux: $(getenforce 2>/dev/null || echo "無効/未インストール")"

# サービス状況
echo ""
echo "=== サービス状況 ==="
echo "Nginx: $(systemctl is-active nginx 2>/dev/null || echo "未起動")"
echo "SSH: $(systemctl is-active ssh 2>/dev/null || echo "未起動")"

echo ""
echo "=== 確認完了 ==="
