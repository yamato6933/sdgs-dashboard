# VNCコンソール作業手順

## 1. システム情報確認
```bash
# OSとユーザー確認
whoami
cat /etc/os-release
hostname

# ネットワーク確認
ip addr show
```

## 2. SSH設定確認
```bash
# SSH設定ファイルの確認
sudo cat /etc/ssh/sshd_config | grep -E "PermitRootLogin|PasswordAuthentication"

# SSHサービス状態確認
sudo systemctl status ssh
```

## 3. SSH設定修正（rootログイン有効化）
```bash
# SSH設定ファイルを編集
sudo nano /etc/ssh/sshd_config

# 以下の行を探して修正:
PermitRootLogin yes
PasswordAuthentication yes

# 保存して終了（Ctrl+X → Y → Enter）
```

## 4. SSH再起動
```bash
# SSH設定を反映
sudo systemctl restart ssh
sudo systemctl status ssh
```

## 5. ユーザー確認・作成
```bash
# 既存ユーザー確認
cat /etc/passwd | grep -E "ubuntu|admin|root"

# 新しいユーザー作成（必要に応じて）
sudo adduser deploy
sudo usermod -aG sudo deploy
```

## 6. ファイアウォール確認
```bash
# UFW状態確認
sudo ufw status

# SSH許可（必要に応じて）
sudo ufw allow ssh
sudo ufw --force enable
```

## 7. 動作テスト用サーバー起動
```bash
# 簡単なWebサーバーテスト
cd /tmp
echo "Hello from lsi-dashboard.org!" > index.html
python3 -m http.server 8000 &

# ポート確認
ss -tlnp | grep 8000
```

## 8. システム更新
```bash
# パッケージ更新
sudo apt update
sudo apt upgrade -y
```

## トラブルシューティング

### SSH接続できない場合
1. ファイアウォール確認: `sudo ufw status`
2. SSH設定確認: `sudo sshd -T | grep permitrootlogin`
3. ログ確認: `sudo journalctl -u ssh`

### パスワード認証失敗の場合
1. パスワード再設定: `sudo passwd root`
2. ユーザー存在確認: `id root`
3. 認証ログ確認: `sudo tail /var/log/auth.log`
