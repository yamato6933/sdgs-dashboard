"use client";
import Link from 'next/link';
import { useState } from 'react';
import RadarChart from './radar_chart';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getRegionByPrefecture } from './municipality/region-mapping';
import AIInsight from './AIInsight';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import PrefectureSelection from './municipality/prefectureselection';
import { getSdgsGoalsForChart } from './sdgs-data';

type MunicipalityData = {
  id: string;
  name: string;
  population: number;
  area: number;
  prefecture: string;
  scores: {
    overall: number;
    goals: number[];
  };
};



export default function DashboardPage(){
    const [currentData, setCurrentData] = useState<MunicipalityData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const sdgsGoals = getSdgsGoalsForChart();

    //統計計算(必要か？？)
    const getStatus = (score: number) => {
    if (score >= 85) return { status: "優秀", color: "text-green-600", bgColor: "bg-green-100" };
    if (score >= 70) return { status: "順調", color: "text-blue-600", bgColor: "bg-blue-100" };
    return { status: "要改善", color: "text-orange-600", bgColor: "bg-orange-100" };
    };


    //チャートデータを用意
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

//市区町村選択時の処理（PrefectureSelectionコンポーネントから直接データを受け取る処置）
    const handleMunicipalitySelect = async (municipality:MunicipalityData | null) => {
        if(municipality) {
            setIsLoading(true);
            try{
                setCurrentData(municipality);
            } catch(error){
                console.error('Failed to set municipality data:', error);
                setCurrentData(municipality);
            } finally{
                setIsLoading(false);
            }
        } else{
            setCurrentData(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className='flex items-center space-x-4'>
                            <Link href="/" className='text-gray-600 hover:text-blue-800 transition-colors'>ホームへ</Link>
                            <h1 className='font-bold text-3xl text-gray-900'>SDGs ダッシュボード</h1>
                        </div>
                        <div className='flex items-center space-x-4'>
                            <nav className="hidden md:flex space-x-8">
                                <Link href="/policy" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                政策効果へ
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/*市区町村選択カード */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">地域を選択 / 検索</h2>
                                <p className="text-sm text-gray-600">分析したい市区町村を選択するか、検索ボックスで直接検索してください。市区町村を選択するとスコアを取得します。</p>
                            </div>
                        {currentData && (
                            <div className="flex items-center space-x-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                                    選択中: {currentData.prefecture} {currentData.name}
                                </span>
                                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
                                    {getRegionByPrefecture(currentData.prefecture)?.description || '不明'}
                                </span>
                            </div>
                        )}
                        </div>
                        {/*PrefectureSelectコンポーネントを表示 */}
                        <div className="w-full">
                            <PrefectureSelection
                                onMunicipalitySelect={handleMunicipalitySelect}
                                placeholder="選択してください"
                                searchPlaceholder="例: 渋谷区、横浜市、大阪..."
                            className="w-full"
                            />
                        </div>
                    </div>
                </div>
                {/*市区町村が未選択の時の案内（！！用改善！！） */}
                {!currentData && (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="text-6xl mb-4">🏘️</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">地域を選択してください</h2>
                            <p className="text-gray-600 mb-8">
                                都道府県と市区町村を選択するか、検索ボックスで市区町村名を入力すると、その地域のSDGsスコアと詳細な分析結果を表示します。
                            </p>
                            <div className="bg-green-50 rounded-lg p-4">
                                 <p className="text-sm text-green-800">
                                    データベースから実際のSDGsスコアデータを取得して表示しています。データは2020年のSDGsスコアに基づいています。
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {/*ローディング中の表示 */}
                {isLoading && (
                    <div className="text-center py-16">
                        <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">データを読み込み中...</p>
                    </div>
                )}


             



                {currentData && !isLoading && (
                    <div className="space-y-8">

                        {/* 基本情報カード */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                            <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">{currentData.prefecture} {currentData.name} SDGsスコア</h2>
                            <div className="text-right">
                                <div className="text-sm text-gray-600">データベースから取得</div>
                                <div className="font-semibold text-green-600">2020年データ</div>
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-1">{currentData.scores.overall}%</div>
                                <div className="text-sm text-gray-600">総合スコア</div>
                                <div className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatus(currentData.scores.overall).color} ${getStatus(currentData.scores.overall).bgColor}`}>
                                    {getStatus(currentData.scores.overall).status}
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 mb-1">
                                    {Math.max(...currentData.scores.goals).toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600">最高スコア</div>
                                <div className="flex items-center justify-center mt-1 space-x-1">
                                    <img 
                                        src={`/sdgs_goals_icons/${currentData.scores.goals.indexOf(Math.max(...currentData.scores.goals)) + 1}.png`}
                                        alt={`SDG ${currentData.scores.goals.indexOf(Math.max(...currentData.scores.goals)) + 1} アイコン`}
                                        className="w-4 h-4 object-contain"
                                    />
                                    <span className="text-xs text-gray-500">
                                        GOAL {currentData.scores.goals.indexOf(Math.max(...currentData.scores.goals)) + 1}
                                    </span>
                                </div>
                            </div>
                
                            <div className="text-center">
                                 <div className="text-3xl font-bold text-orange-600 mb-1">
                                    {Math.min(...currentData.scores.goals).toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600">最低スコア</div>
                                <div className="flex items-center justify-center mt-1 space-x-1">
                                    <img 
                                        src={`/sdgs_goals_icons/${currentData.scores.goals.indexOf(Math.min(...currentData.scores.goals)) + 1}.png`}
                                        alt={`SDG ${currentData.scores.goals.indexOf(Math.min(...currentData.scores.goals)) + 1} アイコン`}
                                        className="w-4 h-4 object-contain"
                                    />
                                    <span className="text-xs text-gray-500">
                                        GOAL {currentData.scores.goals.indexOf(Math.min(...currentData.scores.goals)) + 1}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*選択した市区町村のスコア表示 */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">SDGs目標詳細スコア</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {sdgsGoals.map((goal, index) => {
                            const score = currentData.scores.goals[index];
                            const status = getStatus(score);
                        return (
                            <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <img 
                                            src={`/sdgs_goals_icons/${goal.id}.png`}
                                            alt={`SDG ${goal.id} アイコン`}
                                            className="w-8 h-8 object-contain"
                                        />
                                        <span className="font-bold text-gray-900">GOAL {goal.id}</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} ${status.bgColor}`}>
                                        {status.status}
                                     </span>
                                </div>
                                <h4 className="font-medium text-sm text-gray-900 mb-3 leading-tight">{goal.title}</h4>
                                <div className="mb-2">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">スコア</span>
                                        <span className="font-medium text-gray-900">{score}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{ 
                                            width: `${score}%`, 
                                            backgroundColor: goal.color 
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                </div>
                            );
                            })}
                            </div>
                        </div>

                        {/*レーダーチャート */}
                        <RadarChart municipalityData={currentData} className='mb-8'/>

                        {/*その他*/}
                        {chartData && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/*棒グラフ表示 */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">SDGs目標別スコア</h3>
                                    <Bar 
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
                                    />
                                </div>

                                {/* 要因分解 */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">要因分解</h3>
                                </div>


                            </div>
                        )}


                        {/* AIインサイト */}
                        <AIInsight municipalityData={currentData} />
                    </div>
                )}
            </div>

            
        </div>

    )
}