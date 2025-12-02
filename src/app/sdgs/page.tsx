"use client";
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { getSdgsGoalsForChart } from './sdgs-data';
import FactorDecomposition from '../components/FactorDecomposition';
import RadarChart from './radar_chart';
import { MunicipalityData } from './types';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { SelectRegion } from '../components/SelectRegion';
import { DataInfo } from '../components/BasicInfo';
import { ScoreGrid } from '../components/ScoreGrid';
import AIInsight from '../components/AIInsight';
import { Sidebar } from '../components/Sidebar';
import { useStateStore } from '../store/useStateStore';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function DashboardPage(){
    const [currentData, setCurrentData] = useState<MunicipalityData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const sdgsGoals = getSdgsGoalsForChart();

    const getStatus = (score: number) => {
        if (score >= 85) return { status: "優秀", color: "text-green-600", bgColor: "bg-green-100" };
        if (score >= 70) return { status: "順調", color: "text-blue-600", bgColor: "bg-blue-100" };
        return { status: "要改善", color: "text-orange-600", bgColor: "bg-orange-100" };
    };
    const getMunicipalityChartData = () => {
        if (!currentData) return null;

        const progressChartData = {
            labels: sdgsGoals.map(goal => `SDG${goal.id}`),
            datasets: [
                {
                    label: "進捗度スコア(%)",
                    data: currentData.scores.goals,
                    backgroundColor: sdgsGoals.map(goal => goal.color),
                    borderColor: sdgsGoals.map(goal => goal.color),
                    borderWidth: 1,
                },
            ],
        };
        return progressChartData;
    };

    const chartData = getMunicipalityChartData();

    const handleMunicipalitySelect = (municipality: MunicipalityData | null) => {
        if (municipality) {
            setIsLoading(true);
            setCurrentData(municipality);
            setIsLoading(false);
        } else {
            setCurrentData(null);
        }
    };

    const {sidebarOpen, setSidebarOpen} = useStateStore();
    
      function OperateSidebar(){
        setSidebarOpen(true);
      }

    return (
        <>
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-green-50">
            <Sidebar />
            {/*<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">*/}
            <div className="flex-1 flex flex-col min-h-screen">
                <Header />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {!currentData && (
                    <SelectRegion currentData={currentData} onMunicipalitySelect={handleMunicipalitySelect}/>
                    )}
                {currentData && !isLoading && (
                    <div className="space-y-6">
                        {/*基本情報表示 */}
                        <DataInfo currentData={currentData} onReset={() => setCurrentData(null)} />
                    {/*選択した市区町村のスコア表示 */}
                    {/*<div className="bg-white rounded-xl shadow-sm p-6">
                        <ScoreGrid sdgsGoals={sdgsGoals} currentData={currentData} />
                    </div>
                        <RadarChart municipalityData={currentData} className='mb-8'/>}
                        {/*その他*/}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-sm p-4 lg:col-span-2">
                                    <h3 className="text-lg font-bold text-gray-900 text-center">SDGs目標別スコア</h3>
                                    {chartData && (<Bar 
                                        data={chartData}
                                        options={{
                                            responsive:true,
                                            plugins:{
                                                legend:{display:false},
                                            },
                                            scales:{
                                                y:{
                                                    beginAtZero:true,
                                                    max:100,
                                                    ticks:{
                                                        callback: function(value){
                                                            return value +"%";
                                                        }
                                                    }
                                                },
                                            },
                                        }}
                                    />)}
                            </div>
                                <RadarChart municipalityData={currentData} className=''/>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <FactorDecomposition />

                            <AIInsight municipalityData={currentData} />
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <ScoreGrid sdgsGoals={sdgsGoals} currentData={currentData} />
                        </div>


                        
                    </div>
                )}
            </div>
            </div>
        </div>
        <Footer />
        </>
    )
}