import { IndexDataGoal4, PolicyActionsGoal4, TargetDataGoal4 } from "./IndexData";

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

export function ShowPolicy({selectedGoal, setSelectIndex }: { selectedGoal: number; setSelectIndex: (index: number) => void; } ) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">GOAL {selectedGoal} に関する指標一覧と政策立案</h3>
                {IndexDataGoal4.filter((goalData) => goalData.goal === selectedGoal).map((goalData) => (
                    <div key={goalData.goal} className="space-y-4">
                        {goalData.indicators.map((indicator) => {
                            // 修正点4: 変数定義と return の構文を修正
                            const matchedActions = PolicyActionsGoal4.find((action) => action.indicatorId === indicator.id)?.actions ?? [];
                            const targetScore = TargetDataGoal4.find((target) => target.target === indicator.id)?.targetScore || 'N/A';

                            return (
                                <div key={indicator.id} className="border rounded-lg overflow-hidden">
                                    <div className="bg-blue-50 flex justify-between items-center px-4 py-3">
                                        <h4 className="text-md font-semibold text-gray-900" onClick={() => { setSelectIndex(indicator.id) }}>
                                            {indicator.title}
                                        </h4>
                                        <button
                                            onClick={() => {
                                                setSelectIndex(indicator.id)
                                                scrollToTop();
                                            }}
                                            className="mt-2 px-4 py-1 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition-colors text-sm font-medium">
                                            この指標の目標値との差を見る
                                        </button>

                                    </div>
                                    <div className="grid grid-cols-3 border-t border-gray-200">
                                        <div className="col-span-1 p-4 bg-gray-50">
                                            {matchedActions.length > 0 ? (
                                                <>
                                                    <div className="mb-2">
                                                        <span className="text-xs text-gray-500 block">現在のスコア</span>
                                                        <span className="text-lg font-bold text-gray-800">{indicator.score}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 block">目標スコア</span>
                                                        <span className="text-lg font-bold text-green-600">{targetScore}</span>
                                                    </div>
                                                </>) : (
                                                <>
                                                    <div className="mb-2">
                                                        <span className="text-xs text-gray-500 block">現在のスコア</span>
                                                        <span className="text-lg font-bold text-gray-800">{indicator.score}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 block">目標スコア</span>
                                                        <span className="text-lg font-bold text-gray-800">{targetScore}</span>
                                                    </div>
                                                </>
                                            )
                                            }
                                        </div>
                                        <div className="col-span-2 border-l border-gray-200 px-4 py-3 bg-white">
                                            <h1 className="text-lg mb-2 font-bold">政策の提案</h1>
                                            {matchedActions.length > 0 ? (
                                                matchedActions.map((policy, index) => (
                                                    <div key={`${indicator.id}-${index}`} className="mb-3 last:mb-0">
                                                        <p className="text-sm font-bold text-blue-800">・{policy.name}</p>
                                                        <p className="text-sm text-gray-600 ml-4 mb-1">{policy.summary}</p>
                                                        <p className="text-xs text-black text-right">
                                                            参考自治体: {policy.referenceMunicipalities.join(" / ")}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400">特に改善する必要はありません。</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </>
    )
}