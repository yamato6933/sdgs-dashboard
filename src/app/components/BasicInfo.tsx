import { MunicipalityData } from "../sdgs/types";

export function DataInfo(currentData: MunicipalityData | null) {
    const getStatus = (score: number) => {
        if (score >= 85) return { status: "優秀", color: "text-green-600", bgColor: "bg-green-100" };
        if (score >= 70) return { status: "順調", color: "text-blue-600", bgColor: "bg-blue-100" };
        return { status: "要改善", color: "text-orange-600", bgColor: "bg-orange-100" };
    };
    if(currentData){
        return(
        <>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{currentData.prefecture} {currentData.name} SDGsスコア</h2>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">データベースから取得</div>
                        <div className="font-semibold text-green-600">2020年データ</div>
                    </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{currentData.scores.overall}%</div>
                    <div className="text-sm text-gray-600">総合スコア</div>
                    <div className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatus(currentData.scores.overall).color} ${getStatus(currentData.scores.overall).bgColor}`}>
                        {getStatus(currentData.scores.overall).status}
                    </div>
                </div>
                            
                <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                    {Math.max(...currentData.scores.goals).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">最高スコア</div>
                    <div className="flex items-center justify-center mt-1 space-x-1">
                        <img 
                        src={`/sdgs_goals_icons/${currentData.scores.goals.indexOf(Math.max(...currentData.scores.goals)) + 1}.png`}
                        alt={`SDG ${currentData.scores.goals.indexOf(Math.max(...currentData.scores.goals)) + 1} アイコン`}
                        className="w-4 h-4 object-contain"
                        />
                    <span className="text-xs text-gray-500">GOAL {currentData.scores.goals.indexOf(Math.max(...currentData.scores.goals)) + 1}</span>
                    </div>
                </div>
                
                <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                        {Math.min(...currentData.scores.goals).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">最低スコア</div>
                    <div className="flex items-center justify-center mt-1 space-x-1">
                        <img 
                            src={`/sdgs_goals_icons/${currentData.scores.goals.indexOf(Math.min(...currentData.scores.goals)) + 1}.png`}
                            alt={`SDG ${currentData.scores.goals.indexOf(Math.min(...currentData.scores.goals)) + 1} アイコン`}
                            className="w-4 h-4 object-contain"
                        />
                        <span className="text-xs text-gray-500">GOAL {currentData.scores.goals.indexOf(Math.min(...currentData.scores.goals)) + 1}</span>
                    </div>
                </div>
            </div>
        </div>
        </>)}

}