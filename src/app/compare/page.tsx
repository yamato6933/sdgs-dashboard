'use client';
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { SelectRegion } from "../components/SelectRegion";
import { Sidebar } from "../components/Sidebar";
import { MunicipalityData } from "../sdgs/types";
import { useState } from "react";

export default function Compare(){
    const [currentData, setCurrentData] = useState<MunicipalityData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleMunicipalitySelect = (municipality: MunicipalityData | null) => {
        if (municipality) {
            setIsLoading(true);
            setCurrentData(municipality);
            setIsLoading(false);
        } else {
            setCurrentData(null);
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
                <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">比較モード</h2>
                    <p className="text-gray-700">ここに比較モードのコンテンツを追加します。</p>
                    <SelectRegion currentData={currentData} onMunicipalitySelect={handleMunicipalitySelect}/>
                </main>
            </div>
        </div>
        <Footer />
        </>
    )
}

