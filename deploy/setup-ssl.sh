#!/bin/bash

# SSL証明書設定スクリプト（Let's Encrypt）

DOMAIN="your-domain.com"  # 実際のドメインに変更してください
EMAIL="your-email@example.com"  # あなたのメールアドレスに変更

echo "=== SSL証明書設定開始 ==="
echo "ドメイン: $DOMAIN"
echo "メール: $EMAIL"

# Nginx設定ファイルをコピー
sudo cp /var/www/sdgs-dashboard/deploy/nginx-config.conf /etc/nginx/sites-available/sdgs-dashboard

# ドメイン名を実際のものに置換
sudo sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/sites-available/sdgs-dashboard

# サイト有効化
sudo ln -sf /etc/nginx/sites-available/sdgs-dashboard /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Nginx設定テスト
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Nginx設定OK"
    sudo systemctl reload nginx
    
    # Let's Encrypt SSL証明書取得
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email --redirect
    
    if [ $? -eq 0 ]; then
        echo "=== SSL証明書設定完了 ==="
        echo "サイトURL: https://$DOMAIN"
        echo "SSL証明書自動更新設定: sudo crontab -e"
        echo "追加する行: 0 12 * * * /usr/bin/certbot renew --quiet"
    else
        echo "SSL証明書取得エラー"
        exit 1
    fi
else
    echo "Nginx設定エラー"
    exit 1
fi
