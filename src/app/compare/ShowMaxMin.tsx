import { MunicipalityData } from "../sdgs/types";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export function ShowMaxMin({currentData, compareData}: {currentData: MunicipalityData | null; compareData: MunicipalityData | null}) {
    const calDiff = () => {
        if (!currentData || !compareData) return null;
        let diffMax = -Infinity;
        let indexMax = 0;
        let diffMin = Infinity;
        let indexMin = 0;
        currentData?.scores.goals.map((score, index) => {
        let diff = score - compareData!.scores.goals[index];
            if(diff > diffMax){
                diffMax = diff;
                indexMax = index;
            }
            if(diff < diffMin){
                diffMin = diff;
                indexMin = index;
            }  
        });
        return {diffMax, indexMax, diffMin, indexMin};
    };

    const {diffMax, indexMax, diffMin, indexMin} = calDiff() || {diffMax:0, indexMax:0, diffMin:0, indexMin:0};


    return(
        <div className="bg-white rounded-xl shadow-sm p-4">
            {currentData && compareData ? (
                <div className="space-y-4 grid-cols-2 gap-4 grid">
                    <div className="p-4 bg-green-50 rounded-lg col-span-1">
                        <h2 className="text-md font-semibold text-green-700">最大の差異</h2>
                        <div className="flex justify-center mb-4">
                            <img 
                            src={`/sdgs_goals_icons/${indexMax+1}.png`}
                            alt={`SDG ${indexMax+1} アイコン`}
                            className="w-48 h-48"
                            />
                            <div className="mt-4">
                                <h1 className="text-lg font-semibold text-center text-gray-900 mb-2">ゴール{indexMax + 1}</h1>
                                <div className="flex justify-center mb-2">
                                    <TrendingUpIcon className="text-green-500 mr-2"/>
                                    <p className="text-gray-800">{currentData.name}のスコアが{compareData.name}よりも{diffMax.toFixed(2)}ポイント高いです。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg col-span-1">
                        <h2 className="font-semibold text-red-700">最小の差異</h2>
                        <div className="flex justify-center mb-4">
                            <img 
                            src={`/sdgs_goals_icons/${indexMin+1}.png`}
                            alt={`SDG ${indexMin+1} アイコン`}
                            className="w-48 h-48"
                            />
                            <div className="mt-4">
                                <h1 className="text-lg font-semibold text-center text-gray-900 mb-2">ゴール{indexMin + 1}</h1>
                                <div className="flex justify-center mb-2">
                                    <TrendingDownIcon className="text-red-500 mr-2"/>
                                    <p className="text-gray-800">ゴール{indexMin + 1}: {currentData.name}のスコアが{compareData.name}よりも{Math.abs(diffMin).toFixed(2)}ポイント低いです。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ) : (
                <p className="text-gray-600">比較する市区町村を選択してください。</p>
            )
            }
        </div>

    )
}