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
import { MunicipalityData} from './types';
import { getSdgsGoalsForChart } from "./sdgs-data";




ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  municipalityData: MunicipalityData;
  className?: string;
}

export default function RadarChart( {municipalityData , className = ""}:RadarChartProps){
    const sdgsGoals = getSdgsGoalsForChart();

    //レーダーチャートようにデータを作成
    const radarData = {
        labels: sdgsGoals.map(goal => `GOAL${goal.id}`),
        datasets:[
            {
                label: `${municipalityData.prefecture} ${municipalityData.name}`,
                data: municipalityData.scores.goals,
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
        ],
    };

    //レーダーチャートのオプション
    const options = {
        responsive:true,
        maintainAspectRatio:false,
        plugins:{
            legend: {
            position: "top" as const,
            labels: {
            font: {
                size: 12,
            },
         },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        callbacks:{
            label: function(context:{dataIndex:number; parsed:{r:number}}){
                const goalIndex = context.dataIndex;
                const goalInfo = sdgsGoals[goalIndex];
                return [
                    `${goalInfo.title}`,
                    `スコア: ${context.parsed.r}%`
                ];
            },
        },
        },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        pointLabels: {
          font: {
            size: 10,
          },
          color: "#374151",
        },
        ticks: {
          beginAtZero: true,
          max: 100,
          stepSize: 20,
          color: "#6B7280",
          backdropColor: "transparent",
          callback: function(value: string | number) {
            return value + '%';
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.2,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };



    // 最も高いスコアと最も低いスコアを特定する
  const scores = municipalityData.scores.goals;
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const maxIndex = scores.indexOf(maxScore);
  const minIndex = scores.indexOf(minScore);

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="felx items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">スコアレーダーチャート</h3>
          <p className="text-sm text-gray-600">17のゴールのスコアを総合的に可視化します</p>
        </div>
      </div>
        {/* レーダーチャート */}
      <div className="relative h-96 mb-6">
        <Radar data={radarData} options={options} />
      </div>
      {/*最高スコアと最低スコアの表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              最高スコア: SDG{sdgsGoals[maxIndex].id}
            </div>
            <div className="text-xs text-gray-600">
              {sdgsGoals[maxIndex].title} ({maxScore}%)
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              最低スコア: SDG{sdgsGoals[minIndex].id}
            </div>
            <div className="text-xs text-gray-600">
              {sdgsGoals[minIndex].title} ({minScore}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}