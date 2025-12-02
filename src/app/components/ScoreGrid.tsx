import { MunicipalityData } from "../sdgs/types";

export function ScoreGrid({ sdgsGoals, currentData }: { sdgsGoals: { id: number; title: string; color: string; }[]; currentData: MunicipalityData }) {
    const getStatus = (score: number) => {
        if (score >= 85) return { status: "優秀", color: "text-green-600", bgColor: "bg-green-100" };
        if (score >= 70) return { status: "順調", color: "text-blue-600", bgColor: "bg-blue-100" };
        return { status: "要改善", color: "text-orange-600", bgColor: "bg-orange-100" };
    };
    return(
        <>
        <h3 className="text-lg font-bold text-gray-900 mb-6">SDGs目標詳細スコア</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sdgsGoals.map((goal, index) => {
                const rawScore = currentData.scores.goals[index] ?? 0;
                const parsedScore = typeof rawScore === 'string' ? parseFloat(rawScore) : rawScore;
                const score = parsedScore.toFixed(1);
                const score_ = parseFloat(score);
                const status = getStatus(score_); //もうちょいリファクタリング
                        return (
                            <div key={goal.id} className="border border-gray-200 rounded-lg p-2 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <img 
                                            src={`/sdgs_goals_icons/${goal.id}.png`}
                                            alt={`SDG ${goal.id} アイコン`}
                                            className="w-8 h-8 object-contain"
                                        />
                                        <span className="font-bold text-gray-900">GOAL {goal.id}</span>
                                    </div>
                                    {/*<span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} ${status.bgColor}`}>
                                        {status.status}
                                     </span>*/}
                                </div>
                                {/*<h4 className="font-medium text-sm text-gray-900 mb-3 leading-tight">{goal.title}</h4>*/}

                                <div className="mb-2">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">スコア</span>
                                        <span className="font-medium text-gray-900">{score_}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{ 
                                            width: `${score_}%`, 
                                            backgroundColor: goal.color 
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                </div>
                            );
                            })}
                            </div>
        </>
    )
}