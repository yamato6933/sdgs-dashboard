import Image from "next/image";

export function SelectGoal({ handleGoalClick }: { handleGoalClick: (goalId: number) => void }) {
    const GOAL_IDS = Array.from({ length: 17 }, (_, i) => i + 1);
    return (
        <>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
                {GOAL_IDS.map((goalId) => (
                    <button
                        key={goalId}
                        onClick={() => handleGoalClick(goalId)}
                        className="relative group rounded-lg p-1 transition-all duration-200 hover:scale-110"
                        style={{ width: 'calc(100% / 18)' }}
                    >
                        <Image
                            src={`/sdgs_goals_icons/${goalId}.png`}
                            alt={`SDG ${goalId} アイコン`}
                            width={48}
                            height={48}
                            className="w-full h-auto object-contain"
                        />
                    </button>
                ))}
            </div>
            <div className="mt-4 text-center text-gray-600">
                <p>各ゴールのアイコンをクリックして、指標と政策提案を表示します</p>
            </div>
        </>
    )
}
