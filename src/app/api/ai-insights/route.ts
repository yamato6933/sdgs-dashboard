import path from "path";
import Database from "better-sqlite3";
import { MunicipalityData } from "@/app/sdgs/municipality/prefectureselection";
import { NextRequest, NextResponse } from "next/server";





interface AIInsightData{
  id: string;
  municipalityId: string;
  municipalityName: string;
  prefectureName: string;
  insight: string;
  explanation: string;
  strengths: string;
  improvements: string;
  recommendations: string[];
  createdAt: string;
}

//データベース接続
function getDatabase() {
  const dbPath = path.join(process.cwd(), 'data', 'sdgs_scores.db');
  return new Database(dbPath);
}

//AIインサイトのテーブルをデータベースに作る（テーブルの内容は用改善！！）
function initializeAIInsightTable(db: Database.Database){
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ai_insights (
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
  `;

  db.exec(createTableSQL);
}

//既存のインサイトを取得する
function getExistingInsight(db: Database.Database, municipality_id:string): AIInsightData | null {
  const stmt = db.prepare(`
    SELECT * FROM ai_insights 
    WHERE municipality_id = ?
  `);

  const row = stmt.get(municipality_id) as {
    id: string;
    municipality_id: string;
    municipality_name: string;
    prefecture_name: string;
    insight: string;
    explanation: string;
    strengths: string;
    improvements: string;
    recommendations: string;
    created_at: string;
  } | undefined;

  if (!row) return null;

  return {
    id: row.id,
    municipalityId: row.municipality_id,
    municipalityName: row.municipality_name,
    prefectureName: row.prefecture_name,
    insight: row.insight,
    explanation: row.explanation,
    strengths: row.strengths,
    improvements: row.improvements,
    recommendations: JSON.parse(row.recommendations),
    createdAt: row.created_at,
  };
}

//インサイトを保存する
function saveInsight(db:Database.Database, insightData: AIInsightData){
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO ai_insights 
    (id, municipality_id, municipality_name, prefecture_name, insight, explanation, strengths, improvements, recommendations, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    insightData.id,
    insightData.municipalityId,
    insightData.municipalityName,
    insightData.prefectureName,
    insightData.insight,
    insightData.explanation,
    insightData.strengths,
    insightData.improvements,
    JSON.stringify(insightData.recommendations),
    insightData.createdAt
  );
}

//Gemini APIを利用してインサイトを作成
async function generateAIInsight(municipalityData: MunicipalityData): Promise<{
  insight: string;
  explanation: string;
  strengths: string;
  improvements: string;
  recommendations: string[];
}> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=' + apiKey;

  const prompt = `
  あなたは統計的因果推論と地理分析とSDGsの専門家です。
  以下の情報をもとに、選択された市区町村のSDGsスコアに関して日本語で簡潔で分かりやすい考察を行ってください。

  市区町村: ${municipalityData.prefecture} ${municipalityData.name}
  総合スコア: ${municipalityData.scores.overall}%
  各SDGsゴールのスコア: ${municipalityData.scores.goals.map((score, index) => `ゴール${index+1}: ${score}%`).join(',')}

  分析結果を以下のJSON形式で返してください：

{
  "insight": "総合的な分析結果（3-4文で要約）",
  "explanation": "市区町村の基本的な説明（地理的位置、人口、産業構造など）をまとめる。"
  "strengths": "最もスコアが高い目標について、地理的・社会的・経済的な要因から、その高さの可能な原因を推測する。",
  "improvements": "最もスコアが低い目標について、地理的・社会的・経済的な要因から、その低さの可能な原因を推測する。",
  "recommendations": ["推奨アクション1", "推奨アクション2", "推奨アクション3"]
}

制約:
- 専門用語は使ってもよいが、高校生でも理解できる程度に説明する。
- 推測であることを明示する（例：「〜の可能性がある」）。
- 箇条書きではなく、簡潔な文章で述べる。

必ずJSON形式のみで回答してください。
  `;

  try{
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {text: prompt}
            ]
          }
        ]
      }),
    });

    if(!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if(!text) {
      throw new Error("AI response is empty");
    }

    //jsonテキストを整形
    let jsonText = text.trim();
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0].trim();
    } else if (jsonText.includes('```')){
      jsonText = jsonText.split('```')[1].split('```')[0].trim();
    }

    const parsed = JSON.parse(jsonText);

    return {
      insight: parsed.insight || '分析結果を生成できませんでした。',
      explanation: parsed.explanation || '',
      strengths: parsed.strengths || '',
      improvements: parsed.improvements || '',
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    };
  } catch (error) {
    console.error('Error generating AI insight:', error);
      throw new Error('AI分析の生成に失敗しました')
  }
}


//データベースの準備
export async function POST(req: NextRequest){
  try {
    const {municipalityData} = await req.json();

    if(!municipalityData) {
      return NextResponse.json(
        { error: '市区町村データが提供されていません' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    initializeAIInsightTable(db);

    //一意性のあるIDを生成
    const municipalityId = `${municipalityData.prefecture}_${municipalityData.name}`.replace(/\s+/g, '_'); //正規表現で空白文字を＿置換

    //既存のものがないかチェック
    const existingInsight = getExistingInsight(db,municipalityId);

    if (existingInsight) {
      db.close();
      return NextResponse.json({insight: existingInsight});
    }

    //新しいインサイトの生成
    const aiResult = await generateAIInsight(municipalityData);

    const newInsight: AIInsightData = {
      id:`insight_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,
      municipalityId,
      municipalityName: municipalityData.name,
      prefectureName: municipalityData.prefecture,
      insight: aiResult.insight,
      explanation: aiResult.explanation,
      strengths: aiResult.strengths,
      improvements: aiResult.improvements,
      recommendations: aiResult.recommendations,
      createdAt: new Date().toISOString(),
    };

    //データベースに保存
    saveInsight(db, newInsight);
    db.close();

    return NextResponse.json({ insight: newInsight});
  } catch(error: unknown) {
    console.error('Error in AI insight API:', error);
    
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';

    return NextResponse.json(
      { error: `サーバーエラー: ${errorMessage}`},
      { status: 500}
    );
  }
}