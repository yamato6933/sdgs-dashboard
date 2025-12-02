import { MunicipalityData } from "../sdgs/types";
import { getRegionByPrefecture } from "../sdgs/municipality/region-mapping";
import PrefectureSelection from "../sdgs/municipality/prefectureselection";

export function SelectRegion({ currentData, onMunicipalitySelect }: { currentData: MunicipalityData | null; onMunicipalitySelect: (municipality: MunicipalityData | null) => void }) {
     {/*const [currentData, setCurrentData] = useState<MunicipalityData | null>(null);
     const [isLoading, setIsLoading] = useState<boolean>(false);
    // 市区町村選択時のハンドラー
     const handleMunicipalitySelect = (municipality: MunicipalityData | null) => {
        if (municipality) {
            setIsLoading(true);
            setCurrentData(municipality);
            setIsLoading(false);
        } else {
            setCurrentData(null);
        }
    };*/}
    return(
        <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                        <h2 className="text-xl font-bold text-gray-900">地域を選択 / 検索</h2>
                        <p className="text-sm text-gray-600">分析したい市区町村を選択するか、検索ボックスで直接検索してください。市区町村を選択するとスコアを取得します。</p>
                        </div>
                        {currentData && (
                            <div className="flex items-center space-x-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                                    選択中: {currentData.prefecture} {currentData.name}
                                </span>
                                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
                                    {getRegionByPrefecture(currentData.prefecture)?.description || '不明'}
                                </span>
                            </div>
                        )}
                        </div>
                        {/*PrefectureSelectコンポーネントを表示 */}
                        <div className="w-full">
                            <PrefectureSelection
                                onMunicipalitySelect={onMunicipalitySelect}
                                placeholder="選択してください"
                                searchPlaceholder="例: 渋谷区、横浜市、大阪..."
                            className="w-full"
                            />
                    </div>
                </div>
            </div>
                {/* 市区町村未選択時の案内 */}
                {!currentData && (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="text-6xl mb-4">🏘️</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">地域を選択してください</h2>
                            <p className="text-gray-600 mb-8">
                                都道府県と市区町村を選択するか、検索ボックスで市区町村名を入力すると、その地域のSDGsスコアと詳細な分析結果を表示します。
                            </p>
                            <div className="bg-green-50 rounded-lg p-4">
                                 <p className="text-sm text-green-800">
                                    データベースから実際のSDGsスコアデータを取得して表示しています。データは2020年のSDGsスコアに基づいています。
                                </p>
                            </div>
                        </div>
                    </div>
                )}
        </>
    )
}