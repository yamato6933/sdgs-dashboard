"use client"
import {Radar} from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { MunicipalityData } from "../sdgs/types";
import { getSdgsGoalsForChart } from "../sdgs/sdgs-data";




ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);


export default function CompareRadarChart( {currentData, compareData }:{currentData: MunicipalityData, compareData: MunicipalityData}){
    const sdgsGoals = getSdgsGoalsForChart();

    //レーダーチャートようにデータを作成
    const radarData = {
        labels: sdgsGoals.map(goal => `GOAL${goal.id}`),
        datasets:[
            {
                label: `${currentData.prefecture} ${currentData.name}`,
                data: currentData.scores.goals,
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                borderColor: "rgba(59, 130, 246, 1)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(59, 130, 246, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(59, 130, 246, 1)",
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: `${compareData.prefecture} ${compareData.name}`,
                data: compareData.scores.goals,
                backgroundColor: "rgba(220, 38, 38, 0.2)",
                borderColor: "rgba(220, 38, 38, 1)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(220, 38, 38, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(220, 38, 38, 1)",
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    //レーダーチャートのオプション
    const options = {
        responsive:true,
        maintainAspectRatio:false,
        plugins:{
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'レーダーチャート',
            },
        },
        scales: {
            r: {
                angleLines: {
                    display: true,
                },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: {
                    stepSize: 20,
                },
            },
        },
    };

   return (
     <div className='bg-white rounded-xl shadow-sm p-4'>
       <div className="w-full h-96">
         <Radar data={radarData} options={options} />
       </div>
     </div>
   );

}