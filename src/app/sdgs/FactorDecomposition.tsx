'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { goalFeatures, GoalId, getAllGoals } from './feature-factors';
import { getSdgsGoalsForChart } from './sdgs-data';

interface FactorDecompositionProps {
  className?: string;
}

export default function FactorDecomposition({ className = '' }: FactorDecompositionProps) {
  const [selectedGoal, setSelectedGoal] = useState<GoalId | null>(null);
  const sdgsGoals = getSdgsGoalsForChart();
  const allGoals = getAllGoals();

  const handleGoalClick = (goalId: GoalId) => {
    setSelectedGoal(selectedGoal === goalId ? null : goalId);
  };

  const getSelectedGoalInfo = () => {
    if (!selectedGoal) return null;
    return sdgsGoals.find(goal => goal.id === selectedGoal);
  };

  const selectedGoalInfo = getSelectedGoalInfo();
  const features = selectedGoal ? goalFeatures[selectedGoal] : [];

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">要因分解</h3>
      
      {/* ゴール選択グリッド */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          SDGsゴールをクリックして、スコア算出に使用された特徴量を表示します
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 xl:grid-cols-17 gap-2">
          {allGoals.map((goalId) => {
            const goal = sdgsGoals.find(g => g.id === goalId);
            if (!goal) return null;
            
            const isSelected = selectedGoal === goalId;
            
            return (
              <button
                key={goalId}
                onClick={() => handleGoalClick(goalId)}
                className={`
                  relative group rounded-lg p-2 transition-all duration-200
                  ${isSelected 
                    ? 'bg-blue-100 ring-2 ring-blue-500 shadow-md' 
                    : 'bg-gray-50 hover:bg-gray-100 hover:shadow-sm'
                  }
                `}
                title={`GOAL ${goal.id}: ${goal.title}`}
              >
                <Image
                  src={`/sdgs_goals_icons/${goal.id}.png`}
                  alt={`SDG ${goal.id} アイコン`}
                  width={48}
                  height={48}
                  className="w-full h-auto object-contain"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg"></div>
                )}
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gray-800 text-white text-xs px-1 py-0.5 rounded text-center min-w-max">
                    GOAL {goal.id}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 選択されたゴールの情報表示 */}
      {selectedGoalInfo && (
        <div className="border-t pt-6">
          <div className="flex items-center space-x-3 mb-4">
            <Image
              src={`/sdgs_goals_icons/${selectedGoalInfo.id}.png`}
              alt={`SDG ${selectedGoalInfo.id} アイコン`}
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                GOAL {selectedGoalInfo.id}: {selectedGoalInfo.title}
              </h4>
              <p className="text-sm text-gray-600">
                スコア算出に使用された特徴量 ({features.length}項目)
              </p>
            </div>
          </div>

          {/* 特徴量リスト */}
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <span className="text-gray-800 text-sm leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* 説明文 */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 これらの特徴量は、GOAL {selectedGoalInfo.id}のスコア算出において重要な要因として使用されています。
              各項目の値が高いほど、該当するSDGsゴールの達成度が高いと評価されます。
            </p>
          </div>
        </div>
      )}

      {/* デフォルト表示（何も選択されていない場合） */}
      {!selectedGoal && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            SDGsゴールを選択してください
          </h4>
          <p className="text-gray-600 text-sm">
            上のSDGsアイコンをクリックすると、そのゴールのスコア算出に使用された特徴量が表示されます
          </p>
        </div>
      )}
    </div>
  );
}
