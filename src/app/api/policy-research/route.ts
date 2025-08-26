import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

interface PolicyResearchRequest {
  goal: number;
  municipalities: string[];
}

interface PolicyResearchResponse {
  goal: number;
  analysis: string;
  municipalityPolicies: {
    municipality: string;
    policies: {
      name: string;
      year: string;
      budget: string;
      description: string;
    }[];
  }[];
}

const SDG_GOALS = [
  "", "貧困をなくそう", "飢餓をゼロに", "すべての人に健康と福祉を", "質の高い教育をみんなに",
  "ジェンダー平等を実現しよう", "安全な水とトイレを世界中に", "エネルギーをみんなに そしてクリーンに",
  "働きがいも経済成長も", "産業と技術革新の基盤をつくろう", "人や国の不平等をなくそう",
  "住み続けられるまちづくりを", "つくる責任 つかう責任", "気候変動に具体的な対策を",
  "海の豊かさを守ろう", "陸の豊かさも守ろう", "平和と公正をすべての人に",
  "パートナーシップで目標を達成しよう"
];

// キャッシュから政策調査結果を取得
function getCachedPolicyResearch(goal: number, municipalities: string[]): PolicyResearchResponse | null {
  const dbPath = path.join(process.cwd(), 'data', 'sdgs_scores.db');
  const db = new Database(dbPath);
  
  try {
    // テーブルが存在するかチェック
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='policy_research_cache'
    `).get();
    
    if (!tableExists) {
      return null;
    }
    
    // 市区町村リストをソートして正規化
    const normalizedMunicipalities = JSON.stringify(municipalities.sort());
    
    const cached = db.prepare(`
      SELECT analysis, municipality_policies 
      FROM policy_research_cache 
      WHERE goal = ? AND municipalities = ?
    `).get(goal, normalizedMunicipalities) as undefined | { analysis: string; municipality_policies: string };
    
    if (cached) {
      return {
        goal,
        analysis: cached.analysis,
        municipalityPolicies: JSON.parse(cached.municipality_policies)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  } finally {
    db.close();
  }
}

// 政策調査結果をキャッシュに保存
function savePolicyResearchCache(goal: number, municipalities: string[], result: PolicyResearchResponse): void {
  const dbPath = path.join(process.cwd(), 'data', 'sdgs_scores.db');
  const db = new Database(dbPath);
  
  try {
    // テーブルが存在しない場合は作成
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
    
    // 市区町村リストをソートして正規化
    const normalizedMunicipalities = JSON.stringify(municipalities.sort());
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO policy_research_cache 
      (goal, municipalities, analysis, municipality_policies)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(
      goal,
      normalizedMunicipalities,
      result.analysis,
      JSON.stringify(result.municipalityPolicies)
    );
    
    console.log(`✅ 政策調査結果をキャッシュに保存しました (ゴール${goal})`);
  } catch (error) {
    console.error('Error saving cache:', error);
  } finally {
    db.close();
  }
}

// Gemini API を使用して政策分析
function buildFallback(goal: number, municipalities: string[]) {
  return {
    analysis: "AIの応答が一時的に取得できなかったため、暫定のテンプレート結果を表示しています。後ほど再実行すると詳細が補完されます。",
    municipalityPolicies: municipalities.map(municipality => ({
      municipality,
      policies: [
        {
          name: "（暫定）主要施策の推定",
          year: "2015-2020",
          budget: "不明",
          description: "AI応答が得られなかったため、詳細は後ほど再実行してください。"
        }
      ]
    }))
  };
}

async function generatePolicyResearch(goal: number, municipalities: string[]): Promise<{
  analysis: string;
  municipalityPolicies: {
    municipality: string;
    policies: {
      name: string;
      year: string;
      budget: string;
      description: string;
    }[];
  }[];
}> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const primaryModel = 'gemini-2.5-pro';
  const fallbackModel = 'gemini-1.5-flash';

  const prompt = `
  あなたは日本の地方自治体の政策とSDGsの専門家です。
  以下の情報に基づき、指定されたSDGsゴールにおいて2015年から2020年の間にスコア上昇率が高かった上位自治体が実施した政策について調査し、分析結果をJSON形式で返してください。

  SDGsゴール: ${goal} - ${SDG_GOALS[goal]}
  対象自治体: ${municipalities.join(', ')}

  各自治体について、以下の情報を2〜3つの主要な政策に絞って提供してください。
  - 政策名
  - 実施年度 (2015年から2020年の間)
  - 予算規模 (概算で良い。例: 〇〇億円、〇〇千万円)
  - 政策の簡単な説明と、それがSDGsゴール達成にどのように寄与したと考えられるか

  分析結果を以下のJSON形式で返してください：

  {
    "goal": ${goal},
    "analysis": "上位自治体の政策全体から見える傾向や共通点、または特筆すべき点について3〜5文で分析してください。",
    "municipalityPolicies": [
      {
        "municipality": "自治体名1",
        "policies": [
          {
            "name": "政策名1",
            "year": "実施年度 (例: 2017年)",
            "budget": "予算規模 (例: 5億円)",
            "description": "政策の説明とSDGsゴールへの寄与 (2〜3文)"
          }
        ]
      }
    ]
  }

  制約:
  - 政策は2015年から2020年の間に実施されたものに限定してください。
  - 予算規模は概算で構いません。
  - 必ずJSON形式のみで回答してください。
  `;

  const body = JSON.stringify({
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.9,
      maxOutputTokens: 8192,
    }
  });

  // 最大2回まで試行（モデル切替 + バックオフ）
  const models = [primaryModel, fallbackModel];
  for (let attempt = 0; attempt < models.length; attempt++) {
    const model = models[attempt];
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Gemini API error (model=${model}): ${response.status} ${errorText}`);
        // 次の試行へ
      } else {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          console.warn('AI response is empty');
        } else {
          const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          try {
            const parsedData = JSON.parse(cleanedText);
            return {
              analysis: parsedData.analysis || "分析データの取得に失敗しました。",
              municipalityPolicies: parsedData.municipalityPolicies || []
            };
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Raw text:', cleanedText);
            return buildFallback(goal, municipalities);
          }
        }
      }
    } catch (err) {
      console.warn('Gemini fetch failed:', err);
    }
    // バックオフ
    await new Promise(r => setTimeout(r, 800));
  }

  // すべて失敗した場合はフォールバックを返す
  return buildFallback(goal, municipalities);
}

