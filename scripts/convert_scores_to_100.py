#!/usr/bin/env python3
"""
SDGsスコアを0-1から0-100点満点に変換するスクリプト
全てのgoal_1からgoal_17のスコアを100倍する
"""

import sqlite3
import os

def convert_scores_to_100(db_file_path):
    """スコアを100倍に変換"""
    
    # データベース接続
    conn = sqlite3.connect(db_file_path)
    cursor = conn.cursor()
    
    print(f"🔄 スコア変換開始: {db_file_path}")
    
    # 現在のスコア範囲を確認
    cursor.execute("SELECT MIN(goal_1), MAX(goal_1) FROM sdgs_scores")
    min_score, max_score = cursor.fetchone()
    print(f"📊 変換前のスコア範囲: {min_score:.3f} - {max_score:.3f}")
    
    # 全ゴールのスコアを100倍
    goal_columns = [f"goal_{i}" for i in range(1, 18)]
    
    for goal in goal_columns:
        cursor.execute(f"UPDATE sdgs_scores SET {goal} = {goal} * 100")
        print(f"✅ {goal} を100倍しました")
    
    # 変換後のスコア範囲を確認
    cursor.execute("SELECT MIN(goal_1), MAX(goal_1) FROM sdgs_scores")
    min_score, max_score = cursor.fetchone()
    print(f"📊 変換後のスコア範囲: {min_score:.1f} - {max_score:.1f}")
    
    # 変更をコミット
    conn.commit()
    
    # 確認用にサンプルデータを表示
    cursor.execute("SELECT municipality, goal_1, goal_2, goal_3 FROM sdgs_scores LIMIT 3")
    samples = cursor.fetchall()
    print(f"\n📝 変換後のサンプルデータ:")
    for sample in samples:
        print(f"  {sample[0]}: Goal1={sample[1]:.1f}, Goal2={sample[2]:.1f}, Goal3={sample[3]:.1f}")
    
    conn.close()
    print("✅ スコア変換完了!")

def backup_database(db_file_path):
    """データベースをバックアップ"""
    backup_path = db_file_path + '.before_100x'
    os.system(f'cp "{db_file_path}" "{backup_path}"')
    print(f"🔒 バックアップ作成: {backup_path}")
    return backup_path

def main():
    # ファイルパス設定
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_file = os.path.join(base_dir, 'data', 'sdgs_scores.db')
    
    print("🎯 SDGsスコア100点満点変換開始...")
    print(f"📁 対象データベース: {db_file}")
    
    # データベースの存在確認
    if not os.path.exists(db_file):
        print(f"❌ データベースファイルが見つかりません: {db_file}")
        return
    
    # バックアップ作成
    backup_path = backup_database(db_file)
    
    # スコア変換実行
    convert_scores_to_100(db_file)
    
    print(f"🎉 変換完了! スコアが0-100点満点になりました")
    print(f"🔒 変換前のバックアップ: {backup_path}")

if __name__ == "__main__":
    main()
