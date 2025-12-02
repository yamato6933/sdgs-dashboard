import { MunicipalityData } from "../sdgs/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getSdgsGoalsForChart } from "../sdgs/sdgs-data";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function BarGraph({ currentData, compareData}: { currentData: MunicipalityData | null , compareData: MunicipalityData | null}) {
    const sdgsGoals = getSdgsGoalsForChart();
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'SDGsゴール別スコア比較',
            }
        },
    }
    const labels = sdgsGoals.map(goal => `SDG${goal.id}`);

    const data = {
        labels,
        datasets: [
            {
                label: currentData ? `${currentData.prefecture} ${currentData.name}` : '現在の市区町村',
                data: currentData ? currentData.scores.goals : [],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: compareData ? `${compareData.prefecture} ${compareData.name}` : '比較対象の市区町村',
                data: compareData ? compareData.scores.goals : [],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    }
    return(
        <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="w-full h-96">
                <Bar options={options} data={data} />
            </div>
        </div>
    )
}