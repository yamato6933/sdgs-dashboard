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
        min: 0,
        max: 100,
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
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>
      <div className="items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 text-center">スコアレーダーチャート</h3>
        </div>
      </div>
      <div className="relative h-80 w-full">
        <Radar data={radarData} options={options} />
      </div>
    </div>
  )
}