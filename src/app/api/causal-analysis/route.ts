import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

interface CausalAnalysisRequest {
  targetMunicipality: string;
  targetGoal: number;
  controlMunicipalities: string[];
}

interface CausalAnalysisResponse {
  targetMunicipality: string;
  targetGoal: number;
  targetScore2015: number;
  targetScore2020: number;
  targetDiff: number;
  controlScore2015: number;
  controlScore2020: number;
  controlDiff: number;
  didEffect: number;
  tStatistic: number;
  pValue: number;
  significance: string;
  nationalAvgDiff: number;
  controlGroupDiffs: number[];
  effectInterpretation: string;
}

// t分布の累積分布関数の近似計算（正則化不完全ベータを使用）
function tCDF(t: number, df: number): number {
  if (!isFinite(t) || df <= 0) return NaN;
  if (t === 0) return 0.5;
  const x = df / (df + t * t);
  const a = df / 2;
  const b = 0.5;
  const Ix = incompleteBeta(a, b, x); // 正則化不完全ベータ関数 I_x(a,b)
  // 参考: https://dl.acm.org/doi/10.1145/263867.263872 （Numerical Recipes 実装と同様）
  return t > 0 ? 1 - 0.5 * Ix : 0.5 * Ix;
}

// 不完全ベータ関数の近似計算
function incompleteBeta(a: number, b: number, x: number): number {
  if (x === 0) return 0;
  if (x === 1) return 1;
  
  // 連分数展開による近似
  const bt = Math.exp(
    gammaLn(a + b) - gammaLn(a) - gammaLn(b) + 
    a * Math.log(x) + b * Math.log(1 - x)
  );
  
  if (x < (a + 1) / (a + b + 2)) {
    return bt * betacf(a, b, x) / a;
  } else {
    return 1 - bt * betacf(b, a, 1 - x) / b;
  }
}

// ガンマ関数の対数の近似計算
function gammaLn(x: number): number {
  const cof = [
    76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5
  ];
  
  let ser = 1.000000000190015;
  const xx = x;
  let y = xx;
  let tmp = xx + 5.5;
  tmp -= (xx + 0.5) * Math.log(tmp);
  
  for (let j = 0; j <= 5; j++) {
    ser += cof[j] / ++y;
  }
  
  return -tmp + Math.log(2.5066282746310005 * ser / xx);
}

// 連分数の計算
function betacf(a: number, b: number, x: number): number {
  const maxIterations = 100;
  const eps = 3.0e-7;
  const fpmin = 1.0e-30;
  
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - qab * x / qap;
  
  if (Math.abs(d) < fpmin) d = fpmin;
  d = 1 / d;
  let h = d;
  
  for (let m = 1; m <= maxIterations; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < fpmin) d = fpmin;
    c = 1 + aa / c;
    if (Math.abs(c) < fpmin) c = fpmin;
    d = 1 / d;
    h *= d * c;
    
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < fpmin) d = fpmin;
    c = 1 + aa / c;
    if (Math.abs(c) < fpmin) c = fpmin;
    d = 1 / d;
    const del = d * c;
    h *= del;
    
    if (Math.abs(del - 1) < eps) break;
  }
  
  return h;
}

