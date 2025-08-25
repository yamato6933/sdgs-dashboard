"use client";
import { useState, useEffect } from 'react';

interface MunicipalityData {
  id: string;
  name: string;
  prefecture: string;
  scores: {
    overall: number;
    goals: number[];
  };
}

interface AIInsightProps {
  municipalityData: MunicipalityData;
  className?: string;
}

interface InsightResponse {
  insight: string;
  cached: boolean;
  createdAt: string;
}

export default function AIInsight({ municipalityData, className = "" }: AIInsightProps) {
  const [insight, setInsight] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    if (municipalityData) {
      generateInsight();
    }
  }, [municipalityData]);

  const generateInsight = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const params = new URLSearchParams({
        municipalityId: municipalityData.id,
        municipality: municipalityData.name,
        prefecture: municipalityData.prefecture,
        overallScore: municipalityData.scores.overall.toString(),
        goalScores: JSON.stringify(municipalityData.scores.goals)
      });

      const response = await fetch(`/api/ai-insights?${params}`);
      
      if (!response.ok) {
        throw new Error('インサイトの取得に失敗しました');
      }

      const data: InsightResponse = await response.json();
      setInsight(data.insight);
      setIsCached(data.cached);
      
    } catch (err) {
      console.error('AI Insight Error:', err);
      setError('AI分析の生成中にエラーが発生しました。しばらく待ってから再試行してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    generateInsight();
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🤖</div>
          <h3 className="text-lg font-bold text-gray-900">AI インサイト</h3>
        </div>
        <div className="flex items-center space-x-2">
          {isCached && (
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              キャッシュ済み
            </span>
          )}
          <button
            onClick={handleRetry}
            disabled={isLoading}
            className="text-xs text-gray-500 hover:text-blue-600 transition-colors disabled:cursor-not-allowed"
          >
            🔄 再生成
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <div className="text-gray-600">
              <div className="text-sm font-medium">AI分析を生成中...</div>
              <div className="text-xs text-gray-500">Gemini AIが{municipalityData.prefecture}{municipalityData.name}のSDGsデータを分析しています</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-red-500 text-xl">⚠️</div>
            <div>
              <div className="text-red-800 font-medium text-sm">エラーが発生しました</div>
              <div className="text-red-700 text-sm mt-1">{error}</div>
              <button
                onClick={handleRetry}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                再試行する
              </button>
            </div>
          </div>
        </div>
      )}

      {insight && !isLoading && !error && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 text-lg mt-1">💡</div>
              <div>
                <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                  {insight}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>🧠 Powered by Gemini AI</span>
              <span>📊 {municipalityData.prefecture}{municipalityData.name}のデータを分析</span>
            </div>
            {isCached && (
              <span>💾 データベースから取得</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
