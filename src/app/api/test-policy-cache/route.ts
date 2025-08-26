import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

export async function POST() {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'sdgs_scores.db');
    const db = new Database(dbPath);
    
    // テーブルを作成
    db.exec(`
      CREATE TABLE IF NOT EXISTS policy_research_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        goal INTEGER NOT NULL,
        municipalities TEXT NOT NULL,
        analysis TEXT NOT NULL,
        municipality_policies TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(goal, municipalities)
      )
    `);

    // テスト用のサンプルデータを挿入
    const sampleData = {
      goal: 8,
      municipalities: ["つくば市", "武蔵村山市", "小金井市", "府中市", "立川市"],
      analysis: "これらの自治体では、働きがいと経済成長の向上において、特に地域企業の支援、起業促進、雇用創出に重点を置いた政策が実施されています。産学連携の強化や、デジタル化推進による生産性向上が共通の取り組みとして見られます。",
      municipalityPolicies: [
        {
          municipality: "つくば市",
          policies: [
            {
              name: "つくばスタートアップ支援事業",
              year: "2018年",
              budget: "3億円",
              description: "研究学園都市の特性を活かし、大学発ベンチャーの創出と成長を支援。起業家育成プログラムや資金調達支援により、働きがいのある雇用を創出。"
            },
            {
              name: "産学連携イノベーション促進事業",
              year: "2019年",
              budget: "2億5千万円",
              description: "つくば市内の研究機関と地域企業の連携を促進し、技術革新による新たな産業創出と雇用機会の拡大を実現。"
            }
          ]
        },
        {
          municipality: "武蔵村山市",
          policies: [
            {
              name: "地域企業デジタル化推進補助金",
              year: "2020年",
              budget: "1億5千万円",
              description: "中小企業のDX推進を支援し、生産性向上と働き方改革を促進。労働環境の改善により働きがいの向上を実現。"
            },
            {
              name: "若者就職支援プログラム",
              year: "2017年",
              budget: "8千万円",
              description: "地域の若者の就職活動を包括的に支援し、安定した雇用機会の確保と地域定着を促進。キャリア形成支援により働きがいの向上に貢献。"
            }
          ]
        }
      ]
    };

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO policy_research_cache 
      (goal, municipalities, analysis, municipality_policies)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(
      sampleData.goal,
      JSON.stringify(sampleData.municipalities.sort()),
      sampleData.analysis,
      JSON.stringify(sampleData.municipalityPolicies)
    );

    db.close();
    
    return NextResponse.json({ 
      message: "テスト用政策調査データをキャッシュに保存しました",
      success: true,
      data: sampleData
    });
    
  } catch (error: unknown) {
    console.error('Error creating test cache:', error);
    
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    
    return NextResponse.json(
      { error: `テストキャッシュ作成エラー: ${errorMessage}` },
      { status: 500 }
    );
  }
}
