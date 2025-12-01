"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getSdgsGoalsForChart } from '../sdgs/sdgs-data';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Sidebar } from '../components/Sidebar';

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
  fromCache?: boolean;
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

interface SelectedPolicy {
  municipality: string;
  policyName: string;
  year: string;
  budget: string;
  description: string;
}

type PolicyItem = PolicyResearchResponse['municipalityPolicies'][number]['policies'][number];

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

export default function PolicyPage() {
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const SDG_GOALS = getSdgsGoalsForChart().map(goal => ({
    id: goal.id,
    title: goal.title,
    image: `/sdgs_goals_icons/${goal.id}.png`
  }));
  const [analysisData, setAnalysisData] = useState<PolicyAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [policyResearch, setPolicyResearch] = useState<PolicyResearchResponse | null>(null);
  const [researchLoading, setResearchLoading] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<SelectedPolicy | null>(null);
  const [similarMunicipalities, setSimilarMunicipalities] = useState<SimilarMunicipalityResponse | null>(null);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [excludedMunicipalities, setExcludedMunicipalities] = useState<string[]>([]);
  const [causalAnalysis, setCausalAnalysis] = useState<CausalAnalysisResponse | null>(null);
  const [causalLoading, setCausalLoading] = useState(false);

  const handleGoalClick = async (goalId: number) => {
    setSelectedGoal(goalId);
    setLoading(true);
    
    try {
      const response = await fetch(`/api/policy-analysis?goal=${goalId}`);
      if (response.ok) {
        const data = await response.json();
        setAnalysisData(data);
      } else {
        console.error('分析データの取得に失敗しました');
      }
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToGoals = () => {
    setSelectedGoal(null);
    setAnalysisData(null);
    setPolicyResearch(null);
    setSelectedPolicy(null);
    setSimilarMunicipalities(null);
    setExcludedMunicipalities([]);
    setCausalAnalysis(null);
  };

  const handlePolicyResearch = async () => {
    if (!analysisData) return;
    
    setResearchLoading(true);
    try {
      const municipalities = analysisData.results.map(result => result.municipality);
      const response = await fetch('/api/policy-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: selectedGoal,
          municipalities: municipalities
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setPolicyResearch(data);
        
        // キャッシュ状態をコンソールに表示
        if (data.fromCache) {
          console.log('✅ キャッシュから政策調査結果を取得しました');
        } else {
          console.log('🤖 新しい政策調査を実行しました');
        }
      } else {
        const errorData = await response.json();
        console.error('政策調査の取得に失敗しました:', errorData.error);
      }
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setResearchLoading(false);
    }
  };

  const handlePolicySelect = (municipality: string, policy: PolicyItem) => {
    setSelectedPolicy({
      municipality,
      policyName: policy.name,
      year: policy.year,
      budget: policy.budget,
      description: policy.description
    });
  };

  const handleCreateSimilarGroup = async () => {
    if (!selectedPolicy || !selectedGoal) return;
    
    setSimilarLoading(true);
    try {
      const response = await fetch('/api/similar-municipalities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetMunicipality: selectedPolicy.municipality,
          targetGoal: selectedGoal,
          excludeList: excludedMunicipalities
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSimilarMunicipalities(data);
      } else {
        console.error('類似群作成に失敗しました');
      }
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setSimilarLoading(false);
    }
  };

  const handleToggleExclude = (municipality: string) => {
    setExcludedMunicipalities(prev => {
      if (prev.includes(municipality)) {
        return prev.filter(m => m !== municipality);
      } else {
        return [...prev, municipality];
      }
    });
  };

  const handleCausalAnalysis = async () => {
    if (!selectedPolicy || !selectedGoal || !similarMunicipalities) return;
    
    // 除外されていない類似市区町村を対照群として使用
    const controlMunicipalities = similarMunicipalities.similarMunicipalities
      .filter(similar => !excludedMunicipalities.includes(similar.municipality))
      .map(similar => similar.municipality)
      .slice(0, 20); // 上位20件を使用 
    
    if (controlMunicipalities.length < 3) {
      alert('対照群が少なすぎます。除外する市区町村を減らしてください。');
      return;
    }
    
    setCausalLoading(true);
    try {
      const response = await fetch('/api/causal-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetMunicipality: selectedPolicy.municipality,
          targetGoal: selectedGoal,
          controlMunicipalities: controlMunicipalities
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setCausalAnalysis(data);
      } else {
        const errorData = await response.json();
        console.error('因果推論分析に失敗しました:', errorData.error);
      }
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setCausalLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-green-50">
    <Sidebar />
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-6">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border mb-8">
          <div className="px-6 py-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-blue-700">SDGs政策効果分析</h1>
            <p className="mt-3 text-gray-600">分析したいSDGsゴールを選んで、政策の影響を検証します。</p>
          </div>
        </section>
      
      {!selectedGoal ? (
        // SDGsゴール選択画面
        <div>
          <p className="text-lg text-gray-700 mb-8 text-center">
            分析したいSDGsゴールをクリックしてください<br/>
            <span className="text-sm text-gray-500">
              2015年→2020年の自治体スコア改善率ベスト5を表示します
            </span>
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {SDG_GOALS.map((goal) => (
              <div
                key={goal.id}
                onClick={() => handleGoalClick(goal.id)}
                className="cursor-pointer transform hover:-translate-y-0.5 transition-all duration-200 bg-white rounded-xl shadow-sm hover:shadow-md p-4 border"
              >
                <div className="relative w-28 h-28 mx-auto mb-3">
                  <Image
                    src={goal.image}
                    alt={`SDG Goal ${goal.id}`}
                    fill
                    sizes="112px"
                    className="object-contain rounded-lg"
                    priority={goal.id <= 6}
                  />
                </div>
                <h3 className="text-sm font-semibold text-center text-gray-900 leading-tight">
                  ゴール{goal.id}
                </h3>
                <p className="text-xs text-center text-gray-600 mt-1">
                  {goal.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // 分析結果表示画面
        <div>
          <button
            onClick={handleBackToGoals}
            className="mb-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← ゴール選択に戻る
          </button>
          
          <div className="bg-white rounded-2xl shadow p-6 border">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 relative mr-4">
                <Image
                  src={SDG_GOALS[selectedGoal - 1].image}
                  alt={`SDG Goal ${selectedGoal}`}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-600">
                  ゴール{selectedGoal}: {SDG_GOALS[selectedGoal - 1].title}
                </h2>
                <p className="text-gray-600">政策効果分析結果 (2015年→2020年)</p>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">分析中...</p>
              </div>
            ) : analysisData ? (
              <div>
                {/* サマリー情報 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <h3 className="font-semibold text-blue-600">平均改善率</h3>
                    <p className="text-2xl font-bold text-blue-800">
                      {analysisData.summary.averageGrowthRate > 0 ? '+' : ''}
                      {analysisData.summary.averageGrowthRate}%
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <h3 className="font-semibold text-green-600">改善自治体数</h3>
                    <p className="text-2xl font-bold text-green-800">
                      {analysisData.summary.improvementCount}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h3 className="font-semibold text-gray-600">分析対象自治体</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {analysisData.summary.totalMunicipalities}
                    </p>
                  </div>
                </div>
                
                {/* ベスト5ランキング */}
                <h3 className="text-xl font-bold mb-4 text-green-600">
                  🏆 スコア改善率ベスト5
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-3 text-left">順位</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">自治体名</th>
                        <th className="border border-gray-300 px-4 py-3 text-right">2015年スコア</th>
                        <th className="border border-gray-300 px-4 py-3 text-right">2020年スコア</th>
                        <th className="border border-gray-300 px-4 py-3 text-right">改善率</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisData.results.map((result, index) => (
                        <tr key={result.municipality} className={index === 0 ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                          <td className="border border-gray-300 px-4 py-3 font-bold">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}位`}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 font-semibold">
                            {result.municipality}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right">
                            {result.score2015}点
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right">
                            {result.score2020}点
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right">
                            <span className={`font-bold ${result.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {result.growthRate > 0 ? '+' : ''}{result.growthRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-600 mb-2">💡 分析結果の解釈</h4>
                  <p className="text-sm text-blue-800">
                    改善率は (2020年スコア - 2015年スコア) ÷ 2015年スコア × 100 で計算されています。<br/>
                    プラスの値が大きいほど、そのゴールにおいて効果的な政策が実施された可能性があります。
                  </p>
                </div>
                
                {/* 政策調査ボタン */}
                <div className="mt-8 text-center">
                  <button
                    onClick={handlePolicyResearch}
                    disabled={researchLoading}
                    className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                      researchLoading
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {researchLoading ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        AIで政策を調査中...
                      </>
                    ) : (
                      '🔍 上位自治体の政策を調査する'
                    )}
                  </button>
                </div>
                
                {/* 政策調査結果 */}
                {policyResearch && (
                  <div className="mt-8 bg-purple-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 text-purple-600 flex items-center">
                      🔍 政策調査結果
                      {policyResearch.fromCache && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-lg">
                          📚 キャッシュから取得
                        </span>
                      )}
                      {policyResearch.fromCache === false && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-lg">
                          🤖 AI分析結果
                        </span>
                      )}
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        (AI分析による推測)
                      </span>
                    </h3>
                    
                    {/* 全体分析 */}
                    <div className="mb-6 p-4 bg-white rounded-lg border-l-4 border-purple-500">
                      <h4 className="font-semibold text-purple-600 mb-2">📊 全体傾向分析</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {policyResearch.analysis}
                      </p>
                    </div>
                    
                    {/* 各自治体の政策 */}
                    <div className="space-y-6">
                      {policyResearch.municipalityPolicies.map((municipalityPolicy, index) => (
                        <div key={municipalityPolicy.municipality} className="bg-white rounded-lg p-6 border">
                          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}位`}
                            <span className="ml-2">{municipalityPolicy.municipality}</span>
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {municipalityPolicy.policies.map((policy, policyIndex) => (
                              <div key={policyIndex} className="bg-gray-50 rounded-lg p-4 relative">
                                <button
                                  onClick={() => handlePolicySelect(municipalityPolicy.municipality, policy)}
                                  className="absolute top-2 right-2 px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                  選択
                                </button>
                                <h5 className="font-semibold text-purple-600 mb-2 pr-16">{policy.name}</h5>
                                <div className="space-y-1 text-sm text-gray-600 mb-2">
                                  <p><span className="font-medium">実施年度:</span> {policy.year}</p>
                                  <p><span className="font-medium">予算規模:</span> {policy.budget}</p>
                                </div>
                                <p className="text-sm text-gray-700">{policy.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <h4 className="font-semibold text-yellow-600 mb-2">⚠️ 注意事項</h4>
                      <p className="text-sm text-yellow-800">
                        この分析は AIによる推測であり、実際の政策や予算と異なる場合があります。<br/>
                        詳細な政策情報は各自治体の公式資料をご確認ください。
                      </p>
                    </div>
                  </div>
                )}
                
                {/* 選択された政策と類似群作成 */}
                {selectedPolicy && (
                  <div className="mt-8 bg-orange-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 text-orange-600 flex items-center">
                      📋 選択された政策
                    </h3>
                    
                    <div className="bg-white rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {selectedPolicy.municipality} - {selectedPolicy.policyName}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                        <p><span className="font-medium">実施年度:</span> {selectedPolicy.year}</p>
                        <p><span className="font-medium">予算規模:</span> {selectedPolicy.budget}</p>
                      </div>
                      <p className="text-sm text-gray-700">{selectedPolicy.description}</p>
                    </div>
                    
                    <div className="text-center mb-6">
                      <button
                        onClick={handleCreateSimilarGroup}
                        disabled={similarLoading}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                          similarLoading
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-orange-600 text-white hover:bg-orange-700'
                        }`}
                      >
                        {similarLoading ? (
                          <>
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            類似群を作成中...
                          </>
                        ) : (
                          '📊 類似市区町村群を作成'
                        )}
                      </button>
                    </div>
                    
                    {/* 類似群表示 */}
                    {similarMunicipalities && (
                      <div className="bg-white rounded-lg p-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">
                          🎯 類似市区町村群 (上位20件)
                        </h4>
                        
                        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                          <h5 className="font-semibold text-yellow-600 mb-2">⚠️ 政策効果測定の注意事項</h5>
                          <p className="text-sm text-yellow-800">
                            類似群は2015年時点でのSDGsスコアが似ている市区町村です。<br/>
                            効果的な比較のため、<strong>同じ政策を実施していない</strong>市区町村を選ぶことが重要です。<br/>
                            同じ政策を実施している市区町村があれば、チェックボックスで除外してください。
                          </p>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-300 px-3 py-2 text-left">除外</th>
                                <th className="border border-gray-300 px-3 py-2 text-left">順位</th>
                                <th className="border border-gray-300 px-3 py-2 text-left">市区町村名</th>
                                <th className="border border-gray-300 px-3 py-2 text-right">類似度スコア</th>
                                <th className="border border-gray-300 px-3 py-2 text-right">
                                  ゴール{selectedGoal} (2015年)
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-right">
                                  ゴール{selectedGoal} (2020年)
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-right">変化</th>
                              </tr>
                            </thead>
                            <tbody>
                              {similarMunicipalities.similarMunicipalities.map((similar, index) => {
                                const goalIndex = (selectedGoal || 1) - 1;
                                const score2015 = similar.scores2015[goalIndex];
                                const score2020 = similar.scores2020[goalIndex];
                                const change = score2020 - score2015;
                                const isExcluded = excludedMunicipalities.includes(similar.municipality);
                                
                                return (
                                  <tr 
                                    key={similar.municipality} 
                                    className={`${isExcluded ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                                  >
                                    <td className="border border-gray-300 px-3 py-2 text-center">
                                      <input
                                        type="checkbox"
                                        checked={isExcluded}
                                        onChange={() => handleToggleExclude(similar.municipality)}
                                        className="w-4 h-4 text-red-600 rounded"
                                      />
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">
                                      {index + 1}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 font-medium">
                                      {similar.municipality}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-right">
                                      {similar.distance}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-right">
                                      {score2015?.toFixed(1)}点
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-right">
                                      {score2020?.toFixed(1)}点
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-right">
                                      <span className={`${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                        {change > 0 ? '+' : ''}{change?.toFixed(1)}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="mt-4 text-sm text-gray-600">
                          <p><strong>類似度スコア:</strong> 数値が小さいほど類似度が高い（ユークリッド距離）</p>
                          <p><strong>除外済み:</strong> {excludedMunicipalities.length}件</p>
                        </div>
                        
                        {/* 因果推論分析ボタン */}
                        <div className="mt-6 text-center">
                          <button
                            onClick={handleCausalAnalysis}
                            disabled={causalLoading}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                              causalLoading
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {causalLoading ? (
                              <>
                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                因果推論分析中...
                              </>
                            ) : (
                              '📊 因果推論分析を実行（DiD分析）'
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* 因果推論分析結果 */}
                    {causalAnalysis && (
                      <div className="mt-8 bg-red-50 rounded-lg p-6">
                        <h4 className="text-lg font-bold text-red-600 mb-4">
                          📈 因果推論分析結果（Difference-in-Differences）
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* 基本統計 */}
                          <div className="bg-white rounded-lg p-4">
                            <h5 className="font-semibold text-gray-800 mb-3">📊 基本統計</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>対象市区町村:</span>
                                <span className="font-medium">{causalAnalysis.targetMunicipality}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>分析ゴール:</span>
                                <span className="font-medium">ゴール{causalAnalysis.targetGoal}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>対照群数:</span>
                                <span className="font-medium">{causalAnalysis.controlGroupDiffs.length}件</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* スコア変化 */}
                          <div className="bg-white rounded-lg p-4">
                            <h5 className="font-semibold text-gray-800 mb-3">📈 スコア変化</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>対象市 (2015→2020):</span>
                                <span className="font-medium">
                                  {causalAnalysis.targetScore2015} → {causalAnalysis.targetScore2020}
                                  <span className={`ml-1 ${causalAnalysis.targetDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ({causalAnalysis.targetDiff > 0 ? '+' : ''}{causalAnalysis.targetDiff})
                                  </span>
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>対照群平均 (2015→2020):</span>
                                <span className="font-medium">
                                  {causalAnalysis.controlScore2015} → {causalAnalysis.controlScore2020}
                                  <span className={`ml-1 ${causalAnalysis.controlDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ({causalAnalysis.controlDiff > 0 ? '+' : ''}{causalAnalysis.controlDiff})
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* DiD効果と統計検定 */}
                        <div className="bg-white rounded-lg p-6 border-l-4 border-red-500">
                          <h5 className="font-semibold text-red-600 mb-4">🎯 DiD効果と統計的検定</h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-red-600">
                                {causalAnalysis.didEffect > 0 ? '+' : ''}{causalAnalysis.didEffect}
                              </div>
                              <div className="text-sm text-gray-600">DiD効果</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {causalAnalysis.tStatistic}
                              </div>
                              <div className="text-sm text-gray-600">t統計量</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">
                                {causalAnalysis.pValue}
                              </div>
                              <div className="text-sm text-gray-600">p値</div>
                            </div>
                          </div>
                          
                          <div className={`p-4 rounded-lg text-center ${
                            causalAnalysis.significance === "有意" 
                              ? 'bg-green-100 border border-green-300' 
                              : 'bg-yellow-100 border border-yellow-300'
                          }`}>
                            <div className={`text-lg font-bold ${
                              causalAnalysis.significance === "有意" ? 'text-green-700' : 'text-yellow-700'
                            }`}>
                              {causalAnalysis.significance === "有意" ? '✅ 統計的に有意' : '⚠️ 統計的に有意でない'}
                            </div>
                            <div className="text-sm mt-2 text-gray-700">
                              {causalAnalysis.effectInterpretation}
                            </div>
                          </div>
                        </div>
                        
                        {/* 解釈ガイド */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <h5 className="font-semibold text-blue-600 mb-2">📘 結果の解釈</h5>
                          <div className="text-sm text-blue-800 space-y-1">
                            <p><strong>DiD効果:</strong> 対照群と比較した場合の政策による純粋な効果</p>
                            <p><strong>正の値:</strong> 政策が効果的であったことを示唆</p>
                            <p><strong>負の値:</strong> 政策が逆効果であった可能性を示唆</p>
                            <p><strong>統計的有意性:</strong> p &lt; 0.05 で統計的に意味のある効果と判断</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-600">データの読み込みに失敗しました</p>
            )}
          </div>
        </div>
      )}
      </main>
    </div>
    </div>
    <Footer />
    </>
  );
}
