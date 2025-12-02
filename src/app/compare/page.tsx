'use client';
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { MunicipalityData } from "../sdgs/types";
import { useState } from "react";
import { SelectObject } from "./SelectObject";
import { BarGraph } from "./BarGraph";
import CompareRadarChart from "./CompareRadarChart";
import { ShowMaxMin } from "./ShowMaxMin";
import FactorDecomposition from "../components/FactorDecomposition";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

export default function Compare(){
    const [currentData, setCurrentData] = useState<MunicipalityData | null>(null);
    const [compareData, setCompareData] = useState<MunicipalityData | null>(null);
    const [compare, setCompare] = useState(false);

    const handleMunicipalitySelect = (municipality: MunicipalityData | null) => {
        if (municipality) {
            setCurrentData(municipality);
        } else {
            setCurrentData(null);
        }
    };

    const handleCompareSelect = (municipality: MunicipalityData | null) => {
        if (municipality) {
            setCompareData(municipality);
        } else {
            setCompareData(null);
        }
    };

    const handleClickCompare = () => {
        if(currentData && compareData){
            return setCompare(true);
        } else{
            return alert("比較する市区町村を両方選択してください");
        }
    };
    return (
        <>
         <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-green-50">
            {/* サイドバー */}
            <Sidebar />
            {/* メインコンテンツ */}
            <div className="flex-1 flex flex-col min-h-screen">
                <Header />
                    {!compare && (
                        <>
                        <main className="flex-1 p-6">
                            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">比較モード</h2>
                            <SelectObject currentData={currentData} onMunicipalitySelect={handleMunicipalitySelect}/>
                            <SelectObject currentData={compareData} onMunicipalitySelect={handleCompareSelect}/>
                            <div className="my-4 border-t item-center border-gray-300">
                                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick = {handleClickCompare}>
                                    比較を実行
                                </button>
                            </div>
                            
                        </main>

                        </>
                    )}
                    {compare && (
                    <>
                    <div className="grid max-w-7xl mx-auto px-10 py-2 grid-cols-4 gap-6">
                    <div className="mt-4 bg-white rounded-xl shadow-sm p-4 justify-between flex justify-center gap-4 col-span-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-semibold text-gray-900">
                                対象: {currentData?.name}
                            </h1>

                            <CompareArrowsIcon />

                            <h1 className="text-lg font-semibold text-gray-900">
                                比較: {compareData?.name}
                            </h1>
                        </div>
                    </div>
                    <div>
                        <button className="mt-4 px-10 py-5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors" onClick={() => setCompare(false)}>
                        他の市区町村で比較
                        </button>
                    </div>
                    </div>
                        <div className="grid gap-6 p-6 md:grid-cols-1 lg:grid-cols-3">
                            {currentData && compareData && (
                                <>
                                    <div className="lg:col-span-2">
                                        <BarGraph currentData={currentData} compareData={compareData} />
                                     </div>
                                     <div>
                                        <CompareRadarChart currentData={currentData} compareData={compareData}/>
                                     </div>
                                </>)}
                        </div>
                        <div className="flex-grow">
                            <ShowMaxMin currentData={currentData} compareData={compareData}/>
                        </div>
                        <div className="p-6">
                            <FactorDecomposition />
                        </div>


                    </>
                    )}
            </div>
        </div>
        <Footer />
        </>

    )
}

