#!/usr/bin/env python3
"""
CSVファイルを既存のデータベース形式に変換するスクリプト
score_muni_2020_vae(in).csv → sdgs_score_new.db
"""

import sqlite3
import csv
import os
import sys

def create_database(csv_file_path, db_file_path):
    """CSVファイルからデータベースを作成"""
    
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
        for row in csv_reader:
            if len(row) >= 18:  # 市町村名 + 17ゴール
                municipality = row[0]
                goals = [float(row[i]) for i in range(1, 18)]  # goal_1 から goal_17
                
                cursor.execute('''
                    INSERT INTO sdgs_scores 
                    (municipality, goal_1, goal_2, goal_3, goal_4, goal_5, goal_6, goal_7, goal_8, goal_9, 
                     goal_10, goal_11, goal_12, goal_13, goal_14, goal_15, goal_16, goal_17)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', [municipality] + goals)
                
                insert_count += 1
    
    # コミットして接続を閉じる
    conn.commit()
    conn.close()
    
    print(f"✅ データベース '{db_file_path}' を作成しました")
    print(f"✅ {insert_count} 件の市町村データを挿入しました")

def backup_existing_db(existing_db_path):
    """既存のデータベースをバックアップ"""
    if os.path.exists(existing_db_path):
        backup_path = existing_db_path + '.backup'
        os.system(f'cp "{existing_db_path}" "{backup_path}"')
        print(f"✅ 既存データベースを {backup_path} にバックアップしました")
        return backup_path
    return None

def replace_database(new_db_path, existing_db_path):
    """新しいデータベースで既存のものを置き換え"""
    if os.path.exists(new_db_path):
        os.system(f'cp "{new_db_path}" "{existing_db_path}"')
        print(f"✅ {existing_db_path} を新しいデータベースで置き換えました")
    else:
        print(f"❌ 新しいデータベース {new_db_path} が見つかりません")

def main():
    # ファイルパス設定
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_file = os.path.join(base_dir, 'data', 'score_muni_2020_vae(in).csv')
    new_db_file = os.path.join(base_dir, 'data', 'sdgs_scores_new.db')
    existing_db_file = os.path.join(base_dir, 'data', 'sdgs_scores.db')
    
    print("🔄 SDGsスコアデータベース変換開始...")
    print(f"📁 CSVファイル: {csv_file}")
    print(f"📁 新データベース: {new_db_file}")
    print(f"📁 既存データベース: {existing_db_file}")
    
    # CSVファイルの存在確認
    if not os.path.exists(csv_file):
        print(f"❌ CSVファイルが見つかりません: {csv_file}")
        return
    
    # 既存データベースをバックアップ
    backup_path = backup_existing_db(existing_db_file)
    
    # 新しいデータベースを作成
    create_database(csv_file, new_db_file)
    
    # データベースを置き換え
    replace_database(new_db_file, existing_db_file)
    
    print("🎉 データベース変換完了!")
    print(f"📊 新しいSDGsスコアデータが {existing_db_file} に反映されました")
    if backup_path:
        print(f"🔒 バックアップ: {backup_path}")

if __name__ == "__main__":
    main()
