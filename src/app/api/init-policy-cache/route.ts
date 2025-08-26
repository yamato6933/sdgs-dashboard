import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

export async function POST() {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'sdgs_scores.db');
    const db = new Database(dbPath);
    
    // 政策調査結果キャッシュテーブルを作成
    db.exec(`
      CREATE TABLE IF NOT EXISTS policy_research_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        goal INTEGER NOT NULL,
        municipalities TEXT NOT NULL, -- JSON文字列で保存
        analysis TEXT NOT NULL,
        municipality_policies TEXT NOT NULL, -- JSON文字列で保存
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(goal, municipalities)
      )
    `);
    
    db.close();
    
    return NextResponse.json({ 
      message: "政策調査キャッシュテーブルを作成しました",
      success: true 
    });
    
  } catch (error: unknown) {
    console.error('Error creating policy cache table:', error);
    
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    
    return NextResponse.json(
      { error: `テーブル作成エラー: ${errorMessage}` },
      { status: 500 }
    );
  }
}
