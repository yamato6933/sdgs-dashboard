export interface MunicipalityData {
  id: string;
  name: string;
  population: number;
  area: number;
  prefecture: string;
  scores: {
    overall: number;
    goals: number[];
  };
}

export interface SdgsScore {
  id: number;
  municipality: string;
  goal_1: number;
  goal_2: number;
  goal_3: number;
  goal_4: number;
  goal_5: number;
  goal_6: number;
  goal_7: number;
  goal_8: number;
  goal_9: number;
  goal_10: number;
  goal_11: number;
  goal_12: number;
  goal_13: number;
  goal_14: number;
  goal_15: number;
  goal_16: number;
  goal_17: number;
}

// ユーティリティ関数: SdgsScoreから目標配列を抽出
export function extractGoalsArray(score: SdgsScore): number[] {
  return [
    score.goal_1, score.goal_2, score.goal_3, score.goal_4, score.goal_5,
    score.goal_6, score.goal_7, score.goal_8, score.goal_9, score.goal_10,
    score.goal_11, score.goal_12, score.goal_13, score.goal_14, score.goal_15,
    score.goal_16, score.goal_17
  ];
}

// ユーティリティ関数: 目標配列から総合スコアを計算
export function calculateOverallScore(goals: number[]): number {
  return Math.round(goals.reduce((sum, score) => sum + score, 0) / goals.length);
}
