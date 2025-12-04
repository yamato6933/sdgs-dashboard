import { MunicipalityData } from "../sdgs/types";
import { getRegionByPrefecture } from "../sdgs/municipality/region-mapping";
import PrefectureSelection from "../sdgs/municipality/prefectureselection";

export function SelectOb_Policy({ currentData, onMunicipalitySelect }: { currentData: MunicipalityData | null; onMunicipalitySelect: (municipality: MunicipalityData | null) => void }) {
    return(
        <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                        <h2 className="text-xl font-bold text-gray-900">地域を選択 / 検索</h2>
                        <p className="text-sm text-gray-600">政策を見る市区町村を選択してください</p>
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
        </>
    )
}