export async function POST(request: NextRequest) {
  try {
    const { goal, municipalities }: PolicyResearchRequest = await request.json();

    if (goal < 1 || goal > 17) {
      return NextResponse.json(
        { error: 'ゴール番号は1-17の範囲で指定してください' },
        { status: 400 }
      );
    }

    if (!municipalities || municipalities.length === 0) {
      return NextResponse.json(
        { error: '市区町村リストを指定してください' },
        { status: 400 }
      );
    }

    // まずキャッシュから確認
    const cachedResult = getCachedPolicyResearch(goal, municipalities);
    if (cachedResult) {
      console.log(`📚 キャッシュから政策調査結果を取得しました (ゴール${goal})`);
      return NextResponse.json({
        ...cachedResult,
        fromCache: true
      });
    }

    // キャッシュにない場合はAI分析を実行
    console.log(`🤖 新しい政策調査を実行します (ゴール${goal})`);
    const research = await generatePolicyResearch(goal, municipalities);

    const response: PolicyResearchResponse = {
      goal,
      analysis: research.analysis,
      municipalityPolicies: research.municipalityPolicies
    };
    
    // 結果をキャッシュに保存
    savePolicyResearchCache(goal, municipalities, response);
    
    return NextResponse.json({
      ...response,
      fromCache: false
    });

  } catch (error: unknown) {
    console.error('Error in policy research API:', error);
    
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';

    return NextResponse.json(
      { error: `サーバーエラー: ${errorMessage}` },
      { status: 500 }
    );
  }
}