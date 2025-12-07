import Image from "next/image";
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
import { IndexDataGoal4, TargetDataGoal4 } from "./IndexData";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

export function ShowNetwork({ selectedGoal, handleGoalClick,selectIndex }: { selectedGoal: number; handleGoalClick: (goalId: number) => void; selectIndex: number; } ) {
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

    const chartData = selectIndex ? getChartData(selectIndex) : null;

    return (
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
                        className="w-24 h-auto object-contain mb-6" />
                    <button
                        onClick={() => handleGoalClick(selectedGoal)}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors w-full font-bold">
                        一覧に戻る
                    </button>
                    <div className="flex-1 w-full min-h-[300px] mt-4 relative">
                        {chartData && <Bar data={chartData} options={options} />}
                    </div>
                </div>
            </div>

        </>
    );
}