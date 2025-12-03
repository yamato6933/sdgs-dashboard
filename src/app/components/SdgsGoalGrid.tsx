import Image from "next/image";
import { SDGS_GOALS } from "../sdgs/sdgs-data";
import { useState } from "react";

export function SdgsGoalGrid(){
    const [hoveredGoal, setHoveredGoal] = useState<number | null>(null);
    return(
        <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">17の持続可能な開発目標</h3>
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {SDGS_GOALS.map((goal) => (
                    <div
                      key={goal.id}
                      className="rounded-lg p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      style={{ backgroundColor: goal.color }}
                      onMouseEnter={() => setHoveredGoal(goal.id)}
                      onMouseLeave={() => setHoveredGoal(null)}
                    >
                    <div className="text-center">
                        <div className="flex justify-center mb-3">
                          <Image 
                            src={`/sdgs_goals_icons/${goal.id}.png`}
                            alt={`SDG ${goal.id} アイコン`}
                            width={96}
                            height={96}
                            className="w-24 h-24 object-contain bg-white bg-opacity-20 rounded-lg p-3"
                          />
                        </div>
                        <div className="text-2xl font-bold mb-2">{goal.id}</div>
                        <h4 className="font-semibold text-sm leading-tight mb-2">{goal.title}</h4>
                        {hoveredGoal === goal.id && (
                          <p className="text-xs opacity-90 leading-relaxed">{goal.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
    )
}