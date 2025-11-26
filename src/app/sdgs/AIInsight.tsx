"use client";
import { useState } from "react";
import { MunicipalityData} from "./types";

interface AIInsightProps{
    municipalityData: MunicipalityData | null;
}

interface AIInsightData {
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

export default function AIInsight({ municipalityData} : AIInsightProps) {
    const [insight, setInsight] = useState<AIInsightData | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error,setError] = useState<string | null>(null);

    const generateInsight = async () => {
        if(!municipalityData) {
            setError("市区町村データが選択されていません");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch("/api/ai-insights", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({
                    municipalityData,
                }),
            });

            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setInsight(data.insight);
        } catch(error){
            console.error("AI分析の生成に失敗しました:", error);
            setError("AI分析の生成に失敗しました。しばらく時間をおいて再度お試しください。");
        } finally {
            setIsGenerating(false);
        }
    };

    if(!municipalityData){
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🤖 AI インサイト</h3>
                <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">
                        市区町村を選択してからAI分析を実行してください
                     </div>
                </div>
             </div>
        );
    }

    return(
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900"> AI インサイト</h3>
                <button
                    onClick={generateInsight}
                    disabled={isGenerating}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isGenerating
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}>
                        {isGenerating ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                分析中...
                            </div>
                        ):(
                            "AI分析を実行"
                        )}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="text-red-800 font-medium">エラーが発生しました</div>
                    <div className="text-red-600 text-sm mt-1">{error}</div>
                </div>
            )}

            {insight ? (
                <div className="space-y-6">
                    <div className="text-sm text-gray-500">
                        分析対象: {insight.prefectureName} {insight.municipalityName}
                    </div>

                    {/*総合的なAI分析結果 */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">📊 AI分析結果</h4>
                        <div className="text-blue-800 whitespace-pre-wrap">{insight.insight}</div>
                    </div>

                    {/*市区町村の説明 */}
                    <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-3">市区町村の説明</h4>
                        <div className="text-blue-800 whitespace-pre-wrap">{insight.explanation}</div>
                    </div>

                    {/*最も高いゴール */}
                    <div className="bg-orange-50 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-900 mb-3">最も高いゴール</h4>
                        <div className="text-blue-800 whitespace-pre-wrap">{insight.strengths}</div>
                    </div>

                    {/*最も低いゴール */}
                    <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-900 mb-3">最も低いゴール</h4>
                        <div className="text-blue-800 whitespace-pre-wrap">{insight.improvements}</div>
                    </div>

                    {/*推奨アクション */}
                    {insight.recommendations && insight.recommendations.length > 0 &&(
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-semibold text-purple-900 mb-3">🎯 推奨アクション</h4>
                            <ul className="space-y-2">
                                {insight.recommendations.map((recommendation, index ) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-blue-600 mr-2">→</span>
                                        <span className="text-blue-800">{recommendation}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="text-xs text-gray-400 border-t pt-4">
                        分析日時: {new Date(insight.createdAt).toLocaleString("ja-JP")}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">
                        「AI分析を実行」ボタンをクリックして、選択した市区町村のSDGsスコアに対するAI分析を開始してください
                    </div>
                    <div className="text-sm text-gray-400">
                         ※ 一度生成した分析結果は自動的に保存され、次回以降は即座に表示されます
                    </div>
                </div>
            )}
        </div>   
    );
}
