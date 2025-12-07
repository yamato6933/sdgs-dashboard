"use client";
import { useState } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { MunicipalityData } from "../sdgs/types";
import { SelectOb_Policy } from "./SelectOb_Policy";
import Input from "@mui/material/Input";
import { LoadingSpinner } from "./LoadingScreen";
import { ShowNetwork } from "./ShowNetwork";
import { ShowPolicy } from "./ShowPolicy";
import { SelectGoal } from "./SelectGoal";



export default function PolicyMaking() {
    const [currentData, setCurrentData] = useState<MunicipalityData | null>(null);
    const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
    const [selectIndex, setSelectIndex] = useState<number>(0);
    const [loading, setLoading] = useState(false);
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
                                <div className="mt-4 text-center text-gray-600">
                                    <h1 className="text-lg font-bold mb-2">⚠️現在開発途中です</h1>
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
                                        <SelectGoal handleGoalClick={handleGoalClick} />
                                    </>
                                )}

                                <div className="mt-6">
                                    {selectedGoal && (
                                        <>
                                            <ShowNetwork selectedGoal={selectedGoal} handleGoalClick={handleGoalClick} selectIndex={selectIndex} />
                                            <ShowPolicy selectedGoal={selectedGoal} setSelectIndex={setSelectIndex} />
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