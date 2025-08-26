import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

interface PolicyAnalysisResult {
  municipality: string;
  score2015: number;
  score2020: number;
  growthRate: number;
}

interface PolicyAnalysisResponse {
  goal: number;
  results: PolicyAnalysisResult[];
  summary: {
    averageGrowthRate: number;
    totalMunicipalities: number;
    improvementCount: number;
  };
}

// データベースから特定ゴールのスコアを取得
function getGoalScores(goal: number) {
  const db2015Path = path.join(process.cwd(), 'data', 'sdgs_scores_2015.db');
  const db2020Path = path.join(process.cwd(), 'data', 'sdgs_scores.db');
  
  const db2015 = new Database(db2015Path);
  const db2020 = new Database(db2020Path);
  
  const goalColumn = `goal_${goal}`;
  
  // 2015年データ取得
  const scores2015 = db2015.prepare(`
    SELECT municipality, ${goalColumn} as score 
    FROM sdgs_scores 
    ORDER BY municipality
  `).all() as { municipality: string; score: number }[];
  
  // 2020年データ取得
  const scores2020 = db2020.prepare(`
    SELECT municipality, ${goalColumn} as score 
    FROM sdgs_scores 
    ORDER BY municipality
  `).all() as { municipality: string; score: number }[];
  
  db2015.close();
  db2020.close();
  
  return { scores2015, scores2020 };
}

// 政策効果分析（上昇率ベスト5）
function analyzePolicyEffect(goal: number): PolicyAnalysisResponse {
  const { scores2015, scores2020 } = getGoalScores(goal);
  
  // 市町村名でマッピング
  const municipalityMap = new Map<string, { score2015: number; score2020: number }>();
  
  scores2015.forEach(item => {
    municipalityMap.set(item.municipality, { 
      score2015: item.score, 
      score2020: 0 
    });
  });
  
  scores2020.forEach(item => {
    const existing = municipalityMap.get(item.municipality);
    if (existing) {
      existing.score2020 = item.score;
    }
  });
  
  // 上昇率計算
  const results: PolicyAnalysisResult[] = [];
  let totalGrowthRate = 0;
  let improvementCount = 0;
  
  municipalityMap.forEach((data, municipality) => {
    if (data.score2015 > 0 && data.score2020 > 0) {
      const growthRate = (data.score2020 - data.score2015) / data.score2015;
      
      results.push({
        municipality,
        score2015: Math.round(data.score2015 * 10) / 10,
        score2020: Math.round(data.score2020 * 10) / 10,
        growthRate: Math.round(growthRate * 1000) / 10 // パーセント表示用
      });
      
      totalGrowthRate += growthRate;
      if (growthRate > 0) improvementCount++;
    }
  });
  
  // 上昇率でソート（降順）してベスト5取得
  results.sort((a, b) => b.growthRate - a.growthRate);
  const top5 = results.slice(0, 5);
  
  const summary = {
    averageGrowthRate: Math.round((totalGrowthRate / results.length) * 1000) / 10,
    totalMunicipalities: results.length,
    improvementCount
  };
  
  return {
    goal,
    results: top5,
    summary
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const goalParam = searchParams.get('goal');
    
    if (!goalParam) {
      return NextResponse.json(
        { error: 'ゴール番号を指定してください (goal=1-17)' },
        { status: 400 }
      );
    }
    
    const goal = parseInt(goalParam);
    
    if (isNaN(goal) || goal < 1 || goal > 17) {
      return NextResponse.json(
        { error: 'ゴール番号は1-17の範囲で指定してください' },
        { status: 400 }
      );
    }
    
    const analysis = analyzePolicyEffect(goal);
    
    return NextResponse.json(analysis);
    
  } catch (error) {
    console.error('Policy analysis error:', error);
    return NextResponse.json(
      { error: '政策分析の実行中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
