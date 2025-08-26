#!/usr/bin/env python3
"""
2015年のCSVファイルを100点満点のデータベースに変換するスクリプト
score_muni_2015_vae(in).csv → sdgs_scores_2015.db
"""

import sqlite3
import csv
import os
import sys

def create_database_2015(csv_file_path, db_file_path):
    """2015年のCSVファイルからデータベースを作成（100点満点）"""
    
    # 既存のデータベースファイルがあれば削除
    if os.path.exists(db_file_path):
        os.remove(db_file_path)
        print(f"既存の {db_file_path} を削除しました")
    
    # データベース接続
    conn = sqlite3.connect(db_file_path)
    cursor = conn.cursor()
    
    # テーブル作成（既存と同じスキーマ）
    cursor.execute('''
        CREATE TABLE sdgs_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            municipality TEXT NOT NULL,
            goal_1 REAL NOT NULL,
            goal_2 REAL NOT NULL,
            goal_3 REAL NOT NULL,
            goal_4 REAL NOT NULL,
            goal_5 REAL NOT NULL,
            goal_6 REAL NOT NULL,
            goal_7 REAL NOT NULL,
            goal_8 REAL NOT NULL,
            goal_9 REAL NOT NULL,
            goal_10 REAL NOT NULL,
            goal_11 REAL NOT NULL,
            goal_12 REAL NOT NULL,
            goal_13 REAL NOT NULL,
            goal_14 REAL NOT NULL,
            goal_15 REAL NOT NULL,
            goal_16 REAL NOT NULL,
            goal_17 REAL NOT NULL
        )
    ''')
    
    # AI インサイトテーブルも作成（既存データベースと同じ）
    cursor.execute('''
        CREATE TABLE ai_insights (
            id TEXT PRIMARY KEY,
            municipality_id TEXT NOT NULL,
            municipality_name TEXT NOT NULL,
            prefecture_name TEXT NOT NULL,
            insight TEXT NOT NULL,
            explanation TEXT NOT NULL,
            strengths TEXT NOT NULL,
            improvements TEXT NOT NULL,
            recommendations TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(municipality_id)
        )
    ''')
    
    # CSVファイルを読み込んでデータを挿入
    with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
        csv_reader = csv.reader(csvfile)
        
        # ヘッダー行をスキップ
        next(csv_reader)
        
        insert_count = 0
        min_score = float('inf')
        max_score = float('-inf')
        
        for row in csv_reader:
            if len(row) >= 18:  # 市町村名 + 17ゴール
                municipality = row[0]
                goals = [float(row[i]) * 100 for i in range(1, 18)]  # 100倍して点数に変換
                
                # スコア範囲を記録
                for goal_score in goals:
                    min_score = min(min_score, goal_score)
                    max_score = max(max_score, goal_score)
                
                cursor.execute('''
                    INSERT INTO sdgs_scores 
                    (municipality, goal_1, goal_2, goal_3, goal_4, goal_5, goal_6, goal_7, goal_8, goal_9, 
                     goal_10, goal_11, goal_12, goal_13, goal_14, goal_15, goal_16, goal_17)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', [municipality] + goals)
                
                insert_count += 1
    
    # コミットして接続を閉じる
    conn.commit()
    
    # 確認用にサンプルデータを表示
    cursor.execute("SELECT municipality, goal_1, goal_2, goal_3 FROM sdgs_scores LIMIT 3")
    samples = cursor.fetchall()
    
    conn.close()
    
    print(f"✅ データベース '{db_file_path}' を作成しました")
    print(f"✅ {insert_count} 件の市町村データを挿入しました")
    print(f"📊 スコア範囲: {min_score:.1f} - {max_score:.1f} (100点満点)")
    print(f"\n📝 サンプルデータ (2015年):")
    for sample in samples:
        print(f"  {sample[0]}: Goal1={sample[1]:.1f}, Goal2={sample[2]:.1f}, Goal3={sample[3]:.1f}")

def main():
    # ファイルパス設定
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_file = os.path.join(base_dir, 'data', 'score_muni_2015_vae(in).csv')
    db_file = os.path.join(base_dir, 'data', 'sdgs_scores_2015.db')
    
    print("🔄 2015年SDGsスコアデータベース作成開始...")
    print(f"📁 CSVファイル: {csv_file}")
    print(f"📁 データベース: {db_file}")
    
    # CSVファイルの存在確認
    if not os.path.exists(csv_file):
        print(f"❌ CSVファイルが見つかりません: {csv_file}")
        return
    
    # データベースを作成
    create_database_2015(csv_file, db_file)
    
    print("🎉 2015年データベース作成完了!")
    print(f"📊 2015年のSDGsスコアデータ (100点満点) が {db_file} に保存されました")

if __name__ == "__main__":
    main()
