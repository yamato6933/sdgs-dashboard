import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

interface SimilarMunicipalityRequest {
  targetMunicipality: string;
  targetGoal: number;
  excludeList?: string[];
}

interface SimilarMunicipalityResult {
  municipality: string;
  distance: number;
  scores2015: number[];
  scores2020: number[];
}

interface SimilarMunicipalityResponse {
  targetMunicipality: string;
  targetGoal: number;
  targetScores2015: number[];
  targetScores2020: number[];
  similarMunicipalities: SimilarMunicipalityResult[];
}

// 2015年データからユークリッド距離で類似市区町村を取得
function getSimilarMunicipalities(targetMunicipality: string, excludeList: string[] = []): SimilarMunicipalityResponse {
  const db2015Path = path.join(process.cwd(), 'data', 'sdgs_scores_2015.db');
  const db2020Path = path.join(process.cwd(), 'data', 'sdgs_scores.db');
  
  const db2015 = new Database(db2015Path);
  const db2020 = new Database(db2020Path);
  
  try {
    // 2015年の全データを取得
    const all2015Data = db2015.prepare(`
      SELECT municipality, goal_1, goal_2, goal_3, goal_4, goal_5, goal_6, goal_7, goal_8, goal_9, 
             goal_10, goal_11, goal_12, goal_13, goal_14, goal_15, goal_16, goal_17
      FROM sdgs_scores 
      ORDER BY municipality
    `).all() as {
      municipality: string;
      goal_1: number; goal_2: number; goal_3: number; goal_4: number; goal_5: number; goal_6: number; goal_7: number; goal_8: number; goal_9: number;
      goal_10: number; goal_11: number; goal_12: number; goal_13: number; goal_14: number; goal_15: number; goal_16: number; goal_17: number;
    }[];
    
    // 2020年の全データを取得
    const all2020Data = db2020.prepare(`
      SELECT municipality, goal_1, goal_2, goal_3, goal_4, goal_5, goal_6, goal_7, goal_8, goal_9, 
             goal_10, goal_11, goal_12, goal_13, goal_14, goal_15, goal_16, goal_17
      FROM sdgs_scores 
      ORDER BY municipality
    `).all() as {
      municipality: string;
      goal_1: number; goal_2: number; goal_3: number; goal_4: number; goal_5: number; goal_6: number; goal_7: number; goal_8: number; goal_9: number;
      goal_10: number; goal_11: number; goal_12: number; goal_13: number; goal_14: number; goal_15: number; goal_16: number; goal_17: number;
    }[];
    
    // 対象市区町村の2015年データを取得
    const targetData2015 = all2015Data.find(item => item.municipality === targetMunicipality);
    if (!targetData2015) {
      throw new Error(`対象市区町村 "${targetMunicipality}" が見つかりません`);
    }
    
    // 対象市区町村の2020年データを取得
    const targetData2020 = all2020Data.find(item => item.municipality === targetMunicipality);
    
    // 対象市区町村のスコアベクトル（2015年）
    const targetScores2015 = [
      targetData2015.goal_1, targetData2015.goal_2, targetData2015.goal_3, targetData2015.goal_4,
      targetData2015.goal_5, targetData2015.goal_6, targetData2015.goal_7, targetData2015.goal_8,
      targetData2015.goal_9, targetData2015.goal_10, targetData2015.goal_11, targetData2015.goal_12,
      targetData2015.goal_13, targetData2015.goal_14, targetData2015.goal_15, targetData2015.goal_16,
      targetData2015.goal_17
    ];
    
    const targetScores2020 = targetData2020 ? [
      targetData2020.goal_1, targetData2020.goal_2, targetData2020.goal_3, targetData2020.goal_4,
      targetData2020.goal_5, targetData2020.goal_6, targetData2020.goal_7, targetData2020.goal_8,
      targetData2020.goal_9, targetData2020.goal_10, targetData2020.goal_11, targetData2020.goal_12,
      targetData2020.goal_13, targetData2020.goal_14, targetData2020.goal_15, targetData2020.goal_16,
      targetData2020.goal_17
    ] : [];
    
    // 全市区町村との距離計算
    const similarities: SimilarMunicipalityResult[] = [];
    
    for (const municipality2015 of all2015Data) {
      // 対象市区町村自身と除外リストをスキップ
      if (municipality2015.municipality === targetMunicipality || 
          excludeList.includes(municipality2015.municipality)) {
        continue;
      }
      
      // スコアベクトル取得
      const scores2015 = [
        municipality2015.goal_1, municipality2015.goal_2, municipality2015.goal_3, municipality2015.goal_4,
        municipality2015.goal_5, municipality2015.goal_6, municipality2015.goal_7, municipality2015.goal_8,
        municipality2015.goal_9, municipality2015.goal_10, municipality2015.goal_11, municipality2015.goal_12,
        municipality2015.goal_13, municipality2015.goal_14, municipality2015.goal_15, municipality2015.goal_16,
        municipality2015.goal_17
      ];
      
      // 2020年データも取得
      const municipality2020 = all2020Data.find(item => item.municipality === municipality2015.municipality);
      const scores2020 = municipality2020 ? [
        municipality2020.goal_1, municipality2020.goal_2, municipality2020.goal_3, municipality2020.goal_4,
        municipality2020.goal_5, municipality2020.goal_6, municipality2020.goal_7, municipality2020.goal_8,
        municipality2020.goal_9, municipality2020.goal_10, municipality2020.goal_11, municipality2020.goal_12,
        municipality2020.goal_13, municipality2020.goal_14, municipality2020.goal_15, municipality2020.goal_16,
        municipality2020.goal_17
      ] : [];
      
      // ユークリッド距離計算
      let sumSquaredDiff = 0;
      for (let i = 0; i < targetScores2015.length; i++) {
        const diff = targetScores2015[i] - scores2015[i];
        sumSquaredDiff += diff * diff;
      }
      const distance = Math.sqrt(sumSquaredDiff);
      
      similarities.push({
        municipality: municipality2015.municipality,
        distance: Math.round(distance * 100) / 100, // 小数点第2位まで
        scores2015,
        scores2020
      });
    }
    
    // 距離でソートして上位20件取得
    similarities.sort((a, b) => a.distance - b.distance);
    const top20Similar = similarities.slice(0, 20);
    
    return {
      targetMunicipality,
      targetGoal: 0, // 後で設定
      targetScores2015,
      targetScores2020,
      similarMunicipalities: top20Similar
    };
    
  } finally {
    db2015.close();
    db2020.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { targetMunicipality, targetGoal, excludeList = [] }: SimilarMunicipalityRequest = await request.json();

    if (!targetMunicipality) {
      return NextResponse.json(
        { error: '対象市区町村名を指定してください' },
        { status: 400 }
      );
    }

    if (!targetGoal || targetGoal < 1 || targetGoal > 17) {
      return NextResponse.json(
        { error: 'ゴール番号は1-17の範囲で指定してください' },
        { status: 400 }
      );
    }

    const result = getSimilarMunicipalities(targetMunicipality, excludeList);
    result.targetGoal = targetGoal;

    return NextResponse.json(result);

  } catch (error: unknown) {
    console.error('Error in similar municipalities API:', error);
    
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';

    return NextResponse.json(
      { error: `サーバーエラー: ${errorMessage}` },
      { status: 500 }
    );
  }
}
