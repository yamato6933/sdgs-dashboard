'use client';
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { SelectRegion } from "../components/SelectRegion";
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
         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex gap-8">
                    {/* サイドバー */}
                    <aside className="w-64 bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-bold mb-4">サイドバー</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-blue-600 hover:underline">比較項目1</a></li>
                            <li><a href="#" className="text-blue-600 hover:underline">比較項目2</a></li>
                            <li><a href="#" className="text-blue-600 hover:underline">比較項目3</a></li>
                        </ul>
                    </aside>
                    {/* メインコンテンツ */}
                    <section className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">比較モード</h2>
                        <p className="text-gray-700">ここに比較モードのコンテンツを追加します。</p>
                        <SelectRegion currentData={currentData} onMunicipalitySelect={handleMunicipalitySelect}/>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}

