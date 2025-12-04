"use client";
import { useState } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { MunicipalityData } from "../sdgs/types";
import { SelectOb_Policy } from "./SelectOb_Policy";
import Image from "next/image";
import Input from "@mui/material/Input";
import { IndexDataGoal4, PolicyActionsGoal4, TargetDataGoal4 } from "./IndexData";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { LoadingSpinner } from "./LoadingScreen";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GOAL_IDS = Array.from({ length: 17 }, (_, i) => i + 1);

const getChartData = (indicatorId: number) => {
    const goalData = IndexDataGoal4.find(goal => goal.goal === 4);
    if (!goalData) return null;

    const indicator = goalData.indicators.find(ind => ind.id === indicatorId);
    if (!indicator) return null;

    const target = TargetDataGoal4.find(t => t.target === indicatorId);
    if (!target) return null;

    return {
        labels: ["姫路市", "目標値"],
        datasets: [
            {
                label: indicator.title,
                data: [indicator.score, target.targetScore],
                backgroundColor: ['rgba(53, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)'],
            },
        ],
    };
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};


export default function PolicyMaking() {
    const [currentData, setCurrentData] = useState<MunicipalityData | null>(null);
    const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
    const [selectIndex, setSelectIndex] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: '指標の目標値との差',
            }
        },
    }

    const data = {
        labels : ["姫路市", "目標値"],
        datasets: [
            {
                label: "事業所当たり純付加価値額（教育、学習支援業）",
                data: [25.325, 65.47539],
                backgroundColor: ['rgba(53, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)'],
            },
        ],
    }

    const chartData = selectIndex ? getChartData(selectIndex) : null;

    const handleGoalClick = (goalId: number) => {
        setSelectedGoal(selectedGoal === goalId ? null : goalId);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000); // ローディング表示を1秒間維持

    };

    const handleMunicipalitySelect = (municipality: MunicipalityData | null) => {
        if (municipality) {
            setCurrentData(municipality);
        } else {
            setCurrentData(null);
            setSelectedGoal(null); // 自治体を変えたらゴール選択もリセット
        }
    };

    return (
        <>
            <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-green-50">
                <Sidebar />
                <div className="flex-1 flex flex-col min-h-screen">
                    <Header />
                    {loading ? (<LoadingSpinner />) : (<main className="flex-1 p-6">
                        {!currentData && (
                            <>
                                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">政策立案モード</h2>
                                <SelectOb_Policy currentData={currentData} onMunicipalitySelect={handleMunicipalitySelect} />
                                <div className="bg-white mt-6 rounded-xl shadow-sm">
                                    <div className="max-w-7xl mx-auto px-10 py-6">
                                        <p className="text-gray-700 text-center mb-4">指標改善の重要度を1.5~2.0の範囲で設定してください。</p>
                                        <div className="flex justify-center">
                                            <Input defaultValue="1.0" inputProps={{ 'aria-label': 'description' }} className="w-32 text-center" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {currentData && (
                            <>
                                <div className="grid max-w-7xl mx-auto px-10 py-2 grid-cols-4 gap-6">
                                    <div className="col-span-3 bg-white rounded-xl shadow-sm p-4 justify-center">
                                        <h2 className="text-xl font-bold text-center text-gray-900 mb-4">選択中: {currentData.prefecture} {currentData.name}</h2>
                                        <p className="text-gray-700 text-center">{currentData.name}の各ゴールの改善すべき指標とその政策を提案します。</p>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <button
                                            onClick={() => setCurrentData(null)}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            市区町村選択に戻る
                                        </button>
                                    </div>
                                </div>

                                {!selectedGoal && (
                                    <>
                                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                                            {GOAL_IDS.map((goalId) => (
                                                <button
                                                    key={goalId}
                                                    onClick={() => handleGoalClick(goalId)}
                                                    className="relative group rounded-lg p-1 transition-all duration-200 hover:scale-110"
                                                    style={{ width: 'calc(100% / 18)' }} 
                                                >
                                                    <Image
                                                        src={`/sdgs_goals_icons/${goalId}.png`}
                                                        alt={`SDG ${goalId} アイコン`}
                                                        width={48}
                                                        height={48}
                                                        className="w-full h-auto object-contain"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-4 text-center text-gray-600">
                                            <p>各ゴールのアイコンをクリックして、指標と政策提案を表示します</p>
                                        </div>
                                    </>
                                )}

                                <div className="mt-6">
                                    {selectedGoal && (
                                        <>
                                            <div className="grid grid-cols-4 bg-white rounded-xl shadow-sm p-8 h-[620px] gap-6">
                                                <div className="col-span-3 flex flex-col h-full">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-4">GOAL {selectedGoal} に関する指標と政策提案</h3>
                                                    <iframe
                                                        src={`/himejiNetwork.html`}
                                                        title={`姫路の政策提案`}
                                                        className="flex-1 w-full border rounded-lg bg-gray-50"
                                                    ></iframe>
                                                </div>
                                                <div className="col-span-1 pl-6 border-l flex flex-col items-center justify-start h-full">
                                                    <Image
                                                        src={`/sdgs_goals_icons/${selectedGoal}.png`}
                                                        alt={`SDG ${selectedGoal} アイコン`}
                                                        width={96}
                                                        height={96}
                                                        className="w-24 h-auto object-contain mb-6"
                                                    />
                                                    <button
                                                        onClick={() => handleGoalClick(selectedGoal)}
                                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors w-full font-bold">
                                                        一覧に戻る
                                                    </button>
                                                    <div className="flex-1 w-full min-h-[300px] mt-4 relative">
                                                        {chartData && <Bar data={chartData} options={options}/>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                                                <h3 className="text-lg font-bold text-gray-900 mb-4">GOAL {selectedGoal} に関する指標一覧と政策立案</h3>
                                                {IndexDataGoal4.filter((goalData) => goalData.goal === selectedGoal).map((goalData) => (
                                                    <div key={goalData.goal} className="space-y-4">
                                                        {goalData.indicators.map((indicator) => {
                                                            // 修正点4: 変数定義と return の構文を修正
                                                            const matchedActions = PolicyActionsGoal4.find((action) => action.indicatorId === indicator.id)?.actions ?? [];
                                                            const targetScore = TargetDataGoal4.find((target) => target.target === indicator.id)?.targetScore || 'N/A';

                                                            return (
                                                                <div key={indicator.id} className="border rounded-lg overflow-hidden">
                                                                    <div className="bg-blue-50 flex justify-between items-center px-4 py-3">
                                                                        <h4 className="text-md font-semibold text-gray-900" onClick={() => {setSelectIndex(indicator.id)}}>
                                                                            {indicator.title}
                                                                        </h4>
                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectIndex(indicator.id)
                                                                                scrollToTop();}}
                                                                            className="mt-2 px-4 py-1 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition-colors text-sm font-medium">
                                                                            この指標の目標値との差を見る
                                                                        </button>

                                                                    </div>
                                                                    <div className="grid grid-cols-3 border-t border-gray-200">
                                                                        <div className="col-span-1 p-4 bg-gray-50">
                                                                            {matchedActions.length > 0 ? (
                                                                                <>
                                                                                <div className="mb-2">
                                                                                    <span className="text-xs text-gray-500 block">現在のスコア</span>
                                                                                    <span className="text-lg font-bold text-gray-800">{indicator.score}</span>
                                                                                </div>
                                                                                <div>
                                                                                    <span className="text-xs text-gray-500 block">目標スコア</span>
                                                                                    <span className="text-lg font-bold text-green-600">{targetScore}</span>
                                                                                </div>
                                                                                </>) : (
                                                                                <>
                                                                                <div className="mb-2">
                                                                                    <span className="text-xs text-gray-500 block">現在のスコア</span>
                                                                                    <span className="text-lg font-bold text-gray-800">{indicator.score}</span>
                                                                                </div>
                                                                                <div>
                                                                                    <span className="text-xs text-gray-500 block">目標スコア</span>
                                                                                    <span className="text-lg font-bold text-gray-800">{targetScore}</span>
                                                                                </div>
                                                                                </>
                                                                                )
                                                                                }
                                                                        </div>
                                                                        <div className="col-span-2 border-l border-gray-200 px-4 py-3 bg-white">
                                                                            <h1 className="text-lg mb-2 font-bold">政策の提案</h1>
                                                                            {matchedActions.length > 0 ? (
                                                                                matchedActions.map((policy, index) => (
                                                                                    <div key={`${indicator.id}-${index}`} className="mb-3 last:mb-0">
                                                                                        <p className="text-sm font-bold text-blue-800">・{policy.name}</p>
                                                                                        <p className="text-sm text-gray-600 ml-4 mb-1">{policy.summary}</p>
                                                                                            <p className="text-xs text-black text-right">
                                                                                                参考自治体: {policy.referenceMunicipalities.join(" / ")}
                                                                                            </p>
                                                                                    </div>
                                                                                ))
                                                                            ) : (
                                                                                <p className="text-sm text-gray-400">特に改善する必要はありません。</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </main>)}
                </div>
            </div>
            <Footer />
        </>
    );
}