// 因果推論分析の実行
function performCausalAnalysis(
  targetMunicipality: string,
  targetGoal: number,
  controlMunicipalities: string[]
): CausalAnalysisResponse {
  const db2015Path = path.join(process.cwd(), 'data', 'sdgs_scores_2015.db');
  const db2020Path = path.join(process.cwd(), 'data', 'sdgs_scores.db');
  
  const db2015 = new Database(db2015Path);
  const db2020 = new Database(db2020Path);
  
  try {
    const goalColumn = `goal_${targetGoal}`;
    
    // 2015年データ取得
    const all2015Data = db2015.prepare(`
      SELECT municipality, ${goalColumn} as score
      FROM sdgs_scores 
    `).all() as { municipality: string; score: number }[];
    
    // 2020年データ取得
    const all2020Data = db2020.prepare(`
      SELECT municipality, ${goalColumn} as score
      FROM sdgs_scores 
    `).all() as { municipality: string; score: number }[];
    
    // ターゲット市のデータ
    const target2015 = all2015Data.find(d => d.municipality === targetMunicipality);
    const target2020 = all2020Data.find(d => d.municipality === targetMunicipality);
    
    if (!target2015 || !target2020) {
      throw new Error(`ターゲット市 "${targetMunicipality}" のデータが見つかりません`);
    }
    
    // 対照群のデータ
    const control2015 = all2015Data.filter(d => controlMunicipalities.includes(d.municipality));
    const control2020 = all2020Data.filter(d => controlMunicipalities.includes(d.municipality));
    
    if (control2015.length === 0 || control2020.length === 0) {
      throw new Error('対照群のデータが見つかりません');
    }
    
    // 全国平均の変化量計算
    const national2015Avg = all2015Data.reduce((sum, d) => sum + d.score, 0) / all2015Data.length;
    const national2020Avg = all2020Data.reduce((sum, d) => sum + d.score, 0) / all2020Data.length;
    const nationalAvgDiff = national2020Avg - national2015Avg;
    
    // ターゲット市の変化量
    const targetScore2015 = target2015.score;
    const targetScore2020 = target2020.score;
    const targetDiff = targetScore2020 - targetScore2015;
    
    // 対照群の平均変化量
    const controlScore2015 = control2015.reduce((sum, d) => sum + d.score, 0) / control2015.length;
    const controlScore2020 = control2020.reduce((sum, d) => sum + d.score, 0) / control2020.length;
    const controlDiff = controlScore2020 - controlScore2015;
    
    // 対照群の個別変化量
    const controlGroupDiffs: number[] = [];
    for (const municipality of controlMunicipalities) {
      const c2015 = control2015.find(d => d.municipality === municipality);
      const c2020 = control2020.find(d => d.municipality === municipality);
      if (c2015 && c2020) {
        controlGroupDiffs.push(c2020.score - c2015.score);
      }
    }
    
    // DiD効果の計算
    const didEffect = targetDiff - controlDiff;
    
    // t検定の計算（単一観測値と標本平均の差: 標準誤差 = s * sqrt(1 + 1/n)）
    const n = controlGroupDiffs.length;
    const controlMean = controlGroupDiffs.reduce((sum, diff) => sum + diff, 0) / n;
    const controlVariance = controlGroupDiffs.reduce((sum, diff) => sum + Math.pow(diff - controlMean, 2), 0) / (n - 1);
    const controlStd = Math.sqrt(controlVariance);
    const se = controlStd * Math.sqrt(1 + 1 / n);
    const degreesOfFreedom = n - 1;

    let tStatistic: number;
    let pValue: number;
    if (!isFinite(se) || se === 0 || degreesOfFreedom <= 0) {
      const equal = Math.abs(targetDiff - controlMean) < 1e-9;
      tStatistic = 0;
      pValue = equal ? 1 : 1e-12; // 分散ゼロ時: 完全一致ならp=1, それ以外は非常に小さいp
    } else {
      tStatistic = (targetDiff - controlMean) / se;
      pValue = 2 * (1 - tCDF(Math.abs(tStatistic), degreesOfFreedom));
    }
    const significance = pValue < 0.05 ? "有意" : "有意でない";
    
    // 効果の解釈
    let effectInterpretation = "";
    if (pValue < 0.01) {
      effectInterpretation = didEffect > 0 ? 
        "統計的に非常に有意な正の政策効果が認められます（1%水準）" :
        "統計的に非常に有意な負の政策効果が認められます（1%水準）";
    } else if (pValue < 0.05) {
      effectInterpretation = didEffect > 0 ? 
        "統計的に有意な正の政策効果が認められます（5%水準）" :
        "統計的に有意な負の政策効果が認められます（5%水準）";
    } else if (pValue < 0.1) {
      effectInterpretation = didEffect > 0 ? 
        "統計的に弱い正の政策効果の傾向が見られます（10%水準）" :
        "統計的に弱い負の政策効果の傾向が見られます（10%水準）";
    } else {
      effectInterpretation = "統計的に有意な政策効果は認められません";
    }
    
    return {
      targetMunicipality,
      targetGoal,
      targetScore2015: Math.round(targetScore2015 * 10) / 10,
      targetScore2020: Math.round(targetScore2020 * 10) / 10,
      targetDiff: Math.round(targetDiff * 1000) / 1000,
      controlScore2015: Math.round(controlScore2015 * 10) / 10,
      controlScore2020: Math.round(controlScore2020 * 10) / 10,
      controlDiff: Math.round(controlDiff * 1000) / 1000,
      didEffect: Math.round(didEffect * 1000) / 1000,
      tStatistic: Math.round(tStatistic * 1000) / 1000,
      pValue: Math.round(pValue * 100000) / 100000,
      significance,
      nationalAvgDiff: Math.round(nationalAvgDiff * 1000) / 1000,
      controlGroupDiffs: controlGroupDiffs.map(d => Math.round(d * 1000) / 1000),
      effectInterpretation
    };
    
  } finally {
    db2015.close();
    db2020.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { targetMunicipality, targetGoal, controlMunicipalities }: CausalAnalysisRequest = await request.json();

    if (!targetMunicipality) {
      return NextResponse.json(
        { error: 'ターゲット市区町村名を指定してください' },
        { status: 400 }
      );
    }

    if (!targetGoal || targetGoal < 1 || targetGoal > 17) {
      return NextResponse.json(
        { error: 'ゴール番号は1-17の範囲で指定してください' },
        { status: 400 }
      );
    }

    if (!controlMunicipalities || controlMunicipalities.length === 0) {
      return NextResponse.json(
        { error: '対照群の市区町村リストを指定してください' },
        { status: 400 }
      );
    }

    const result = performCausalAnalysis(targetMunicipality, targetGoal, controlMunicipalities);

    return NextResponse.json(result);

  } catch (error: unknown) {
    console.error('Error in causal analysis API:', error);
    
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';

    return NextResponse.json(
      { error: `サーバーエラー: ${errorMessage}` },
      { status: 500 }
    );
  }
}
