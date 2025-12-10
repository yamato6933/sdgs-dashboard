import { MunicipalityData } from "../sdgs/types";
import { getRegionByPrefecture } from "../sdgs/municipality/region-mapping";
import PrefectureSelection from "../sdgs/municipality/prefectureselection";

export function SelectObject({ currentData, onMunicipalitySelect }: { currentData: MunicipalityData | null; onMunicipalitySelect: (municipality: MunicipalityData | null) => void }) {
    return(
        <>
            <div className="bg-white rounded-none md:rounded-xl shadow-sm md:p-6 p-4 md:mb-8 mb-4">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
                        <div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">地域を選択 / 検索</h2>
                        <p className="text-xs md:text-sm text-gray-600">比較したい市区町村を選択してください</p>
                        </div>
                        {currentData && (
                            <div className="flex flex-wrap items-center gap-2">
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